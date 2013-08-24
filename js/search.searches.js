'use strict';
(function(app){
    var searches={},
    search_list={},
    layers={},
    search_markers = [],
    search_layer = search_layer || new L.FeatureGroup(search_markers).addTo(app.map),
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
    
    search_markers.find = function(key){
        return search_list[key];
    };
    
    searches.end_search = function (response) {
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


    searches.add_search = function (response) {
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
        };
        
    searches.setFilter = function (callback){
        var dfd=new $.Deferred();
            search_markers.forEach(callback)
            dfd.resolve();
        return dfd;
    };
    
    searches.visibleBounds = function() {
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

    
    searches.markers=search_markers;
    app.layers=layers;
    app.search_layer = search_layer;
    app.searches=searches;
})(search_app);


//marker events


$(document).on('start_add_search', function () {
    $(this).css('cursor', 'url("http://s3.amazonaws.com/besport.com_images/status-pin.png")');
    search_app.map.addOneTimeEventListener('click', function (e) {
        $(this).css('cursor', 'pointer');
        var geoOptions = {
              layer_id : search_app.edit_layer.layer_id,
              latitude : e.latlng.lat,
              longitude : e.latlng.lng,
              radius : 100,
              extra : {start_time : Date()} 
        };
        search_app.data.place.add(geoOptions).done(function(response){
            search_app.search_layer.addLayer(search_app.searches.add_search(response));
            socket.emit('message', {eventType: 'newSearch', payload: response});
        });
    });
});


$(document).on("endSearch_click", function(e,marker_key){
    search_app.data.place.update(marker_key,
        {extra: {end_time:Date()}})
    .done(function(response){
        $('.search_map').trigger('end_search', response);
        socket.emit('message',{eventType: 'endSearch', payload: response});                        
    });        
});


$(document).on('end_search',function(e,response){ 
    search_app.searches.end_search(response);
});

$(document).on('clear_map', function(){
    for (var grp in search_app.layers){
      search_app.layers[grp].visible=false;          
    };    
    search_app.searches.markers.forEach(function(m) {
        m.setOpacity( 0 );
    });

    $(document).trigger('layer_visibility_change');      
});

$(document).on('move_search', function(e,response){
    var marker=search_app.searches.markers.find(response.place_id);
    if (marker){
        marker.setLatLng([response.latitude,response.longitude]);                      
    }
});

$(document).on("markerMove", function (e, move_details) {
    search_app.data.place.update(move_details.key,
        { latitude: move_details.latitude,
            longitude: move_details.longitude
        })
    .done(function (response) {
        $.event.trigger('move_search',response)
        socket.emit('message', { eventType: 'moveSearch', payload: response });
    });
});


$('#map_holder').on('click', 'button.end_search', function() {
    var key = $(this).data('key'), updates={ extra: { end_time: Date()} };
    $('input','form#'+key).each(function(){
        var input_fld=$(this);
        updates.extra[input_fld.data('fieldname')]=input_fld.val();
    });
    search_app.data.place.update(key,updates)
    .done(function (response) {
        $('.search_map').trigger("end_search", response);
        socket.emit('message', { eventType: 'endSearch', payload: response });
    });
});

