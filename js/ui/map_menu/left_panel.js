'use strict'
define(['jquery','ui/widgets/li_link','ui/map_menu/events'],function($,widget,events){
    return {init: function(){
            var ul=$('#left_list'),
            left_list={
                add_search:
                    {text:'New',
                    icon:'pushpin'},
                view_searches:
                    {text:'All Searches',
                    icon:'globe'},
                clear_layers:
                    {text:'Clear Map',
                    icon:'minus-sign'},
                sign_in:
                    {text:'Sign In',
                    icon:'signin',
                    data_rel:"dialog"},
                start_register:
                    {text:'Register',
                    icon:'edit-sign'},
                // change_settings:
                //     {text:'Settings',
                //     icon:'gear'}
            }

            for (var a in left_list){        
                if (events[a]){
                    left_list[a].callback = events[a]
                }
                var item = widget.make(left_list[a]);
                ul.append(item);
            };

            ul.listview('refresh').trigger("create");
        }
    }
    
});
