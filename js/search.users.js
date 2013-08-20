'use strict';
(function(app){
    var users={};

    users.new_user = function (auth){
        this_auth=auth;
        search_data.user.create(
            { username: auth.username,
                email: auth.username,
                password: auth.password
            })
        .done(function (response) {
            $(this).data('register-user', false);
            search_data.login(this_auth);
        })
        .fail(function (error) {
            $('#signin_msg').text(error.error_description);
        });

    };

    geoloqi.onAuthorize = function (response, error) {
        users.user_response=response
        console.log("You are a user:"+response.display_name);
        $.mobile.changePage('#mapPage');
    };

    geoloqi.onLoginError = function (error) {
        console.log("You are not a user!");
        $('#linkDialog').click();
    };

    app.users = users;
})(search_app);


$('#signin_page').on('pagebeforeshow', function () {
    var register_user = $(this).data('register-user'),
    retype_type = register_user && "password" || "hidden",
    signin_title = register_user && "Registration" || "Sign In",
    signin_btn_text = register_user && "Sign Me Up!" || "Sign In";

    $('#retypePassword').attr('type', retype_type);
    $('#signin_title').text(signin_title)
    $('button#signin').text(signin_btn_text).button("refresh");

    if (register_user) {
        $('#retypePassword').parent().show();
    } else {
        $('#retypePassword').parent().hide();
    };
    $(this).trigger("create");
});

$('button#signin').on('click', function (e) {
    var auth = {}; auth.username = $('input#email').val(),
    auth.password = $('input#password').val();
    $('#signin_msg').text('');
    if ($('#retypePassword').attr('type') === 'password') {
        auth.retype = $('input#retypePassword').val();
        if (auth.password != auth.retype) {
            $('#signin_msg').text('Passwords do not match')
        } else {
            newUser(auth);
        }
    } else {
        search_data.login(auth);
    }
});

$('button#signin_quit').on('click',function(){
    $('#signin_page').data('register-user',false);
    $('#signin_msg').text(''); 
    $('#retypePassword').attr('type','hidden').parent().hide();
    $('#signin_page').trigger("create");        
});    

$('a#btnStartRegister').on('click', function () {
    $('#signin_page').data('register-user', true);
});
