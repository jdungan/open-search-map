'use strict';
define(['mapbox','./map'],function(mapbox,map){
    map.user_position=undefined;
    var location=function(){}, 
    location_WatchID,
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
        }).addTo(map),
    user_accuracy_circle = new L.circle([0,0],100,
         {fillColor: 'aqua',
            fillOpacity: 0.3,
            opacity:0
        }).addTo(map),
    new_position = function(pos) {
        var pos_accuracy = pos.coords.accuracy > 90 && 90 || pos.coords.accuracy;
        map.user_position = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
        user_marker.setLatLng(map.user_position);
        user_accuracy_circle.setLatLng(map.user_position);
        user_accuracy_circle.setRadius(pos_accuracy);
        
        // if (app.auth.user_response){
        //     user_position.user=app.auth.user_response;
        //     socket.emit('message', { eventType: 'moveUser', payload: user_position });
        // } 

    },
    position_error = function (err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    

    location.prototype.watch_user = function(){
        location_WatchID = navigator.geolocation.watchPosition(new_position, position_error, watch_options);
        return location_WatchID;
    };

    location.prototype.show_user = function(){
        if (map.user_position){
            map.setView(map.user_position,18); 
        }
    };

    location.prototype.user_position = function(){
        return map.user_position;
    };        

   return location;
});