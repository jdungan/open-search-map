define(['jquery'],function($){
    return {
        make:function (options){
            var popup = $('<div>')
                .attr('id',options.id)
                .attr('class','ui-popup-container')
                .data('role','popup')
                .data('theme','b'),
            header = $('<div>')
                .attr('class','ui-header ui-bar-b')
                .data('role','header')
                .data('theme','b')
                .html($('<h1>')
                    .attr('class','ui-title')
                    .attr('aria-level','1')
                    .text(options.headline)),
            content = $('<div>')
                .attr('class','ui-content ui-body-b')
                .data('theme','b')
                .data('role','ui-content'),
            hint = $('<p>')
                .attr('id','user_message')
                .text(options.message),
            fields = $('<div>')
                .attr('id','popup_fields')
                .data('role','fieldcontain')
                .attr('class','ui-hide-label'),                
            ok_btn = $('<button>')
                .attr('class','ui-btn-hidden')
                .attr('type','submit')
                .data('inline','true')
                .text(options.ok.text)
                .on('click',options.ok.callback),
            cx_btn = $('<button>')
                .attr('class','ui-btn-hidden')
                .attr('type','submit')
                .data('inline','true')
                .text(options.cancel.text)
                .on('click',function(){
                    popup.popup('close');
                });

            for (var fld in options.fields){
                label = $('<label>')
                    .attr('for',options.fields[fld].name)
                    .text(options.fields[fld].name);
                
                input = $('<input>')
                    .attr('id',options.fields[fld].name)
                    .attr('type',options.fields[fld].type)
                    .attr('name',options.fields[fld].name)
                    .attr('placeholder',options.fields[fld].placeholder);
                    
                fields
                    .append(label)
                    .append(input);
            };
            
            content
                .append(fields)
                .append(ok_btn)
                .append(cx_btn);
            popup
                .append(header)
                .append(hint)
                .append(content)
                .on('popupafteropen',function(){
                    $(this).popup().trigger('create');
                });

            return popup;
        }
    }
});
