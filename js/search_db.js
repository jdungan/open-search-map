"use strict";
// This object contains all the relevant methods for retrieve information on searches
// currently this data is stored with geoloqi so this is mainly a wrapper on geoloqi functions

var search_db = function (){
    var searchers_list={},
    user_list={};
    geoloqi.layer_id='8neY';;
 
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
        
         var call_obj = function(type,url,options){
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
         return call_obj
    };
 
    var GEODB = new geoloqi_caller();
     
 

    geoloqi.newSearch = function(this_map,lat,lng){
        geoloqi.post("place/create", {
          latitude: lat,
          longitude: lng,
          layer_id: geoloqi.layer_id,
          name:lat+lng,
          radius: 100,
          extra: {start_time:Date()}
        }, function(response, error){
            console.log(response, error)
            if(!error){
                var search_loc = new google.maps.LatLng(response.latitude,response.longitude);
                this_map.searches[response.place_id]=this_map.addSearch(search_loc,response.place_id,response.extra);
                return response;
            }
        });
    };


    // geoloqi.user_guid = function(){
    //     var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    //         var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    //          return v.toString(16);
    //     });     
    //     return guid;
    // };





    geoloqi.display_searches = function (this_map,options){
        var next_offset=0;
        var layer_id=geoloqi.layer_id;
        if (options){
            next_offset = options.next_offset || 0;
            layer_id = options.layer_id || geoloqi.layer_id; 
        }
        geoloqi.get("place/list", {
            layer_id: layer_id,
            offset:next_offset,
            limit: 25}, 
            function(response, error){
                if(!error){
                    for (var i = 0; i < response.places.length; i++){
                        var p=response.places[i];
                        var search_loc = new google.maps.LatLng(p.latitude,p.longitude);
                        this_map.searches[p.place_id] = this_map.addSearch(search_loc,p.place_id,p.extra);                
                        this_map.panTo(search_loc)
                    };
                    if (response.paging.next_offset){
                        options.next_offset=response.paging.next_offset;
                        geoloqi.display_searches(this_map,options);
                    }
                }
            }
        );
    };
    
    var places = function(){
        
        this.all = function (options){
            var dfd = new $.Deferred(),all_places={};
            var places_obj=this;
            if (!options.layer_id){
                dfd.reject("layer_id required");
            }
            
            GEODB('get',"place/list",options)
                .done(function(response){
                    if (!response.paging.next_offset){
                        dfd.resolve(all_places);
                        all_places={};
                    } else {
                        for (var i = 0; i < response.places.length; i++){
                            var p=response.places[i];
                            all_places[p.place_id]=p;
                        };
                        options.offset=response.paging.next_offset;
                        places_obj.all(options);
                    }
                })
                .fail(function(error){
                    all_places={};
                    dfd.reject(error);
                });
            return dfd.promise();
        };
    };
    
    

    var layers = function (id){
        id = id || '';        
        
        this.all = function (){
            var dfd = new $.Deferred()
            geoloqi.get('layer/list',function(response,error){
                if(error){
                    return dfd.reject();
                } else{
                    
                    return dfd.resolve(response);
                }
            });
            return dfd.promise();
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
              .fail(function(){
                  dfd.reject();
              });
            return dfd.promise();
        };
    };
    
    geoloqi.layers = new layers();
    geoloqi.places = new places();

    geoloqi.searchers=searchers_list;
    return geoloqi;
        
};

// geoloqi.get("place/delete/"+p.place_id,{},function(response,error){
//     
//     console.log(response);
// });
