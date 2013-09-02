"use strict";
define(['jquery','search_app'],function($,app){
    var fitSearches = function(){
        var options ={padding:[5,5]};
        app.map.fitBounds(app.searches.visibleBounds(),options);            
    };

    app.search_groups = {};
    app.layers=app.searches.layers;
    app.search_layer = app.searches.search_layer;


    
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
                fitSearches();            
            });   
        } else{
            app.layers[layer_id].visible=!app.layers[layer_id].visible;
            $("#layer_list").trigger('layer_visibility_change')       
            fitSearches();           
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
        
});


