'use strict';
(function(app){
    var auth={};
    auth.user_response=null;
    auth.user_profile;
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
        app.data.user.profile(response.user_id).done(function(response){
           auth.user_profile= response;
           if (response.extra.layer_id){
               search_app.edit_layer.layer_id=response.extra.layer_id;
           }
        });
        console.log("You are a user:"+response.display_name);
        $('#change_settings').show();
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
    user_auth.extra.layer_id = search_app.default_edit_layer.layer_id;    
    $('#signin_msg').text('');
    user_auth.retype = $('input#retype','#register_popup').val();
    if (user_auth.password === user_auth.retype) {
        search_app.auth.new_user(user_auth);
        $('#register_popup').popup( "open" );
    } else {
        $('#register_msg').text('Passwords do not match')
    }
});


$('a#sign_in').on('click', function () {    
    $('#signin_popup').popup( "open" );
});

$('a#login_again').on('click', function () {    
    $('#signin_failure_popup').popup( "close" );
    setTimeout(function() { $('a#sign_in').click()}, 100 );
});


$('a#start_register').on('click', function () {    
    $('#signin_failure_popup').popup( "close" );
    $('#layer_select','#register_popup').html('')
    search_app.data.layers.each(function(response){
        var layer_option=$('<option>').attr('value',response.layer_id).text(response.name);
        $('#layer_select','#register_popup').append(layer_option);
    });
    setTimeout(function() { $( "#register_popup" ).popup( "open" ) }, 100 );
});

// initialize the layer list for user settings
search_app.data.layers.each(function(response){
    var layer_option=$('<option>').attr('value',response.layer_id).text(response.name);
    $('#layer_select','#settings_popup').append(layer_option);
});

$('a#change_settings').on('click', function () {
    var user_layer_id;
    if(search_app.auth.user_profile.extra){
        var users_layer_id = search_app.auth.user_profile.extra.layer_id;        
        $('#layer_select','#settings_popup').val(users_layer_id).change();
    }
    $('#settings_popup').popup( "open" );
});

$('button#save_settings').on('click', function (e) {
    var options = {extra:{}};
    options.extra.layer_id = $('#layer_select option:selected','#settings_popup').val()
    search_app.edit_layer.layer_id=options.extra.layer_id;
    search_app.data.user.update(search_app.auth.user_response.user_id,options)
    .done(function(response){
        search_app.edit_layer.layer_id=response.updated.extra.layer_id;
    });
    $('#settings_popup').popup( "close" );
    
});
