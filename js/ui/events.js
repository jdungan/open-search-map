define(['jquery','search_app'], function($,search_app){
    var fitSearches = function(){
        var options ={padding:[5,5]};
        search_app.map.fitBounds(search_app.searches.visibleBounds(),options);            
    };

    return {
        viewUser : function(){
            search_app.location.show_user();
        },
        viewUsers : function () {
            search_app.map.fitBounds(search_app.users.Bounds());
        },
        viewSearches : function () {
            search_app.map.fitBounds(search_app.searches.visibleBounds());
        },
        clearLayers : function(){
            
            for (var grp in search_app.layers){
              search_app.layers[grp].visible=false;          
            };    
            search_app.searches.markers.forEach(function(m) {
                m.setOpacity( 0 );
            });

            $(document).trigger('layer_visibility_change');      
            
        },
        addSearch : function(){
            $('.search_map').trigger('start_add_search');  

        },
        toggle_map : function(){
            search_app.base.rotate_map();
        },
        toggle_search_layer : function(){
            var layer_id = $(this).data('layer_id');
            var opened_layer = search_app.layers[layer_id];

           if (!opened_layer) {
                search_app.data.places.each({ layer_id: layer_id }, function (response) {
                    response['layer_id']=layer_id;
                    search_app.search_layer.addLayer(search_app.searches.add_search(response));
                })
                .done(function () {
                    search_app.layers[layer_id] = {visible : true};
                    $("#layer_list").trigger('layer_visibility_change')       
                    fitSearches();            
                });   
            } else{
                search_app.layers[layer_id].visible=!search_app.layers[layer_id].visible;
                $("#layer_list").trigger('layer_visibility_change')       
                fitSearches();           
                search_app.searches.setFilter(function(m) {
                    m.setOpacity(search_app.layers[m.options.layer_id].visible && 1 || 0 );
                });
            }
        }
    }
});