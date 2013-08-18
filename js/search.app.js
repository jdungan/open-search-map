var search_app = (function(pnt,zoom){    
    var map = new L.mapbox.map('map_content').setView(pnt, zoom),    
    this_app = {
        map : map,
        user_position : {latitude:0,longitude:0},
        user_response:null,
        base_maps:[],
        add_base : function(layer){
            var len = this.base_maps.push(layer);
            if (len === 1) {
                this.first_base().addTo(this.map);
            }
        },
        first_base : function(){ 
            return this.base_maps[0];
        },
        base_forward : function(){
            n=this.base_maps.shift();
            this.base_maps.push(n);
            return this.first_base();
        },
        base_back : function(){
            n=this.base_maps.pop()
            this.base_maps.unshift(n);
            return this.first_base();
        },
        rotate_map : function(direction){
                direction = direction || 'forward';
                current_map=this_app.first_base();
                if (direction === 'back') {
                    next_map=this_app.base_back();
                } else {
                    next_map=this_app.base_forward();
                }
                next_map.addTo(this_app.map);
                this_app.map.removeLayer(current_map);
        },
        
        search_groups : {},
        
    };
        
    return this_app;
})([36.1539, -95.9925001],13);



