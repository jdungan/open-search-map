'use strict';
define(['jquery','mapbox','./map'],function($,mapbox,map){
    var searches= function(){
        var search_list={},
        layers={},
        search_markers = [],
        search_layer = search_layer || new L.FeatureGroup(search_markers).addTo(map),
        search_popup_content = function (response) {
            response.extra = response.extra ||{};
            var div=document.createElement("p"),
            key=response.place_id;

            for (var p in response.extra){
                    var para = document.createElement("p");
                    var desc = document.createTextNode(p+": "+response.extra[p]);
                    para.appendChild(desc);
                    div.appendChild(para);
            };
        
            if (!response.extra.end_time){
            
                var questions = ['Question_1','Queston_2','Question_3']
                var form=document.createElement('form');
                form.setAttribute('id',key);
                questions.forEach(function(opt){
                   var para = document.createElement("p");
                   var field_name=document.createTextNode(opt);       
                   para.appendChild(field_name);         
                   var input=document.createElement('input');
                   input.setAttribute('data-fieldname',opt)
                   para.appendChild(input);         
                   form.appendChild(para);
                });             
                div.appendChild(form);
            
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

        searches.prototype.layers=layers;
        
        searches.prototype.search_layer = search_layer;
        
    
        search_markers.find = function(key){
            return search_list[key];
        };
    
        searches.prototype.end_search = function (response) {
            response.extra = response.extra || {};
            var key = response.place_id,
        
            marker=search_list[response.place_id];   
            if(marker){
                marker.closePopup();
                marker.setIcon( new L.icon({
                        iconAnchor: [32,32],
                        iconSize : [64,64],
                        iconUrl : './img/search_end.svg'
                        }));
                marker.setPopupContent(search_popup_content(response));
            }

        };


        searches.prototype.add_search = function (response) {
                response.extra = response.extra || {};
                var key = response.place_id,
                search_icon = (response.extra.end_time && "./img/search_end.svg") || "./img/search_start.svg";

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
        
                    var popupContent = search_popup_content(response);
            
                    // add marker events
                    search_marker.on('dragend',function () {
                        var move_details={key:key,
                            latitude:this.getLatLng().lat,
                            longitude:this.getLatLng().lng};
                         $.event.trigger("markerMove",move_details);
                        }
                    );
        
                    (function(k){
                        map.on('popupopen', function() { 
                            $('#'+k+'_button').click(function(e){
                                $.event.trigger("endSearch_click",k);
                            });
                        });
                    })(key);
            
                    search_marker.bindPopup(popupContent);
                    search_marker.visible=true;
                    search_list[key] = search_marker;
                    search_markers.push(search_marker);

                }
                return search_list[key];
            };
        
        searches.prototype.setFilter = function (callback){
            var dfd=new $.Deferred();
                search_markers.forEach(callback)
                dfd.resolve();
            return dfd;
        };
    
        searches.prototype.visibleBounds = function() {
            var this_bounds = new L.LatLngBounds();
            this_bounds.has_visible=false;
            search_markers.forEach(function(m) {
                if (layers[m.options.layer_id].visible) {
                    this_bounds.has_visible=true;
                    this_bounds.extend(m.getLatLng());
                }
            });
            return this_bounds.has_visible && this_bounds || map.getBounds();
        };

    
        searches.prototype.markers=search_markers;
        
        
    }
    return searches;
});


