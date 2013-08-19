


jQuery(document).ready(function () {
    

    var map_config = { 
        satellite: {id : 'mapbox_satellite',options:{map_url:'jdungan.map-y7hj3ir7'}},
        buildings: {id : 'mapbox_buildings',options:{map_url:'jdungan.map-147y2axb'}},
        terrain: {id : 'mapbox_terrain', options:{map_url:'jdungan.map-lc7x2770'}}
    };
    
    for (var m in map_config) {
        map_config[m].options = map_config[m].options || {};
        search_app.add_base(
            new L.mapbox.tileLayer(map_config[m].options.map_url)
        );
    };

    search_app.map.invalidateSize();
    
    search_app.retrieve_layer_list();



//toggle maps

        $('#mapPage').on('swipeleft', function(e){
            search_app.rotate_map('forward')
        });
        $('#mapPage').on('swiperight', function(e){
            search_app.rotate_map('back')
        });

        $('a#toggle_map').on('click', search_app.rotate_map);
    
        $('.app_panel').on('click',function(){
            $(this).panel( "close" );            
        });

        $('.cancel_button').on('click',function(){
            $.mobile.changePage('#mapPage');
        });    





        //watch position 

            // var posOptions = { enableHighAccuracy: true};
            // var userPositionChange = function(pos) {
            //     new_position = {latitude  : pos.coords.latitude, 
            //                     longitude : pos.coords.longitude,
            //                     accuracy  : pos.coords.accuracy};          
            //     new_position.accuracy = new_position.accuracy > 90 && 90 || new_position.accuracy;
            // 
            //     if (search_app.user_response){
            // 
            //         new_position.user=search_app.user_response;
            //         new_position.user.access_token=null;
            //         socket.emit('message', { eventType: 'moveUser', payload: new_position });
            //     } 
            //     $('#map_holder').trigger('new_user_position',new_position);
            // };
            // var errorPositionChange = function (err) {
            //     console.warn('ERROR(' + err.code + '): ' + err.message);
            // };


            // var posOptions = {
            //   enableHighAccuracy: true,
            //   timeout: 3000,
            //   maximumAge: 0
            // };

            // var distWatchID = navigator.geolocation.watchPosition(userPositionChange, errorPositionChange, posOptions);

            // window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
            //     debugger;
            //   if (gOldOnError)
            //     // Call previous handler.
            //     return gOldOnError(errorMsg, url, lineNumber);
            // 
            //   // Just let default handler run.
            //   return false;
            // }




});