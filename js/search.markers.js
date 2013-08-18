'use strict';

(function(app){
    var search_list={},
    layers={},
    search_markers = [],
    search_layer = search_layer || new L.FeatureGroup(search_markers).addTo(app.map);
    
    app.searches={};
    app.searches.markers=search_markers;
    app.layers=layers;
    app.search_layer = search_layer;
    
    app.searches.add_search = function (response) {
            response.extra = response.extra || {};
            var key = response.place_id,
            search_icon = (response.extra.end_time && "./img/search_end.svg") || "./img/search_start.svg",
            search_popup_content = function (key,info_obj) {
                var div=document.createElement("p");

                for (var p in info_obj){
                        var para = document.createElement("p");
                        var desc = document.createTextNode(p+": "+info_obj[p]);
                        para.appendChild(desc);
                        div.appendChild(para);
                };
                if (!info_obj.end_time){
                     var para = document.createElement("p");
                     var btn = document.createElement('button');
                     btn.id =key+'_button';
                     btn.setAttribute('data-key',key)
                     btn.setAttribute('class','end_search')
                     var desc = document.createTextNode('End Search');
                     btn.appendChild(desc);
                     para.appendChild(btn)
                     div.appendChild(para);
                }                
                return div;
            };


            if (!search_list[key]) {
                var mbIcon = L.icon({
                    iconUrl: search_icon,
                    iconSize: [64, 64],
                    iconAnchor: [32, 32]
                });
        
                var search_marker =  new L.marker([response.latitude, response.longitude],
                     {   draggable:true,
                         icon: mbIcon,
                         layer_id: response.layer_id});
        
                var popupContent = search_popup_content(key,response.extra);
            
                // add marker events
                search_marker.on('dragend',function () {
                    var move_details={key:key,
                        latitude:this.getLatLng().lat,
                        longitude:this.getLatLng().lng};
                     $.event.trigger("markerMove",move_details);
                    }
                );
        
                (function(k){
                    app.map.on('popupopen', function() { 
                        $('#'+k+'_button').click(function(e){
                            $.event.trigger("endSearch_click",k);
                        });
                    });
                })(key);
            
                search_marker.bindPopup(popupContent);
                
                search_list[key] = search_marker;
                search_markers.push(search_marker);

            }
            return search_list[key];
        }; // end if in search_list
        
    app.searches.setFilter = function (callback){
        var dfd=new $.Deferred();
            search_markers.forEach(callback)
            dfd.resolve();
        return dfd;
    };
    
    app.searches.visibleBounds = function() {
        var this_bounds = new L.LatLngBounds();
        this_bounds.has_visible=false;
        search_markers.forEach(function(m) {
            if (layers[m.options.layer_id].visible) {
                this_bounds.has_visible=true;
                this_bounds.extend(m.getLatLng());
            }
        });
        return this_bounds.has_visible && this_bounds || app.map.getBounds();
    };

})(search_app);


//marker events

$(document).on('clear_map', function(){
    for (var grp in search_app.search_groups){
      layers[grp].visible=false;          
    };
    
    $("#layer_list").trigger('layer_visibility_change');      

    search_app.searches.markers.forEach(function(m) {
        m.setOpacity( 0 );
    });
});

$(document).on('move_search', function(e,response){
    var marker=search_app.search_list[response.place_id];
    if (marker){
        marker.setLatLng([response.latitude,response.longitude]);                      
    }
});
