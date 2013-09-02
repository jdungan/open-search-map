'use strict';
define(['jquery','geoloqi','search_app'],function($,geoloqi){
    var auth=function(){};
    auth.prototype.user_response={};
    auth.prototype.user_profile={};
    auth.prototype.login = geoloqi.login;
    
    auth.prototype.new_user = function (auth){
        var this_auth=auth;
        data.user.create(
            { username: auth.username,
                email: auth.username,
                password: auth.password
            })
        .done(function (response) {
            $(this).data('register-user', false);
            data.login(this_auth);
        })
        .fail(function (error) {
            $('#signin_msg').text(error.error_description);
        });
    };    
    
    geoloqi.onAuthorize = function (response, error) {
        $(window).trigger('login_success',[response, error]);
    };

    geoloqi.onLoginError = function (error) {
        $(window).trigger('login_failure',[error]);
    };

    return auth;
});
