requirejs.config({
    baseUrl: "js/",
    waitSeconds: 0,
    paths: {
        'jquery': 'http://code.jquery.com/jquery-1.10.0.min',
        'jquery.mobile': "http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min",
        'geoloqi': "https://api.geoloqi.com/js/versions/geoloqi-1.0.13.min",
        'mapbox': '//api.tiles.mapbox.com/mapbox.js/v1.3.1/mapbox',
        'socket': 'libs/socket.io.min'
    },
    shim: {
        'geoloqi': {
            exports: 'geoloqi'
        }
    },
    packages:['search_app',{name: "search_app",main: "app"}]
    
});

require(['jquery','jquery.mobile','socket','search_app','layer_menu','ui/build'],
    function($,jqm,socket,search_app,layer_menu){

        $(document).ready(function () {
            $.mobile.linkBindingEnabled = false;
            $.mobile.hashListeningEnabled = false;
        
            var map_config = { 
                satellite: {options:{map_url:'jdungan.map-y7hj3ir7'}},
                buildings: {options:{map_url:'jdungan.map-147y2axb'}},
                terrain: {options:{map_url:'jdungan.map-lc7x2770'}}
            };

            for (var m in map_config) {
                map_config[m].options = map_config[m].options || {};
                search_app.base.add_base(map_config[m].options.map_url);
            };

            search_app.retrieve_layer_list();

            search_app.location.watch_user();



    //TODO: ORGANIZE THIS EVENT MESS

            $('#mapPage').on('swipeleft', function(e){
                search_app.base.rotate_map('forward')
            });
            $('#mapPage').on('swiperight', function(e){
                search_app.base.rotate_map('back')
            });


        

            $('#mapPage').on('pageshow',function(){
                $( ".app_panel" ).trigger( "updatelayout" );
                search_app.map.invalidateSize();
            });
        
        
            $('.app_panel').on('click',function(){
                $(this).panel( "close" );            
            });

            $('.cancel_button').on('click',function(){
                $.mobile.changePage('#mapPage');
            });    
        


        
        
            //socket init
        
            var socket = io.connect('http://206.214.164.229');

            socket.on('message', function (data) {
               $.event.trigger(data.message.eventType,data.message.payload);      
            });  
        
        
        
            //socket events
            $(document).on("newSearch", function (e, response) {
                search_layer.addLayer(searches.add_search(response));
            });

            $(document).on("endSearch", function (e, response) {
                $('.search_map').trigger('end_search', [response]);
            });

            $(document).on("moveSearch", function (e, response) {
                $('.search_map').trigger('move_search', [response]);
            });

            $(document).on("moveUser", function (e, response) {
                search_app.users.move_remote_user(response);
            });

    //auth events

            $('button#signin').on('click', function (e) {
                var user_auth = {};
                user_auth.username = $('input#email','#signin_popup').val();
                user_auth.password = $('input#password','#signin_popup').val();
                $('#signin_msg').text('');
                search_app.auth.login(user_auth);
                $('#signin_popup').popup( "close" );
            });


            $('button#register').on('click', function (e) {
                var user_auth = {};
                user_auth.username = $('input#email','#register_popup').val();
                user_auth.password = $('input#password','#register_popup').val();
                user_auth.extra.layer_id = search_app.map.default_edit_layer.layer_id;    
                $('#signin_msg').text('');
                user_auth.retype = $('input#retype','#register_popup').val();
                if (user_auth.password === user_auth.retype) {
                    search_app.auth.new_user(user_auth);
                    $('#register_popup').popup( "open" );
                } else {
                    $('#register_msg').text('Passwords do not match')
                }
            });


            $('a#sign_in').on('click', function () {    
                $('#signin_popup').popup( "open" );
            });

            $('a#login_again').on('click', function () {    
                $('#signin_failure_popup').popup( "close" );
                setTimeout(function() { $('a#sign_in').click()}, 100 );
            });


            $('a#start_register').on('click', function () {    
                $('#signin_failure_popup').popup( "close" );
                $('#layer_select','#register_popup').html('')
                search_app.data.layers.each(function(response){
                    var layer_option=$('<option>').attr('value',response.layer_id).text(response.name);
                    $('#layer_select','#register_popup').append(layer_option);
                });
                setTimeout(function() { $( "#register_popup" ).popup( "open" ) }, 100 );
            });

            // initialize the layer list for user settings
            search_app.data.layers.each(function(response){
                var layer_option=$('<option>').attr('value',response.layer_id).text(response.name);
                $('#layer_select','#settings_popup').append(layer_option);
            });

            $('a#change_settings').on('click', function () {
                var user_layer_id;
                if(search_app.auth.user_profile.extra){
                    var users_layer_id = search_app.auth.user_profile.extra.layer_id;        
                    $('#layer_select','#settings_popup').val(users_layer_id).change();
                }
                $('#settings_popup').popup( "open" );
            });

            $('button#save_settings').on('click', function (e) {
                var options = {extra:{}};
                options.extra.layer_id = $('#layer_select option:selected','#settings_popup').val()
                search_app.map.edit_layer.layer_id=options.extra.layer_id;
                search_app.data.user.update(search_app.auth.user_response.user_id,options)
                .done(function(response){
                    search_app.map.edit_layer.layer_id=response.updated.extra.layer_id;
                });
                $('#settings_popup').popup( "close" );
    
            });
        
            $(window).on('login_success',function(response,error){
                search_app.auth.user_response=response
                search_app.data.user.profile(response.user_id).done(function(response){
                   search_app.auth.user_profile= response;
                   if (response.extra.layer_id){
                       search_app.map.layer_id=response.extra.layer_id;
                   }
                });
                console.log("You are a user:"+response.display_name);
                $('#change_settings').show();
                $.mobile.changePage('#mapPage');
            });

            $(window).on('login_failure',function(error){
                console.log("You are not a user!");
                $('#signin_failure_popup').popup( "open" );
            });

            //marker events
            $(document).on('start_add_search', function () {
                $(this).css('cursor', 'url("http://s3.amazonaws.com/besport.com_images/status-pin.png")');
                search_app.map.addOneTimeEventListener('click', function (e) {
                    $(this).css('cursor', 'pointer');
                    var geoOptions = {
                          layer_id : search_app.map.edit_layer.layer_id,
                          latitude : e.latlng.lat,
                          longitude : e.latlng.lng,
                          radius : 100,
                          extra : {start_time : Date()} 
                    };
                    search_app.data.place.add(geoOptions).done(function(response){
                        response['layer_id']=search_app.map.edit_layer.layer_id;
                        search_app.search_layer.addLayer(search_app.searches.add_search(response));
                        socket.emit('message', {eventType: 'newSearch', payload: response});
                    });
                });
            });


            $(document).on("endSearch_click", function(e,marker_key){
                search_app.data.place.update(marker_key,
                    {extra: {end_time:Date()}})
                .done(function(response){
                    $('.search_map').trigger('end_search', response);
                    socket.emit('message',{eventType: 'endSearch', payload: response});                        
                });        
            });


            $(document).on('end_search',function(e,response){ 
                search_app.searches.end_search(response);
            });

            $(document).on('move_search', function(e,response){
                var marker=search_app.searches.markers.find(response.place_id);
                if (marker){
                    marker.setLatLng([response.latitude,response.longitude]);                      
                }
            });

            $(document).on("markerMove", function (e, move_details) {
                search_app.data.place.update(move_details.key,
                    { latitude: move_details.latitude,
                        longitude: move_details.longitude
                    })
                .done(function (response) {
                    $.event.trigger('move_search',response)
                    socket.emit('message', { eventType: 'moveSearch', payload: response });
                });
            });


            $('#map_holder').on('click', 'button.end_search', function() {
                var key = $(this).data('key'), updates={ extra: { end_time: Date()} };
                $('input','form#'+key).each(function(){
                    var input_fld=$(this);
                    updates.extra[input_fld.data('fieldname')]=input_fld.val();
                });
                search_app.data.place.update(key,updates)
                .done(function (response) {
                    $('.search_map').trigger("end_search", response);
                    socket.emit('message', { eventType: 'endSearch', payload: response });
                });
            });
            // layer menu events
            $(document).on('layer_visibility_change',function(){
                $('#layer_list li.layer_item').each( function (i){
                    var layer_id = $(this).data('layer_id'),
                    is_visible = search_app.layers[layer_id] && search_app.layers[layer_id].visible,
                    icon_class = is_visible && 'icon-circle' || 'icon-circle-blank';
                    $('i',this).attr('class',icon_class);
                });
            });

            $('button#save_new_layer').on('click', function(e){        
                var layer_name = $('input#layer_name').val();
                search_app.data.layers.add(layer_name)
                .done(function(){
                    $('input#layer_name').val('');
                    $("#layer_list").trigger('layer_visibility_change')       
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
                $("#layer_list").trigger('layer_visibility_change')       
            });

            $( "#delete_layer_popup" ).on( "popupafterclose",function(){
                $('#delete_layer_name').data('layer_id','');
                $('#delete_layer_name').text( '' );
            });

            $('button#submit_delete_layer').on('click',function(e){
                var layer_id = $('#delete_layer_name').data('layer_id');
                search_app.data.layers.delete(layer_id)
                .done(function(){
                   $('#delete_layer_popup').popup( "close" );
                });
            });


            // //hack to open layeers
            // debugger;
            // var options={};
            // options.public=1;
            // app.data.layer.update(layer.layer_id,options)
            // 
            // // end hack            
        
        
         
    }); 
});