'use strict'
define(['mapbox'], function(mapbox){
    var map;
    if(!map){
        map=new L.mapbox.map('map_content').setView([36.1539, -95.9925001],13);
        map.invalidateSize();
        map.default_edit_layer={layer_id:'A2TH'};
        map.edit_layer={layer_id:'A2TH'};        
    };
    return map;
});
