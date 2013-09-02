define(['mapbox','./map','./base','./location','./users','./data','./auth','./searches']
    ,function(mapbox,map,base,location,users,data,auth,searches){
    var app =function(){};
    app.prototype.map = map;
    app.prototype.base = new base();
    app.prototype.data = new data();
    app.prototype.users =  new users();
    app.prototype.auth = new auth();
    app.prototype.searches = new searches();    
    app.prototype.location = new location();
    return new app();
});

