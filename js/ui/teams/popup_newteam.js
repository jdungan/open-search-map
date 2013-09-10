
define (['jquery','ui/widgets/popup','ui/auth/events'],function($,popup,events){
    var options = {
        id : 'new_layer_popup',
        headline : 'Add a Team',
        message : 'Do you want to create a new search team?',
        fields:{
            email:{
                type: 'text',
                name: 'layer_name',
                placeholder: 'Name for the new team?'}
        },
        ok :{text: 'Yes, save it.',
             callback:events.signin},
        cancel :{text: 'No'}
    };
    
    new_popup = popup.make(options);

    return new_popup;
});


// 
// 
// 
// <div  id="new_layer_popup" data-role="popup">
//     <div data-role="header" data-close-btn="right">
//         <h2>Create a new search team?</h2>
//       </div>
//       <div data-role="content" >
//           <div id='new_layer_fields' data-role="fieldcontain" class="ui-hide-label">
//               <input type="text" name="layer_name" id="layer_name" placeholder="Name for this group"> 
//           </div>
//           <button class="ui-btn-hidden" type="submit" id="save_new_layer"  data-inline="true"></button> 
//           <button class="ui-btn-hidden cancel_button" type="submit" data-inline="true">Cancel</button> 
//       </div>
// </div>
