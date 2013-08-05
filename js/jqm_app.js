jQuery(document).ready(function () {


    //init the map

    search_app = {
        user_position : {latitude:0,longitude:0},
        user_response:null,
        base_maps:[],
        add_base : function(layer){
            this.base_maps.push(layer);
        },
        first_base : function(){ 
            return this.base_maps[0];
        },
        base_forward : function(){
            n=this.base_maps.shift();
            this.base_maps.push(n);
            return this.first_base();
        },
        base_back : function(){
            n=this.base_maps.pop()
            this.base_maps.unshift(n);
            return this.first_base();
        },
        searches : [],
        
    };    
    
    // var map_template = ['<div id="','" class="ui-content search_map" role="main" data-role="content" data-theme="b"></div>'];
            
    // var map_config = { 
    //     google_road:{id : 'google_road',maker : googleMap,options:roadmap_options},
    //     mapbox: {id : 'mapbox_road', maker:mapboxMap,options:{map_url:'jdungan.map-lc7x2770'}},
    //     google_sattellite : {id : 'google_satellite', maker:googleMap,options:satellite_options}
    // };


    var map_config = { 
        satellite: {id : 'mapbox_satellite', maker:mapboxMap,options:{map_url:'jdungan.map-y7hj3ir7'}},
        buildings: {id : 'mapbox_buildings', maker:mapboxMap,options:{map_url:'jdungan.map-147y2axb'}},
        terrain: {id : 'mapbox_terrain', maker:mapboxMap,options:{map_url:'jdungan.map-lc7x2770'}}
    };
    
    for (var m in map_config) {
        map_config[m].options = map_config[m].options || {};
        search_app.add_base(
            L.mapbox.tileLayer(map_config[m].options.map_url)
        );
    };

    var map = L.map('map_content').setView([36.1539, -95.9925001], 13);

    search_app.first_base().addTo(map);


    
//toggle maps

    var rotate_map = function(direction){
        direction = direction || 'forward';
        current_map=search_app.first_base();
        if (direction === 'back') {
            next_map=search_app.base_back();
        } else {
            next_map=search_app.base_forward();
        }
        next_map.addTo(map);
        map.removeLayer(current_map);
    };


    $('#mapPage').on('swipeleft', function(e){
        rotate_map('forward')
    });
    $('#mapPage').on('swiperight', function(e){
        rotate_map('back')
    });

    $('a#toggle_map').on('click', rotate_map);


    // init search data
    var search_data = search_data || new search_db();

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
    

    $(document).on("moveUser", function (e, response) {
        $('.search_map').trigger('move_remote_user', [response]);
    });


    //client events
    
    
    $(document).on("markerMove", function (e, move_details) {
        search_data.place.update(move_details.key,
            { latitude: move_details.latitude,
                longitude: move_details.longitude
            })
        .done(function (response) {
            $.event.trigger('move_search',response)
            socket.emit('message', { eventType: 'moveSearch', payload: response });
        });
    });


    $('#map_holder').on('click', 'button.end_search', function() {
        search_data.place.update($(this).data('key'),
            { extra: { end_time: Date()} })
        .done(function (response) {
            $('.search_map').trigger("end_search", response);
            socket.emit('message', { eventType: 'endSearch', payload: response });
        });
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
            $('.search_map').trigger('display_searches');
        });   
    };

    $('button#save_new_layer').on('click', function(e){        
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
              layer_id : $('li#current_layer').data('current-layer'),
              latitude : search_location.latitude,
              longitude : search_location.longitude,
              radius : 100,
              extra : {start_time : Date()} 
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
    
    $("#addSearch").on('click',function(){
            $('.search_map').trigger('start_add_search');            
    });

    $('a#viewUsers').on('click', function () {
         $('.search_map').trigger('display_users');
     });

    $('a#viewSearches').on('click', function () {
        $('.search_map').trigger('display_searches');
    });

    $('a#viewUser').on('click', function(){
        search_app.first().show_user(search_app.user_position)
         // $('.search_map').trigger("show_user",search_app.user_position);
    });    

    $('a#clearLayers').on('click', function(){
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

    $('button#signin').on('click', function (e) {
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
        search_app.user_response=response
        console.log("You are a user:"+response.display_name);
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

        if (search_app.user_response){
            
            new_position.user=search_app.user_response;
            new_position.user.access_token=null;
            socket.emit('message', { eventType: 'moveUser', payload: new_position });
        } 
        $('#map_holder').trigger('new_user_position',new_position);
    };
    var errorPositionChange = function (err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    
    
    // var posOptions = {
    //   enableHighAccuracy: true,
    //   timeout: 3000,
    //   maximumAge: 0
    // };
    
    distWatchID = navigator.geolocation.watchPosition(userPositionChange, errorPositionChange, posOptions);

    // window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    //     debugger;
    //   if (gOldOnError)
    //     // Call previous handler.
    //     return gOldOnError(errorMsg, url, lineNumber);
    // 
    //   // Just let default handler run.
    //   return false;
    // }

// GO!

    refresh_layer_list();

    $('#mapPage').trigger('pageshow');
    
    //init socket
    var socket = io.connect('http://206.214.164.229');

    socket.on('message', function (data) {
       $.event.trigger(data.message.eventType,data.message.payload);      
    });  
    
});

