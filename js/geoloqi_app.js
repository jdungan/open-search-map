"use strict";

// This object contains all the relevant geoloqi setting, markers, etc.
var geoloqi_app = function (){
    
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
        
        watch_user: new geoloqi.watchPosition({
          success: this_map.goodPositionChange,
          error: this_map.badPositionChange
        });    
    };
    
};