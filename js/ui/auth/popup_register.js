define(['jquery','ui/widgets/popup','ui/auth/events'],function($,popup,events){
    var options = {
        id : 'register_popup',
        headline : 'Register',
        message : 'Join a team',
        fields:{
            email:{
                type: 'text',
                name: 'email',
                placeholder: 'Email'}, 
            password:{
                type : 'password',
                name: 'password',
                placeholder: 'Password'
            },
            retype:{
                type : 'password',
                name: 'retype',
                placeholder: 'Retype your password'
            },
            
        },
        ok :{text: 'Sign me up',
             callback:events.register},
        cancel :{text: 'Not yet'},
    };
    
    new_popup = popup.make(options);
    
    team_select =$('<select>')
        .attr('id','team_select')
        .data('native-menu','true')
        .append($('<option>')
            .attr('value','default')
            .text('Select your search team...'))
    
    $('#popup_fields', new_popup).append(team_select);
    
    return new_popup;
});



// <div id="register_popup" data-role='popup' data-theme="b" data-register-user='false'>
//     <div data-role="header" data-add-back-btn="true">
//         <h2>Registration</h2>
//     </div>
//     <div data-role="content" >
//         <p id='register_msg' ></p>
//         <div id='signin_fields' data-role="fieldcontain" class="ui-hide-label">
//             <label for="email">Email</label> <input type="text" name="email" id="email" placeholder="Email"> 
//             <label for="password">Password</label> <input id="password" type="password" name="password"  placeholder="Password"> 
//             <label id="retype" for="retypePassword"></label> <input id="retypePassword" type="password" placeholder="Confirm password"> 
//         </div>
//         <button id='register' class="ui-btn-hidden" type="submit" data-inline="true">Sign Me Up!</button> 
//         <button id='register_quit' class="ui-btn-hidden cancel_button" type="submit" data-inline="true">No Thanks.</button> 
//     </div>
// </div>
