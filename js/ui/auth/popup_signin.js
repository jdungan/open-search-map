define (['jquery','ui/widgets/popup','ui/auth/events'],function($,popup,events){
    var options = {
        id : 'signin_popup',
        headline : 'Sign In',
        message : '',
        fields:{
            email:{
                type: 'text',
                name: 'email',
                placeholder: 'Email'}, 
            password:{
                type : 'password',
                name: 'password',
                placeholder: 'Password'
            }
        },
        ok :{text: 'Sign in',
             callback:events.signin},
        cancel :{text: 'Cancel'}
    };
    
    new_popup = popup.make(options);
    $(window).on('login_success',events.signin_success);
    $(window).on('login_failure',events.signin_failure);

    return new_popup;
});
