require(['jquery','jquery.mobile','ui/widgets/icon_link','ui/events'],function($,jqm,widget,events){
    var header=$('#header_icons'),
    ui_items={
        right_arrow:
            {href:'#layer_panel',
            icon :'chevron-sign-right'}, 
        viewUser:
            {icon:'user'},
        viewUsers:
            {icon:'group'},
        toggle_map:
            {icon:'picture'},
        left_arrow:
            {href : '#menu_panel',
            icon : 'chevron-sign-left',
            style: 'float:left;'},
    };
    for (var a in ui_items){        
        if (events[a]){
            ui_items[a].callback = events[a]
        }
        var item = widget.make(ui_items[a]);
        header.append(item);
    };
    $.mobile.activePage.trigger("create");
});