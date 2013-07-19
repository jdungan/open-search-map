var mapboxMap = function (element,mapbox_url) {
    var _latlng = _latlng || new L.LatLng(36.1539, -95.9925),
        _zoom = _zoom || 18,map_element;
    var search_list = {};

    if (element !== map_element){

        var m = new L.mapbox.map(element,mapbox_url ).setView(_latlng, _zoom);

        m.map_element = element;
        
        m.user_marker = new L.Marker(_latlng, 
            {icon: new L.icon({
                iconAnchor: [32,32],
                iconSize : [64,64],
                iconUrl : "./img/searcher.svg"
                })
            }).addTo(m);

        m.user_accuracy_circle = new L.circle(_latlng,100,
             {
             fillColor: 'aqua',
             fillOpacity: 0.3,
             opacity:0
            }).addTo(m);
         
    }

    m.setCurrentPosition = function (pos) { _latlng = new L.LatLng(pos.latitude, pos.longitude); };
    m.getCurrentPosition = function () { return _latlng; };

    m.add_Search = function (response) {
        var key = response.place_id;
        response.extra = response.extra || {};
        var search_icon = (response.extra.end_time && "./img/search_end.svg") || "./img/search_start.svg";

        if (!search_list[key]) {
            var mbIcon = L.icon({
                iconUrl: search_icon,
                iconSize: [32, 32],
                iconAnchor: [32, 32]
            });
            var mbMarker = L.marker([response.latitude, response.longitude], { icon: mbIcon }).addTo(this);
        }

        search_list[key] = mbMarker;
        return mbMarker;
    };

    m.searchBounds = function () {
        debugger;
        var newBounds = new L.LatLngBounds;

        for (var m in search_list) {
            newBounds.extend(search_list[m].getLatLng());
        };
        return newBounds;
    }

    $('#' + element.attributes['id'].value).on('start_add_search', function () {
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

    $(element).on('display_search', function (e, response) {
        if ($('#' + element.attributes['id'].value).css('cursor') != 'pointer')
            $('#' + element.attributes['id'].value).css('cursor', 'pointer');
        m.add_Search(response);
    });

    $(element).on('display_all', function (e, response) {        
        m.fitBounds(m.searchBounds());                
    });

    $(element).on('show_user', function () {
        m.panTo(_latlng);
        m.setZoom(18);
        m.invalidateSize();
    });

    $(element).on('new_user_position', function (e, position) {
        _latlng = new L.LatLng(position.latitude, position.longitude);
        m.user_marker.setLatLng(_latlng);
        m.user_accuracy_circle.setLatLng(_latlng);
        m.user_accuracy_circle.setRadius(position.accuracy);
    });

    $(element).on('page_resize', function(e,response){
        m.invalidateSize();
    });


    m.zoom_frame = function (frame){
      if(frame){
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
        m.invalidateSize();
    };
    
    m.hide_div = function(){
        $(m.getContainer()).hide();          
    };
    
    
    return m;

}; 
