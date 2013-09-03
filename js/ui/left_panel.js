'use strict'
require(['jquery','ui/widgets/li_link','ui/events'],function($,widget,events){
    var ul=$('#left_list'),
    left_list={
        addSearch:
            {text:'New',
            icon:'pushpin'},
        viewSearches:
            {text:'All Searches',
            icon:'globe'},
        clearLayers:
            {text:'Clear Map',
            icon:'minus-sign'},
        sign_in:
            {text:'Sign In',
            icon:'signin',
            data_rel:"dialog"},
        start_register:
            {text:'Register',
            icon:'edit-sign'},
        change_settings:
            {text:'Settings',
            icon:'gear'}
    }
    
    for (var a in left_list){        
        if (events[a]){
            left_list[a].callback = events[a]
        }
        var item = widget.make(left_list[a]);
        ul.append(item);
    };
    
    ul.listview('refresh').trigger("create");
    
});
