var mapboxMap = function (element,options) {
    var _latlng = _latlng || new L.LatLng(36.1539, -95.9925),
        _zoom = _zoom || 18,map_element;
        options = options ||{};
        
    var search_list = {}; user_list={};

    if (element !== map_element){
        options.trackResize=true;
        var m = new L.mapbox.map(element,options.map_url ).setView(_latlng, _zoom);

        m.map_element = element;
        
        m.user_marker = new L.Marker(_latlng, 
            {icon: new L.icon({
                    iconAnchor: [32,32],
                    iconSize : [64,64],
                    iconUrl : "./img/searcher.svg"
                })
            }).addTo(m);
            
        user_list['this_user']=m.user_marker;

        m.user_accuracy_circle = new L.circle(_latlng,100,
             {
             fillColor: 'aqua',
             fillOpacity: 0.3,
             opacity:0
            }).addTo(m);
            
        $(document).on('end_search',function(e,response){ 
            marker=search_list[response.place_id];
            
            if(marker){
                marker.closePopup();
                marker.setIcon( new L.icon({
                        iconAnchor: [32,32],
                        iconSize : [64,64],
                        iconUrl : './img/search_end.svg'
                        }));
                marker.setPopupContent(search_popup_content(response.place_id,response.extra));
            }
        });

        $(document).on('move_remote_user', function(e,response){
            var this_user=response.user.user_id;
            if(!user_list[this_user]){     
                user_list[this_user]=new L.Marker(
                    new L.LatLng(response.latitude,response.longitude), 
                    {icon: new L.icon({
                            iconAnchor: [32,32],
                            iconSize : [64,64],
                            iconUrl : "./img/users.svg"
                        })
                    });
                
                user_list[this_user].setPopupContent(response.user.display_name);
                user_list[this_user].addTo(m);
            } else {
                               
               user_list[this_user].setLatLng ([response.latitude,response.longitude]);
            }

        });
        
        $(document).on('clear_map', function(){
            for (var mk in search_list){
                m.removeLayer(search_list[mk]);
            };        
            search_list={};
        });
        
        // $(document).on('page_resize', function(e,response){
        //         m.invalidateSize();            
        // });
        
        
         
    }

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

    m.add_Search = function (response) {
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
                     icon: mbIcon }).addTo(this);

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

    $(document).on('start_add_search', function () {
        $(this).css('cursor', 'url("http://s3.amazonaws.com/besport.com_images/status-pin.png")');
        m.addOneTimeEventListener('click', function (e) {
            $(this).css('cursor', 'pointer');
            var search_location = {
                latitude: e.latlng.lat,
                longitude: e.latlng.lng
            };
            $('#map_holder').trigger('stop_add_search', [search_location]);
        });
    });

    $(document).on('display_search', function (e, response) {
        if ($('#' + element.attributes['id'].value).css('cursor') != 'pointer')
            $('#' + element.attributes['id'].value).css('cursor', 'pointer');
        m.add_Search(response);
    });

    m.searchBounds = function (marker_list) {
        var newBounds = new L.LatLngBounds;

        for (var mk in marker_list) {
            newBounds.extend(marker_list[mk].getLatLng());
        };
        return newBounds;
    }


    $(document).on('display_searches', function (e, response) {        
        m.fitBounds(m.searchBounds(search_list));                
    });

    $(document).on('display_users', function (e, response) {        
        m.fitBounds(m.searchBounds(user_list));                
    });
    
    

    m. show_user = function (position){
    // $(document).on('show_user', function () {
       console.log("mapbox show_user fired");
        m.setView(_latlng,18);
        m.invalidateSize();
    };

    $(document).on('new_user_position', function (e, position) {
        console.log('mapbox new user position');
        _latlng = new L.LatLng(position.latitude, position.longitude);
        m.user_marker.setLatLng(_latlng);
        m.user_accuracy_circle.setLatLng(_latlng);
        m.user_accuracy_circle.setRadius(position.accuracy);
    });
    

    $(document).on('clear_map', function(){
        for (var m in search_list){
            search_list[m].setMap(null);
        };        
        search_list={};
    });

    $(document).on('move_search', function(e,response){
        marker=search_list[response.place_id];
        if (marker){
            // var search_loc = new google.maps.LatLng(response.latitude,response.longitude);
            marker.setLatLng([response.latitude,response.longitude]);                      
        }
    });


    m.zoom_frame = function (frame){
      if(frame){
          console.log('invalidateSize')
          m.setView(new L.LatLng(frame.latitude, frame.longitude), frame.zoom);
          m.invalidateSize();
       } else{
          frame={};
          this_center=m.getCenter();
          frame.latitude=this_center.lat;
          frame.longitude=this_center.lng;
          frame.zoom = m.getZoom();
          return frame;
      }
    };

    m.show_div = function (){
        $(m.getContainer()).show();
    };
    
    m.hide_div = function(){
        $(m.getContainer()).hide();          
    };
    // m.on('zoomend',function () {
    //     var setzoom = function(z){
    //         setzoom.answers= setzoom.answers || {};
    //         if (!setzoom.answers[z]){
    //             var new_size=Math.floor(64*(z/22));
    //             var new_anchor=Math.floor(32*(z/22));
    //             setzoom.answers[z] ={
    //                 size : new_size,
    //                 anchor : new_anchor
    //             };
    //         }   
    //         return setzoom.answers[z]
    //     };
    // 
    //     for (var mk in search_list){
    //         
    //         (function (zoom){
    //             var new_zoom = setzoom(zoom);
    //             search_list[mk].setIcon ({
    //                 iconAnchor: [new_zoom.anchor,new_zoom.anchor],
    //                 iconSize : [new_zoom.size,new_zoom.size],
    //                 });
    //                 
    //         })(m.getZoom());
    //     };
    // });

    
    m.map_div = m.getContainer;
    return m;

}; 
