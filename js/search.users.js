'use strict';
(function(app){
    var users={},
    user_list={},
    user_markers = [],
    users_layer = users_layer || new L.FeatureGroup(user_markers).addTo(app.map),
    user_marker = function (){
        var new_marker =new L.Marker([0,0], 
            {icon: new L.icon({
                iconAnchor: [32,32],
                iconSize : [64,64],
                iconUrl : "./img/users.svg"
            })});
        return new_marker;
    },
    user_circle = function(){
        var new_circle = new L.circle([0,0],100,
             {fillColor: 'red',
                fillOpacity: 0.7,
                opacity:0
            });
        return new_circle;  
    };
    
    
    users.find = function(key){
        return user_list[key];
    };
    
    users.setFilter = function (callback){
        var dfd=new $.Deferred();
            search_markers.forEach(callback)
            dfd.resolve();
        return dfd;
    };
    
    users.Bounds = function() {
        var this_bounds = new L.LatLngBounds();
        this_bounds.extend(app.location.user_position());
        user_markers.forEach(function(m) {
            this_bounds.extend(m.getLatLng());
        });
        return user_markers.length>0 && this_bounds || app.map.getBounds();
    };

    users.move_remote_user = function(response){
        var this_user=response.user.user_id;
        if(!user_list[this_user]){     
            user_list[this_user]=new user_marker();
            user_list[this_user].bindPopup(response.user.display_name);
            user_markers.push(user_list[this_user]);
            users_layer.addLayer(user_list[this_user]);
        }
        user_list[this_user].setLatLng (new L.LatLng(response.lat,response.lng));
    };

    app.users=users;
})(search_app);
