"use strict";
define(['jquery','search_app','ui/widgets/li_layer','ui/teams/layer_events'],
    function($,search_app,layer_link,events){
    return {
        retrieve_layer_list : function () {
            $('.layer_item').remove();
            search_app.data.layers.each(function(layer){
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


