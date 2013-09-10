'use strict';
define(['require','jquery','geoloqi'],function(require,$,geoloqi){
    var auth=function(){};
    auth.prototype.user_response={};
    auth.prototype.user_profile={};
    auth.prototype.login = geoloqi.login;
    
    auth.prototype.new_user = function (auth){
        var this_auth=auth;
        
        require(['search_app'],function(search_app){
            search_app.data.user.create(
                { username: this_auth.username,
                    email: this_auth.username,
                    password: this_auth.password,
                    extra:auth.extra
                })

            .done(function (response) {

                search_app.data.login(this_auth);
            })
            .fail(function (error) {
                $('#user_message','#register_popup').text(error.error_description);
            });
        })
    };    
    
    geoloqi.onAuthorize = function (response) {
        $(window).trigger('login_success',[response]);
    };

    geoloqi.onLoginError = function (error) {
        $(window).trigger('login_failure',[error]);
    };

    return auth;
});
