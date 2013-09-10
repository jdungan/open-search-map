define(['jquery','search_app','ui/auth/popup_signin','ui/auth/popup_register'],
    function($,search_app,signin,register){

    search_app.data.layers.each(function(response){
        var layer_option=$('<option>').attr('value',response.layer_id).text(response.name);
        $('#team_select',register).append(layer_option);
    });


    var open_popup = function(p){
        if (p.parent().length===0){
            $('#mapPage').append(p)
            p.popup();// this intializes the popup
        }
        p.popup( "open");    

        p.popup( "open",{positionTo:'window'}    
        );            
    };

    return {
        view_user : function(){
            search_app.location.show_user();
        },
        view_users : function () {
            search_app.map.fitBounds(search_app.users.Bounds());
        },
        view_searches : function () {
            search_app.map.fitBounds(search_app.searches.visibleBounds());
        },
        clear_layers : function(){
            for (var grp in search_app.layers){
              search_app.layers[grp].visible=false;          
            };    
            search_app.searches.markers.forEach(function(m) {
                m.setOpacity( 0 );
            });

            $(document).trigger('layer_visibility_change');      
            
        },
        add_search : function(){
            
            $('.search_map').trigger('start_add_search');  

        },
        sign_in : function () {    
            open_popup(signin);
        },
        start_register : function(){

            open_popup(register);
        }
    }
});