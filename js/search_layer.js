var SearchLayer = function(mbLayer){
     var this_layer = mbLayer, search_list=[];
     
     var search_popup_content = function (key,info_obj) {
        var response = [],content_text,i=0,popup;
        for (var p in info_obj){
            response[i] = "<p>"+p+": "+info_obj[p]+"</p>";
            i+=1;
        };
        content_text=response.join(""); 
        
        if (!info_obj.end_time){
            content_text +="</br><button data-key='"+key+"' id='"+key+"_button' class='end_search' >End Search</button"
        }
        
        return content_text;
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