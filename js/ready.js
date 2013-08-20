jQuery(document).ready(function () {
    

    var map_config = { 
        satellite: {id : 'mapbox_satellite',options:{map_url:'jdungan.map-y7hj3ir7'}},
        buildings: {id : 'mapbox_buildings',options:{map_url:'jdungan.map-147y2axb'}},
        terrain: {id : 'mapbox_terrain', options:{map_url:'jdungan.map-lc7x2770'}}
    };
    
    for (var m in map_config) {
        map_config[m].options = map_config[m].options || {};
        search_app.add_base(
            new L.mapbox.tileLayer(map_config[m].options.map_url)
        );
    };

    search_app.map.invalidateSize();
    
    search_app.retrieve_layer_list();

//toggle maps

    $('#mapPage').on('swipeleft', function(e){
        search_app.rotate_map('forward')
    });
    $('#mapPage').on('swiperight', function(e){
        search_app.rotate_map('back')
    });

    $('a#toggle_map').on('click', search_app.rotate_map);

    $('.app_panel').on('click',function(){
        $(this).panel( "close" );            
    });

    $('.cancel_button').on('click',function(){
        $.mobile.changePage('#mapPage');
    });    

    search_app.location.watch_user();

});