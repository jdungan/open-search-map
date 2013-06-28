"use strict";
// This object contains all the relevant methods for retrieve information on searches
// currently this data is stored with geoloqi so this is mainly a wrapper on geoloqi functions

var search_db = function (){
    var searchers_list={},user_list={};
    geoloqi.search_list={};
    geoloqi.layer_id='8neY';

    geoloqi.searchBounds = function (arrayLatlng){        
        // Based on Google Maps API v3 
        // Purpose: given an array of Latlng's return a LatlngBounds
        // Why: This is helpful when using fitBounds, panTo
        var newBounds = new google.maps.LatLngBounds,p=0;

        for (var m in geoloqi.search_list){
            newBounds.extend(geoloqi.search_list[m].position);
        }
        return newBounds;
    };


    // geoloqi.user_guid = function(){
    //     var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    //         var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    //          return v.toString(16);
    //     });     
    //     return guid;
    // };

    // initialize geoloqi
    // d8fa36c91c761155e82795a6745b4e23 j
    // dd261f12d13b5817c631826b5c209c57 l
    geoloqi.init({
      client_id: 'd8fa36c91c761155e82795a6745b4e23',
      package_name: 'Open Search & Rescue',
      package_verison: '0.1',
      persist: 'cookies'
    });

    geoloqi.auth={'access_token':'fb75d-ddf59124a0403299ea67e6c001d14c676806459d'};

    geoloqi.stored_searches = function (this_map,next_offset){
        var next_offset = next_offset || 0;
        geoloqi.get("place/list", {
            layer_id: geoloqi.layer_id,
            offset:next_offset,
            limit: 25}, 
            function(response, error){
                if(!error){
                    for (var i = 0; i < response.places.length; i++){
                        var p=response.places[i];
                        var search_loc = new google.maps.LatLng(p.latitude,p.longitude);
                        geoloqi.search_list[p.place_id] = this_map.addSearch(search_loc,p.place_id,p.extra);                
                    };
                    if (response.paging.next_offset){
                        geoloqi.stored_searches(this_map,response.paging.next_offset);
                    }
                }
            }
        );
    };
    
    geoloqi.searches=geoloqi.search_list,
    geoloqi.searchers=searchers_list;
    return geoloqi;
        
};

// geoloqi.get("place/delete/"+p.place_id,{},function(response,error){
//     
//     console.log(response);
// });
