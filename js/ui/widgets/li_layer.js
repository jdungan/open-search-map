define (['jquery','ui/events'],function($,events){
    return {
        make : function (options){
            var this_li = $('<li>')
                .attr('class','layer_item' )
                .data('layer_id',options.layer_id)
                .html(
                    $('<a>')
                        .data('role','button')
                        .data('rel','dialog')
                        .html(
                            $('<i>')
                                .attr('class','icon-circle-blank')
                                .data('layer_id',options.layer_id)
                                .data('layer_name',options.name)
                                .text(" "+options.name)
                        )
                )
                .on('click',events.toggle_search_layer);
            return this_li;
        }
    }
});