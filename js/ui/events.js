define(['jquery','search_app'], function($,search_app){
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
        }

    }
});