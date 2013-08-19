//panel menu choices

$("#addSearch").on('click',function(){
    $('.search_map').trigger('start_add_search');           
});

$('a#viewUsers').on('click', function () {
     $('.search_map').trigger('display_users');
 });

$('a#viewSearches').on('click', function () {
    $('.search_map').trigger('display_searches');
});

$('a#viewUser').on('click', function(){
    search_app.first_base().show_user(search_app.user_position)
     // $('.search_map').trigger("show_user",search_app.user_position);
});    

$('a#clearLayers').on('click', function(){
    $('.search_map').trigger("clear_map");
});   



$('#btnViewGroups').on('click', function(){
        
    var userOptions = {
        groupToken : this.groupToken || null,
        onEachItem : function(listElem, anchorElem, item){
            var token = this.groupToken;
            anchorElem.text(item.display_name).attr('href', '#viewGroupMembers');
            listElem.click(function(){
                search_data.groups.members.add(token, item.user_id);
                search_data.groups.members(token).done(function(memRes){
                    buildList(memRes.members, memOptions);
                });  
            });
        },
        list : $('#userList')
    };

    var memOptions = {
        groupToken : this.groupToken || null,
        onEachItem : function(listElem, anchorElem, item){
            anchorElem.text(item.profile.display_name).attr('href', '#');
            listElem.click(function(){});
        },
        addStaticItem : function(listElem, anchorElem){
            var token = this.groupToken;
            anchorElem.text('Invite Member').attr('href', '#viewUsers');
            listElem.click(function(){
                search_data.users.all().done(function(userRes){
                    userOptions.groupToken = token;
                    buildList(userRes.users, userOptions);
                });
            });
        },
        list : $('#memberList')
    };

    var grpOptions = {
        onEachItem : function(listElem, anchorElem, item){
            anchorElem.text(item.title).attr('href', '#viewGroupMembers');
            listElem.click(function(){
                search_data.groups.members(item.group_token).done(function(memRes){
                    memOptions.groupToken = item.group_token;
                    buildList(memRes.members, memOptions);
                });        
            });
        },
        addStaticItem : function(listElem, anchorElem){
            anchorElem.text('Add Group');
            listElem.click(function(){});
        },
        list : $('#groupList')
    };

    search_data.groups.all().done(function(grpJSON){
        buildList(grpJSON.groups, grpOptions);
    });

});     
function buildList(arr, options){
    var _ul = options.list;

    if(_ul.children().length > 0)
        _ul.children().remove();

    var _li = $('<li>');
    var _a = $('<a>');


    if(typeof options.addStaticItem == 'function'){
        options.addStaticItem(_li, _a);
        _ul.append(_li.append(_a));
    }

    arr.forEach(function(el){
        _li = $('<li>');
        _a = $('<a>');
        options.onEachItem(_li, _a, el);
        _li.append(_a);
        _ul.append(_li);
    });

    _ul.listview();
    _ul.listview('refresh');
}
