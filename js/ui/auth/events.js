define(['require','jquery','search_app'], function(require,$,search_app){   
    return {
        signin : function (e) {
            var user_auth = {},this_popup = $('#signin_popup');
            user_auth.username = $('input#email',this_popup).val();
            user_auth.password = $('input#password',this_popup).val();
            $('#user_message',this_popup).text('');
            search_app.auth.login(user_auth);
        },
        signin_success : function(event,response){
            search_app.auth.user_response=response
            search_app.data.user.profile(response.user_id).done(function(response){
               search_app.auth.user_profile= response;
               if (response.extra.layer_id){
                   search_app.map.layer_id=response.extra.layer_id;
               }
            });
            console.log("You are a user:"+response.display_name);
            $('#change_settings').show();
            $.mobile.changePage('#mapPage');
        },
        signin_failure : function(event,error){
            console.log("You are not a user!");            
            this_pop = $('#signin_popup');            
            $('#user_message',this_pop).text(error.error_description);
        },
        register : function (e) {
            var user_auth = {};
            user_auth.username = $('input#email','#register_popup').val();
            user_auth.password = $('input#password','#register_popup').val();
            user_auth.retype = $('input#retype','#register_popup').val();
            selected_team =$('select#team_select option:selected','#register_popup').val();

            if (selected_team === 'default'){
                    $('#user_message','#register_popup').text('Please select a team');        
            } else {
                if (user_auth.password === user_auth.retype) {
                    search_app.auth.new_user(user_auth);
                    $('#register_popup').popup( "open" );
                } else {
                    ('#user_message','#register_popup').text('Passwords do not match')
                }
            }
        }
    }
});











