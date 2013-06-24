"use strict";

// This object contains all the relevant methods for retrieve information on searches
// currently this data is stored with geoloqi so this is mainly a wrapper on geoloqi functions

var search_db = function (){
    var search_list={}, searchers_list={};
         
    this.init = function (this_map){
        
        // initialize geoloqi
        // d8fa36c91c761155e82795a6745b4e23 j
        // dd261f12d13b5817c631826b5c209c57 l
        geoloqi.init({
          client_id: 'd8fa36c91c761155e82795a6745b4e23',
          package_name: 'Open Search & Rescue',
          package_verison: '0.1',
          persist: 'cookies'
        });

        geoloqi.onAuthorize = function(response, error){
          console.log("You are a user!");
          // start watching position
          $.mobile.changePage('#mapPage');
        };
        geoloqi.onLoginError = function(error){
          console.log("You are not a user!");
          $('#linkDialog').click();
        }

        geoloqi.auth={'access_token':'fb75d-ddf59124a0403299ea67e6c001d14c676806459d'};
        
        geoloqi.get("place/list", {
          layer_id:"96yV"
        }, function(response, error){
            for (var i = 0; i < response.places.length; i++){
                var p=response.places[i];
                var search_loc = new google.maps.LatLng(p.latitude,p.longitude);
                search_list[p.place_id] = this_map.addSearch(search_loc,p.place_id,p.extra);
                this_map.panTo(search_loc);
            };
        });
        
        
        watch_user: new geoloqi.watchPosition({
          success: this_map.goodPositionChange,
          error: this_map.badPositionChange
        });    
    
    };

    
    this.searches=search_list,
    this.searchers=searchers_list,
    this.get= geoloqi.get;
    this.post=geoloqi.post;
    this.login=geoloqi.login;
        
};