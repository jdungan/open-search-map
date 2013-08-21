'use strict';
(function(app){
    var users={},
    user_list={},
    user_markers = [],
    users_layer = search_layer || new L.FeatureGroup(search_markers).addTo(app.map),
    user_marker = new L.Marker([0,0], 
        {icon: new L.icon({
                iconAnchor: [32,32],
                iconSize : [64,64],
                iconUrl : "./img/searcher.svg"
            })
        }).addTo(app.map),
    user_circle = new L.circle([0,0],100,
         {fillColor: 'red',
            fillOpacity: 0.7,
            opacity:0
        });
    
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
        user_markers.forEach(function(m) {
            this_bounds.extend(m.getLatLng());
        });
        return user_markers.length>0 && this_bounds || app.map.getBounds();
    };

    users.move_remote_user = function(response){
        var this_user=response.user.user_id;
        if(!user_list[this_user]){     
            user_list[this_user]=new user_circle;
            user_list[this_user].setPopupContent(response.user.display_name);
            user_list[this_user].addTo(m);
        } else {
           user_list[this_user].setLatLng ([response.latitude,response.longitude]);
        }
    });

    
    searches.markers=search_markers;
    app.searches=searches;
})(search_app);


//marker events



