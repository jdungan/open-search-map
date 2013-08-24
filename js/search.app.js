var search_app = (function(pnt,zoom){    
    var map = new L.mapbox.map('map_content').setView(pnt, zoom),    
    this_app = {
        map : map,
        edit_layer:{layer_id:'A2TH'},
        base : {
            base_maps : [],
            add_base : function(layer){
                var len = this.base_maps.push(layer);
                if (len === 1) {
                    this_app.base.first_base().addTo(this_app.map);
                }
            },
            first_base : function(){ 
                return this_app.base.base_maps[0];
            },
            base_forward : function(){
                n=this.base_maps.shift();
                this.base_maps.push(n);
                return this_app.base.first_base();
            },
            base_back : function(){
                n=this_app.base.base_maps.pop();
                this_app.base.base_maps.unshift(n);
                return this_app.base.first_base();
            },
            rotate_map : function(direction){
                    direction = direction || 'forward';
                    current_map=this_app.base.first_base();
                    if (direction === 'back') {
                        next_map=this_app.base.base_back();
                    } else {
                        next_map=this_app.base.base_forward();
                    }
                    next_map.addTo(this_app.map);
                    this_app.map.removeLayer(current_map);
                }
        },
                
    };
        
    return this_app;
})([36.1539, -95.9925001],13);



