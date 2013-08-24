'use strict';
(function(app){
    var auth={};
    auth.user_response=null;
    auth.new_user = function (auth){
        var this_auth=auth;
        app.data.user.create(
            { username: auth.username,
                email: auth.username,
                password: auth.password
            })
        .done(function (response) {
            $(this).data('register-user', false);
            app.data.login(this_auth);
        })
        .fail(function (error) {
            $('#signin_msg').text(error.error_description);
        });

    };
    
    auth.login = app.data.login;
    
    geoloqi.onAuthorize = function (response, error) {
        // response.access_token=null;
        auth.user_response=response
        console.log("You are a user:"+response.display_name);
        $.mobile.changePage('#mapPage');
        
    };

    geoloqi.onLoginError = function (error) {
        console.log("You are not a user!");
        $('#signin_failure_popup').popup( "open" );
        
    };

    app.auth = auth;
})(search_app);


$('button#signin').on('click', function (e) {
    var user_auth = {};
    user_auth.username = $('input#email','#signin_popup').val();
    user_auth.password = $('input#password','#signin_popup').val();
    $('#signin_msg').text('');
    search_app.auth.login(user_auth);
    $('#signin_popup').popup( "close" );
});


$('button#register').on('click', function (e) {
    var user_auth = {};
    user_auth.username = $('input#email','#register_popup').val();
    user_auth.password = $('input#password','#register_popup').val();
    
    $('#signin_msg').text('');
    user_auth.retype = $('input#retype','#register_popup').val();
    if (user_auth.password === user_auth.retype) {
        search_app.auth.new_user(user_auth);
        $('#register_popup').popup( "open" );
    } else {
        $('#signin_msg').text('Passwords do not match')
    }
});


$('a#sign_in').on('click', function () {    
    $('#signin_popup').popup( "open" );
});

$('a#login_again').on('click', function () {    
    $('#signin_failure_popup').popup( "close" );
    setTimeout(function() { $( "#signin_popup" ).popup( "open" ) }, 100 );
});

$('a#start_register').on('click', function () {    
    $('#signin_failure_popup').popup( "close" );
    setTimeout(function() { $( "#register_popup" ).popup( "open" ) }, 100 );
});
