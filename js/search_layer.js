var SearchLayer = function(map){
     var  search_list=[],
     this_layer=  new L.mapbox.markerLayer();
     
     this_layer= 
     var search_popup_content = function (key,info_obj) {
        var div=document.createElement("p");

        for (var p in info_obj){
            (function(d){
                para = document.createElement("p");
                desc = document.createTextNode(p+": "+info_obj[p]);
                para.appendChild(desc);
                d.appendChild(para)
            })(div);

        };

        if (!info_obj.end_time){
             para = document.createElement("p");
             btn = document.createElement('button');
             btn.id =key+'_button';
             btn.setAttribute('data-key',key)
             btn.setAttribute('class','end_search')
             desc = document.createTextNode('End Search');
             btn.appendChild(desc);
             para.appendChild(btn)
             div.appendChild(para);
             // content_text +="</br><button data-key='"+key+"' id='"+key+"_button' class='end_search' >End Search</button"
         }
                
        return div;
    };

    this_layer.add_search = function (response) {
        var key = response.place_id;
        response.extra = response.extra || {};
        var search_icon = (response.extra.end_time && "./img/search_end.svg") || "./img/search_start.svg";

        if (!search_list[key]) {
            var mbIcon = L.icon({
                iconUrl: search_icon,
                iconSize: [64, 64],
                iconAnchor: [32, 32]
            });

            var mbMarker = L.marker([response.latitude, response.longitude],
                 {   draggable:true,
                     icon: mbIcon,
                     layer_id: response.layer_id});

            var popupContent = search_popup_content(key,response.extra);
            
            mbMarker.on('dragend',function () {
                move_details={key:key,
                    latitude:this.getLatLng().lat,
                    longitude:this.getLatLng().lng}
                 $.event.trigger("markerMove",move_details);
                }
            );
            
            mbMarker.bindPopup(popupContent);
        }

        search_list[key] = mbMarker;
        return mbMarker;
    };

    return this_layer;
};