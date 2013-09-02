define(['mapbox','./map'],function(mapbox,map){
    var mod =function(){};
    mod.prototype.base_maps =[];
    mod.prototype.add_base = function(map_url){
        layer = new L.mapbox.tileLayer(map_url);
        var len = this.base_maps.push(layer);
        if (len === 1) {
            this.first_base().addTo(map);
        }
    };
    mod.prototype.first_base = function(){ 
        return this.base_maps[0];
    };
    mod.prototype.base_forward = function(){
        n=this.base_maps.shift();
        this.base_maps.push(n);
        return this.first_base();
    };
    mod.prototype.base_back = function(){
        n=this.base_maps.pop();
        this.base_maps.unshift(n);
        return this.first_base();
    };
    mod.prototype.rotate_map = function(direction){
            direction = direction || 'forward';
            current_map=this.first_base();
            if (direction === 'back') {
                next_map=this.base_back();
            } else {
                next_map=this.base_forward();
            }
            next_map.addTo(map);
            map.removeLayer(current_map);
    };
    return mod;
});

