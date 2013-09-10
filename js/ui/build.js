define(['ui/teams/layer_menu','ui/map_menu/left_panel','jquery.mobile','ui/header'],
    function(layer,menu){
    
    $('#mapPage').on('swipeleft', function(e){
        search_app.base.rotate_map('forward')
    });

    $('#mapPage').on('swiperight', function(e){
        search_app.base.rotate_map('back')
    });

    $('#mapPage').on('pageshow',function(){
        $( ".app_panel" ).trigger( "updatelayout" );
        search_app.map.invalidateSize();
    });

    $('.app_panel').on('click',function(){
        $(this).panel( "close" );            
    });
    
    return{
        init: function(){
            layer.retrieve_layer_list();
            menu.init()
        }
    };
    
});