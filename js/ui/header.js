require(['jquery','jquery.mobile','ui/widgets/icon_link','ui/events'],function($,jqm,widget,events){
    var header=$('#header_icons'),
    ui_items={
        left_arrow:
            {href : '#menu_panel',
            icon : 'chevron-sign-left',
            style: 'float:left'},
        right_arrow:
            {href:'#layer_panel',
            style: 'float:right',
            icon :'chevron-sign-right'}, 
        view_user:
            {icon:'user'},
        view_users:
            {icon:'group'},
        toggle_map:
            {icon:'picture'},
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