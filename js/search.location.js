'use strict';
(function(app){
    var location ={},
    location_WatchID,
    user_position,
    watch_options = {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    },
    user_marker = new L.Marker([0,0], 
        {icon: new L.icon({
                iconAnchor: [32,32],
                iconSize : [64,64],
                iconUrl : "./img/searcher.svg"
            })
        }).addTo(app.map),
    user_accuracy_circle = new L.circle([0,0],100,
         {fillColor: 'aqua',
            fillOpacity: 0.3,
            opacity:0
        }).addTo(app.map),
    new_position = function(pos) {
        var pos_accuracy = pos.coords.accuracy > 90 && 90 || pos.coords.accuracy;
        user_position = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
        user_marker.setLatLng(user_position);
        user_accuracy_circle.setLatLng(user_position);
        user_accuracy_circle.setRadius(pos_accuracy);

        if (app.auth.user_response){
            user_position.user=app.auth.user_response;
            socket.emit('message', { eventType: 'moveUser', payload: user_position });
        } 

    },
    position_error = function (err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    
    location.watch_user = function(){
        location_WatchID = navigator.geolocation.watchPosition(new_position, position_error, watch_options);
    };
    
    location.show_user = function(){
        if (user_position){
            app.map.setView(user_position,18); 
        }
    };
    
    location.user_position = function(){
        return user_position;
    };
    
    app.location=location;

})(search_app);