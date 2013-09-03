require(['jquery','ui/widgets/icon_link','ui/events'],function($,widget,events){

    var header=$('#header_icons'),
    ui_items={
        left_arrow:
            {href : '#menu_panel',
            icon : 'chevron-sign-left'},
        right_arrow:
            {href:'#layer_panel',
            icon :'chevron-sign-right'}, 

        toggle_map:{icon:'picture'},
        viewUser:{icon:'user'},
        viewUsers:{icon:'group'}
    };
    
    for (var a in ui_items){        
        if (events[a]){
            ui_items[a].callback = events[a]
        }
        var item = widget.make(ui_items[a]);
        header.append(item);
    };
    
    header.container.listview('refresh');
    // .trigger("create");
});











// 
// <a href='#menu_panel' data-role='button'  data-inline='true' >
//     <i class="icon-chevron-sign-left icon-2x"></i>
// </a>
// <a href='#layer_panel' data-role='button'  data-inline='true' class='header_button'>
//     <i class="icon-chevron-sign-right icon-2x"></i>
// </a>
// 
// 
// <a id="toggle_map"  data-role='button'  data-inline='true' class='header_button'>
//  <i class="icon-picture icon-2x"></i>
// </a>
// 
// <a id='viewUser' data-role="button" data-inline='true'  class='header_button'>
//    <i class="icon-user icon-2x"></i>
// </a>
// 
// <a id='viewUsers' data-role="button" data-inline='true'  class='header_button'>
//    <i class="icon-group icon-2x"></i>
// </a>
// 
// <!-- <a id='viewSearches' data-role="button" data-inline='true'  class='header_button'>
//    <i class="icon-globe icon-2x"></i>
// </a> -->
