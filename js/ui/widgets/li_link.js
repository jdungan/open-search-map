define(['jquery'],function($){
    return {
        make:function (settings){
            var this_li=$('<li>'),
                this_a =$('<a>'),
                this_icon=$('<i>');
            
            if (settings.icon){
                this_icon.attr('class','icon-'+settings.icon+' icon-2x');
            }
            this_a.append(this_icon);

            if (settings.text){
                this_a.append('&nbsp;' + settings.text);
            }

            if (settings.callback){
                this_li.on('click',settings.callback);            
            }
            return this_li.append(this_a);
        }
    }
});