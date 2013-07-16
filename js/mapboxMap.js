var mapboxMap = function (element) {
    var _latlng = _latlng || new L.LatLng(36.1539, -95.9925),
        _zoom = _zoom || 18;

    var m = new L.mapbox.map(element, 'jdungan.map-lc7x2770').setView(_latlng, _zoom);

    m.setCurrentPosition = function (pos) { _latlng = new L.LatLng(pos.latitude, pos.longitude); };
    m.getCurrentPosition = function () { return _latlng; };

    m.add_Search = function (response) {
        var mbIcon = L.icon({
            iconUrl: (response.extra.end_time && './img/search_end.svg') || './img/search_start.svg',
            iconSize: [32, 32],
            iconAnchor: [32, 32]
        });
        var mbMarker = L.marker([response.latitude, response.longitude], { icon: mbIcon }).addTo(this);
        return mbMarker;
    };

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

    var _toggled = _toggled || true;
    $(element).on('toggle_map', function () {
        console.log(_toggled);

        if (!_toggled) {
            $(element).hide();
            _toggled = true;
        }
        else {
            $(element).show();
            _toggled = false;
        }

        m.invalidateSize();
    });

    return m;

}; 
