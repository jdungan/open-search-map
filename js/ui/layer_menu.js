"use strict";
define(['jquery','search_app','ui/widgets/li_layer'],function($,ap,layer_link){
    return {
        retrieve_layer_list : function () {
            $('.layer_item').remove();
            ap.data.layers.each(function(layer){
                    var options = {layer_id: layer.layer_id, name: layer.name},
                    new_li = layer_link.make(options);
                    $('#layer_list').append(new_li);
                
                })
                .done(function(){
                    $("#layer_list").listview('refresh').trigger("create");
                });
        }
    };
});


