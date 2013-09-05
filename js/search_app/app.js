define(['mapbox','./map','./base','./location','./users','./data','./auth','./searches']
    ,function(mapbox,map,base,location,users,data,auth,searches){
    var app =function(){};
    app.prototype.map = map;
    app.prototype.base = new base();
    app.prototype.data = new data();
    app.prototype.users =  new users();
    app.prototype.auth = new auth();
    app.prototype.searches = new searches();

//TODO: implement better layer mgmt    
    app.prototype.layers=app.prototype.searches.layers;
    app.prototype.search_layer = app.prototype.searches.search_layer;
//        
    app.prototype.location = new location();
        
    return new app();
});

