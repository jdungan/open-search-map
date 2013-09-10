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
    packages:['search_app',{name: "search_app",main: "app"}],
    shim: {
        "jquery.mobile": ["jquery"],
        'ui/build':['jquery.mobile'],
        'mapbox' :['jquery.mobile'],
        'geoloqi': {
            exports: 'geoloqi'
        }        
    }
});

require(['require','jquery','jquery.mobile','socket','search_app',],
    function(require,$,jqm,socket,search_app,ui){

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

            search_app.location.watch_user();

            require(['ui/build'],function(ui){
                ui.init();
            });


    //TODO: ORGANIZE THIS EVENT MESS

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
     
        
         
    }); 
});