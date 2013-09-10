define(['jquery','search_app'],
    function($,search_app){

    return {
        save_new_layer : function(e){        
            var layer_name = $('input#layer_name').val();
            search_app.data.layers.add(layer_name)
            .done(function(){
                $('input#layer_name').val('');
                $("#layer_list").trigger('layer_visibility_change')       
                $('#new_layer_popup').popup( "close" );
            });
        }
    }
    
});