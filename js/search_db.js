"use strict";
// This object contains all the relevant methods for retrieve information on searches
// currently this data is stored with geoloqi so this is mainly a wrapper on geoloqi functions

var search_db = function (){
    var geo_db={}; 
 
    var geoloqi_caller = function (){
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
        
         var call = function(type,url,options){
             var dfd = new $.Deferred()
             geoloqi[type](url,options,function(response,error){
                 if(error){
                     return dfd.reject(error);
                 } else{
                     return dfd.resolve(response);
                 }
             });
             return dfd.promise();
         };
         return call;
    };
 
    var GEODB = new geoloqi_caller();
    
    // geoloqi.newSearch = function(this_map,lat,lng){
    //     geoloqi.post("place/create", {
    //       latitude: lat,
    //       longitude: lng,
    //       layer_id: geoloqi.layer_id,
    //       name:lat+lng,
    //       radius: 100,
    //       extra: {start_time:Date()}
    //     }, function(response, error){
    //         console.log(response, error)
    //         if(!error){
    //             return response;
    //         }
    //     });
    // };


    // geoloqi.user_guid = function(){
    //     var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    //         var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    //          return v.toString(16);
    //     });     
    //     return guid;
    // };


    // geoloqi.display_searches = function (this_map,options){
    //     var next_offset=0;
    //     var layer_id=geoloqi.layer_id;
    //     if (options){
    //         next_offset = options.next_offset || 0;
    //         layer_id = options.layer_id || geoloqi.layer_id; 
    //     }
    //     geoloqi.get("place/list", {
    //         layer_id: layer_id,
    //         offset:next_offset,
    //         limit: 25}, 
    //         function(response, error){
    //             if(!error){
    //                 for (var i = 0; i < response.places.length; i++){
    //                     var p=response.places[i];
    //                     var search_loc = new google.maps.LatLng(p.latitude,p.longitude);
    //                     this_map.searches[p.place_id] = this_map.addSearch(search_loc,p.place_id,p.extra);                
    //                     this_map.panTo(search_loc)
    //                 };
    //                 if (response.paging.next_offset){
    //                     options.next_offset=response.paging.next_offset;
    //                     geoloqi.display_searches(this_map,options);
    //                 }
    //             }
    //         }
    //     );
    // };
    
    var place = function(){
        this.add = function(options){
            return GEODB("post","place/create",options);
        };
    
        this.update = function(place_id,options){
            return GEODB("post",'place/update/'+place_id,options)
        };

        this.delete = function(place_id,options){
            return GEODB("post",'place/delete/'+place_id,options)
        };
        
    };

    var places = function(){
        
        function get_all(options){
            get_all.dfd = get_all.dfd || new $.Deferred();
            get_all.all_places= get_all.all_places || [];
            if (!options.layer_id){
                get_all.dfd.reject("layer_id required");
            }
            if(!options.include_unnamed){
                options.include_unnamed=true;
            }

            GEODB('get',"place/list",options)
                .done(function(response){
                    for (var i = 0; i < response.places.length; i++){
                        var p=response.places[i];
                        get_all.all_places.push(p);
                    };
                    if (!response.paging.next_offset){
                        get_all.dfd.resolve({places:get_all.all_places});
                        get_all.all_places=[];
                    } else {
                        options.offset=response.paging.next_offset;
                        get_all(options);
                    }
                })
                .fail(function(error){
                    get_all.all_places=[];
                    get_all.dfd.reject(error);
                });

            return get_all.dfd.promise();
        };
        function each_place(options,callback){
            var dfd= new $.Deferred()
            var this_callback=callback;
            get_all(options)
              .done(function(response){
                for (var i = 0; i < response.places.length; i++){
                   var place=response.places[i];
                    if (this_callback){
                        this_callback(place);
                    }
                };
                return dfd.resolve();                
              })
              .fail(function(){
                  dfd.reject();
              });
            return dfd.promise();
        };

        this.each= each_place;
        this.all= get_all;
        return this;
    };
    
    

    var layers = function (){
        
        this.all = function (){
            return GEODB('get','layer/list');
        };
        
        this.each = function(callback){
            var dfd= new $.Deferred()
            var this_callback=callback;
            this.all()
              .done(function(response){
                for (var i = 0; i < response.layers.length; i++){
                   var layer=response.layers[i];
                    // keep the users from seeing Geonotes and Users layers
                    if(layer.name != 'Geonotes' && layer.name!='Users'){
                        if (this_callback){
                            this_callback(layer);
                        }
                    }
                };
                return dfd.resolve();                
              })
              .fail(function(error){
                  dfd.reject(error);
              });
            return dfd.promise();
        };
    };

    var user = function(){
        this.anon = function(){
            return GEODB('post','user/anon',{client_id:'d8fa36c91c761155e82795a6745b4e23'})
        }
    };
    
    geo_db.layers = new layers();
    geo_db.places = new places();
    geo_db.place = new place();
    geo_db.login = geoloqi.login;
    return geo_db;
        
};
