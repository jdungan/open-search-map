'use strict';
var searchMarkers = function(map){
    
    var search_list = {},
    search_markers = [],
    this_map=map,
        
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

    search_markers.add_search = function (response) {
            var key = response.place_id;
            response.extra = response.extra || {};
            var search_icon = (response.extra.end_time && "./img/search_end.svg") || "./img/search_start.svg";

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
                    move_details={key:key,
                        latitude:this.getLatLng().lat,
                        longitude:this.getLatLng().lng}
                     $.event.trigger("markerMove",move_details);
                    }
                );
        
                (function(k){
                    this_map.on('popupopen', function() { 
                        $('#'+k+'_button').click(function(e){
                            $.event.trigger("endSearch_click",k);
                        });
                    });
                })(key);
            
                search_marker.bindPopup(popupContent);
            }

            search_list[key] = search_marker;
            search_markers.push(search_marker);
            return search_marker;
        };
        
    search_markers.setFilter = function (callback){
        return search_markers.forEach(callback);
        
    };
    
    search_markers.visibleBounds = function(){
      var this_bounds = new L.LatLngBounds();
      search_markers.forEach(function(m){
          if (search_markers.layers[m.options.layer_id].visible){
              this_bounds.extend(m.getLatLng());
          }
      });
      return this_bounds;
    };
    
    search_markers.layers = [];
    return search_markers;
};