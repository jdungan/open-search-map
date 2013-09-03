define(['jquery','ui/events'],function($){
    return {
        make:function (settings){
            var this_icon=$('<i>'),
            this_a =$('<a>')
                .attr('data-role','button')
                .attr('data-inline','true')
                .attr('class','header_button');
            
            if (settings.icon){
                this_icon.attr('class','icon-'+settings.icon+' icon-2x');
            }
            
            if (settings.callback){
                this_a.on('click',settings.callback);            
            }
            
            this_a.append(this_icon);

            if (settings.href){
                this_a.attr('href',settings.href)
            }
            
            return this_a;
        }
    }
});

