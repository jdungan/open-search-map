"use strict";
// This object contains all the relevant methods for retrieve information on searches
// currently this data is stored with geoloqi so this is mainly a wrapper on geoloqi functions

(function (app){
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
    
    var place = function(){
        this.add = function(options){
            options = options || {};
            var user_auth=geoloqi.auth;
            geoloqi.auth={'access_token':'fb75d-ddf59124a0403299ea67e6c001d14c676806459d'};            
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
                        get_all.dfd = new $.Deferred();
                        get_all.all_places=[];
                    } else {
                        options.offset=response.paging.next_offset;
                        get_all(options);
                    }
                })
                .fail(function(error){
                    get_all.all_places=[];
                    get_all.dfd = new $.Deferred();
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
        return this;
    };
    
    var layer = function(){
        
        this.get = function (layer_id){
            if(layer_id){
                return GEODB('post','layer/info/'+layer_id);
            }
        };
        
        this.update = function(layer_id,options){
            return GEODB("post",'layer/update/'+layer_id,options)
        };        
        
    };

    var layers = function (){
        
        this.add = function (layer_name){            
            if(options.name){
                return GEODB('post','layer/create',options);
            }
        };
        
        this.delete = function (layer_id) {
            if(layer_id){
                return GEODB('post','layer/delete/'+layer_id);
            }
        };

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
    
    var groups = function(){
        this.all = function(){
            return GEODB('get', 'group/list');
        };
        
        this.createGroup = function(){
           return GEODB('post', 'group/create', {'title':'TESTcth', 'visibility':'open', 'publish_access':'open'})
        };

        this.members = function(token){
            return GEODB('get', 'group/members/' + token);
        }

        this.members.add = function(token, user_id){
            GEODB('post', 'group/join/' + token, {'user_id' : user_id});
        }
    };
   
    var user = function(){
        var client_id = client_id || 'd8fa36c91c761155e82795a6745b4e23',
            client_secret='eb3c1d6ce7af8beb717b658743f4d139';

        this.anon = function(){

            return GEODB('post','user/anon',{client_id:client_id})
        };
        
        this.profile = function(user_id){
            var options = options || {};
            options.client_id=client_id;
            options.client_secret=client_secret;
            return GEODB('post','user/info/'+user_id,options)
        };
        
        this.create = function(options){
            options.client_id=client_id;
            return GEODB('post','user/create',options);
        };

        this.update = function(user_id,options){
            options = options || {};
            options.client_id=client_id;
            options.client_secret=client_secret;
            return GEODB("post",'user/update/'+user_id,options)
        };

        this.delete =function (user_id){
            var options={};
            options.client_id=client_id,
            options.client_secret=client_secret;
            return GEODB('post','user/delete/'+user_id,options);
        };
    };
    var users = function(){
        var client_id = client_id || 'd8fa36c91c761155e82795a6745b4e23',
            client_secret='eb3c1d6ce7af8beb717b658743f4d139';
        
        this.all =function (){
            var options={};
            options.client_id=client_id,
            options.client_secret=client_secret;
            return GEODB('post','user/list',options);
        };

    };

    geo_db.groups = new groups();
    geo_db.layer = new layer();
    geo_db.layers = new layers();
    geo_db.place = new place();
    geo_db.places = new places();
    geo_db.user = new user();
    geo_db.users = new users();
    geo_db.login = geoloqi.login;
    app.data = geo_db;
        
})(search_app);
