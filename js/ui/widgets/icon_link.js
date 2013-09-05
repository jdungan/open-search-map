define(['jquery','ui/events'],function($){
    return {
        make:function (options){
            var this_icon=$('<i>'),
            this_a =$('<a>')
                .attr('data-role','button')
                .attr('data-inline','true')
                .attr('class','header_button');
            
            if (options.icon){
                this_icon.attr('class','icon-'+options.icon+' icon-2x');
            }
            if (options.style){
                this_a.attr('style',options.style)
            }
            if (options.callback){
                this_a.on('click',options.callback);            
            }
            
            this_a.append(this_icon);

            if (options.href){
                this_a.attr('href',options.href)
            }
            
            return this_a;
        }
    }
});

