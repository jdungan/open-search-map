var mapboxMap = function (element) {
    var _latlng = _latlng || new L.LatLng(36.1539, -95.9925),
        _zoom = _zoom || 18;

    var m = new L.mapbox.map(element, 'jdungan.map-lc7x2770').setView(_latlng, _zoom);
    var search_list = {};

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
        // Based on Google Maps API v3 
        // Purpose: given an array of Latlng's return a LatlngBounds
        // Why: This is helpful when using fitBounds, panTo
        var newBounds = new L.LatLngBounds;

        for (var m in search_list) {
            newBounds.extend(search_list[m].position);
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

    });

    $(element).on('show_user', function () {
        m.panTo(_latlng);
        m.setZoom(18);
        m.invalidateSize();
    });

    $(element).on('begin_tracking', function (e, response) {
        _latlng = new L.LatLng(response.latitude, response.longitude);
        m.panTo(_latlng);
        m.setZoom(18);
        var marker = new L.Marker(_latlng, new L.Icon.Default).addTo(m);
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
    
    // var _toggled = _toggled || true;
    // m.toggled = function () {
    //     if (_toggled)
    //         return true;
    //     else
    //         return false;
    // };


    // $(element).on('toggle_map', function (e, response) {
    //     if (!_toggled) {
    //         $(element).hide();
    //         _toggled = true;
    //     }
    //     else {
    //         $(element).show();
    //         _toggled = false;
    //     }
    // 
    //     m.setView(new L.LatLng(response.latitude, response.longitude), response.zoom);
    //     m.invalidateSize();
    // });

    return m;

}; 
