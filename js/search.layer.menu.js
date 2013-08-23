"use strict";
(function(app){
    app.search_groups = {};
    app.toggle_search_layer = function(){
        var layer_id = $(this).data('layer_id');
        var opened_layer = app.layers[layer_id];
        
       if (!opened_layer) {
            app.data.places.each({ layer_id: layer_id }, function (response) {
                response['layer_id']=layer_id;
                app.search_layer.addLayer(app.searches.add_search(response));
            })
            .done(function () {
                app.layers[layer_id] = {visible : true};
                $("#layer_list").trigger('layer_visibility_change')       
                app.map.fitBounds(app.searches.visibleBounds());            
            });   
        } else{
            app.layers[layer_id].visible=!app.layers[layer_id].visible;
            $("#layer_list").trigger('layer_visibility_change')       
            app.map.fitBounds(app.searches.visibleBounds());
            app.searches.setFilter(function(m) {
                m.setOpacity(app.layers[m.options.layer_id].visible && 1 || 0 );
            });
        }
    };

    app.retrieve_layer_list = function () {
        $('.layer_item').remove();
        app.data.layers.each(function(layer){
            $('#layer_list').append(
                $('<li>')
                    .attr('class','layer_item' )
                    .attr('data-layer_id',layer.layer_id)
                    .html(
                        $('<a>')
                            .attr('data-role','button')
                            .attr('data-rel','dialog')
                            .html(
                                $('<i>')
                                    .attr('class','icon-circle-blank')
                                    .attr('data-layer_id',layer.layer_id)
                                    .attr('data-layer_name',layer.name)
                                    .text(" "+layer.name)
                                )
            
                    ));
            
            })
            .done(function(){
                $("#layer_list").listview('refresh').trigger("create");
                $("li.layer_item").on('click',app.toggle_search_layer);
            });
    };    
})(search_app);

$(document).on('layer_visibility_change',function(){
    $('#layer_list li.layer_item').each( function (i){
        var layer_id = $(this).data('layer_id'),
        is_visible = search_app.layers[layer_id] && search_app.layers[layer_id].visible,
        icon_class = is_visible && 'icon-circle' || 'icon-circle-blank';
        $('i',this).attr('class',icon_class);
    });
});

$('button#save_new_layer').on('click', function(e){        
    var layer_name = $('input#layer_name').val();
    search_app.data.layers.add(layer_name)
    .done(function(){
        $('input#layer_name').val('');
        $("#layer_list").trigger('layer_visibility_change')       
        $('#new_layer_popup').popup( "close" );
    });
});

$('a#delLayer').on('click',function(e){
    e.stopImmediatePropagation();
    $('.layer_item i').attr('class','icon-remove-sign')
    $('.layer_item i').on('click',function(e){
        $('#delete_layer_name').text( $(this).data('layer_name'));
        $('#delete_layer_name').data('layer_id',$(this).data('layer_id'))
        $('#delete_layer_popup').popup( "open" );
    });
});

$('#layer_panel').on( "panelclose", function( event, ui ) {
    $('.layer_item i').on('click',null);
    $("#layer_list").trigger('layer_visibility_change')       
});

$( "#delete_layer_popup" ).on( "popupafterclose",function(){
    $('#delete_layer_name').data('layer_id','');
    $('#delete_layer_name').text( '' );
});

$('button#submit_delete_layer').on('click',function(e){
    var layer_id = $('#delete_layer_name').data('layer_id');
    search_app.data.layers.delete(layer_id)
    .done(function(){
       $('#delete_layer_popup').popup( "close" );
    });
});


// //hack to open layeers
// debugger;
// var options={};
// options.public=1;
// app.data.layer.update(layer.layer_id,options)
// 
// // end hack            

