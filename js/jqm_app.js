jQuery(document).ready(function () {

    //init the map

    search_app = {
        user_position : {latitude:0,longitude:0},
        map_list:[],
        first : function(){ 
            return this.map_list[0];
        },
        next : function(){
            n=this.map_list.shift();
            this.map_list.push(n);
            return this.first();
        },
        zoom_frames : function(){
            for (var i = 0, len = this.map_list.length; i < len; ++i){
                console.log($(this.map_list[i].map_div()).attr('id'),
                    this.map_list[i].zoom_frame());
            }
        } 
    };    
    
    var map_template = ['<div id="','" class="ui-content search_map" role="main" data-role="content" data-theme="b"></div>'];
            
    var map_config = { 
        google_road:{id : 'google_road',maker : googleMap},
        mapbox: {id : 'mapbox_road', maker:mapboxMap,options:{map_url:'jdungan.map-lc7x2770'}},
        google_sattellite : {id : 'google_satellite', maker:googleMap}
    };
    
    for (var m in map_config) {
        map_config[m].options = map_config[m].options || {};
        $('#map_holder').append(map_template.join(map_config[m].id));
        search_app.map_list.push(
            new map_config[m].maker(document.getElementById(map_config[m].id),
            map_config[m].options));
        $('#'+map_config[m].id).remove();
    };

    $('#map_holder').append(search_app.first().map_div());

    // $('#map_holder').append(search_app.first());

    // init search data
    var search_data = search_data || new search_db();

    //init socket
    var socket = io.connect('http://206.214.164.229');

    socket.on('message', function (data) {
       $.event.trigger(data.message.eventType,data.message.payload);      
    });  

    //socket events
    $(document).on("newSearch", function (e, response) {
        $('.search_map').trigger('display_search', [response]);
    });

    $(document).on("endSearch", function (e, response) {
        $('.search_map').trigger('end_search', [response]);
    });

    $(document).on("moveSearch", function (e, response) {
        $('.search_map').trigger('move_search', [response]);
    });

    //client events
    $(document).on("endSearch_click", function (e, marker_key) {
        search_data.place.update(marker_key,
            { extra: { end_time: Date()} })
        .done(function (response) {
            $.event.trigger("endSearch", response);
            socket.emit('message', { eventType: 'endSearch', payload: response });
        });
    });

    $(document).on("markerMove", function (e, marker_key) {
        marker = ttown.searches[marker_key];
        search_data.place.update(marker_key,
            { latitude: marker.position.lat(),
                longitude: marker.position.lng()
            })
        .done(function (response) {
            socket.emit('message', { eventType: 'moveSearch', payload: response });
        });
    });

    $('a#toggle_map').on('click', function () {

        current_map=search_app.first();
        next_map=search_app.next();
        $('#map_holder').append(next_map.map_div());
        $('#map_holder').trigger('page_resize');        
        $(current_map.map_div()).remove()
        next_map.zoom_frame(current_map.zoom_frame());
    });

    //jqm page events 
    // $("#mapPage").on("pageshow", function () {        
    //     $('.search_map').trigger('page_resize');
    // });

// layer panel

    function refresh_layer_list() {
        $('.layer_item').remove();
        search_data.layers.each(function(layer){
            $('#layer_list').append( 
               "<li class='layer_item' data-layer_id="+layer.layer_id+">\
                   <a  data-role='button' data-rel='dialog'>\
                       <i class='icon-copy' data-layer_id="+layer.layer_id+"\
                        data-layer_name='"+layer.name+"'></i>&nbsp;"+layer.name+"&nbsp;\
                   </a>\
               </li>"           
            )})
            .done(function(){
                $("#layer_list").listview('refresh').trigger("create");
                $("li.layer_item").on('click',function(){
                    layer_id = $(this).data('layer_id');
                    layer_name = $(this).text()
                    $('li#current_layer').data('current-layer',layer_id);
                    $('li p#layer_label').text(layer_name);                
                    displayLayer(layer_id);
                });
            });
    };

    function displayLayer(layer_id) {
        search_data.places.each({ layer_id: layer_id }, function (response) {
            $('.search_map').trigger('display_search', [response]);
        })
        .done(function () {
            $('.search_map').trigger('display_all');
        });   
    };

    $('button#save_new_layer').click(function(e){        
        layer_name = $('input#layer_name').val();
        search_data.layers.add(layer_name)
        .done(function(){
            $('input#layer_name').val('');
            refresh_layer_list();
            $('#new_layer_popup').popup( "close" );
        });
    });

    $('a#delLayer').on('click',function(e){
        e.stopImmediatePropagation();
        $('.layer_item i').attr('class','icon-remove-sign')
        $('.layer_item i').on('click',function(e){
            $('#delete_layer_name').text( $(this).data('layer_name'));
            $('#delete_layer_name').data('layer_id',$(this).data('layer_id'))
            $('#delete_layer_popup').popup( "open" );
        });
    });
    
    $('#layer_panel').on( "panelclose", function( event, ui ) {
        $('.layer_item i').on('click',null);
        $('.layer_item i').attr('class','icon-copy');
    });

    $( "#delete_layer_popup" ).on( "popupafterclose",function(){
        $('#delete_layer_name').data('layer_id','');
        $('#delete_layer_name').text( '' );
    });

    $('button#submit_delete_layer').on('click',function(e){
        layer_id = $('#delete_layer_name').data('layer_id');
        search_data.layers.delete(layer_id)
        .done(function(){
           $('#delete_layer_popup').popup( "close" );
        });
    });


//map events
    $('#map_holder').on('stop_add_search',function(e,search_location){
        var geoOptions = {
              layer_id: $('li#current_layer').data('current-layer'),
              latitude:search_location.latitude,
              longitude:search_location.longitude,
              radius:100,
              extra:{start_time:Date()} 
        };

        search_data.place.add(geoOptions).done(function(response){
            $('.search_map').trigger('display_search',[response]);  
            socket.emit('message', {eventType: 'newSearch', payload: response});
        });
    })


//general app events

    $('.app_panel').on('click',function(){
        $(this).panel( "close" );            
    });

    $('.cancel_button').on('click',function(){
        $.mobile.changePage('#mapPage');
    });    

//panel menu choices

    //panel menu choices

    $('a#viewSearches').click(function () {
        $('.search_map').trigger('display_all');
    });

    $('a#viewUser').click(function(){
        
         $('.search_map').trigger("show_user",search_app.user_position);
    });    

    $('a#clearLayers').click(function(){
        $('.search_map').trigger("clear_map");
    });    


//authentication
    function newUser(auth){
        this_auth=auth;
        search_data.user.create(
            { username: auth.username,
                email: auth.username,
                password: auth.password
            })
        .done(function (response) {
            $(this).data('register-user', false);
            search_data.login(this_auth);
        })
        .fail(function (error) {
            $('#signin_msg').text(error.error_description);
        });

    };

    $('#signin_page').on('pagebeforeshow', function () {
        var register_user = $(this).data('register-user');

        retype_type = register_user && "password" || "hidden";
        signin_title = register_user && "Registration" || "Sign In";
        signin_btn_text = register_user && "Sign Me Up!" || "Sign In";


        $('#retypePassword').attr('type', retype_type);
        $('#signin_title').text(signin_title)
        $('button#signin').text(signin_btn_text).button("refresh");

        if (register_user) {
            $('#retypePassword').parent().show();
        } else {
            $('#retypePassword').parent().hide();
        };
        $(this).trigger("create");
    });

    $('button#signin').click(function (e) {
        var auth = {}; auth.username = $('input#email').val(),
        auth.password = $('input#password').val();
        $('#signin_msg').text('');
        if ($('#retypePassword').attr('type') === 'password') {
            auth.retype = $('input#retypePassword').val();
            if (auth.password != auth.retype) {
                $('#signin_msg').text('Passwords do not match')
            } else {
                newUser(auth);
            }
        } else {
            search_data.login(auth);
        }
    });

    $('button#signin_quit').on('click',function(){
        $('#signin_page').data('register-user',false);
        $('#signin_msg').text(''); 
        $('#retypePassword').attr('type','hidden').parent().hide();
        $('#signin_page').trigger("create");        
    });    
    
    $('a#btnStartRegister').on('click', function () {
        $('#signin_page').data('register-user', true);
    });

    geoloqi.onAuthorize = function (response, error) {
        console.log("You are a user!");
        $.mobile.changePage('#mapPage');
    };

    geoloqi.onLoginError = function (error) {
        console.log("You are not a user!");
        $('#linkDialog').click();
    };

//watch position 

    var posOptions = { enableHighAccuracy: true};
    var userPositionChange = function(pos) {
        new_position = {latitude  : pos.coords.latitude, 
                        longitude : pos.coords.longitude,
                        accuracy  : pos.coords.accuracy};          
        new_position.accuracy = new_position.accuracy > 90 && 90 || new_position.accuracy;
        search_app.user_position=new_position;
        $('.search_map').trigger('new_user_position',new_position);    
    };
    var errorPositionChange = function (err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    distWatchID = navigator.geolocation.watchPosition(userPositionChange, errorPositionChange, posOptions);

// GO!
    refresh_layer_list();

    $('#mapPage').trigger('pageshow');
});

