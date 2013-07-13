jQuery(document).ready(function() {
    
//init the map
      
      var map_types={};
      var mb_options = {
         center: [36.1539, -95.9925],
         zoomLevel: 18,
         mapElement: document.getElementById("mapbox_content")
      };
      // var ttown = ttown || openMap;

      // ttown= new googleMap(document.getElementById("map_content"));

      ttown= new googleMap(document.getElementById('map_content'));
      
      mbtown = new mapboxMap().map(mb_options);
      
      $('#mapbox_content').hide();


// init search data
    var search_data = search_data || new search_db();


//init socket
   var socket = io.connect('http://206.214.164.229');
   // var socket = io.connect('http://unleashprometheus.com:8000'); 
   socket.on('message', function (data) {
       console.log(data);
       $.event.trigger(data.eventType,data.payload);      
    });  

//socket events
    $(document).on("newSearch", function(e,response){
        var search_loc = [response.latitude,response.longitude];
        ttown.searches[response.place_id]=ttown.addSearch(search_loc,response.place_id,response.extra);
    });

    $(document).on("endSearch", function(e,response){
        marker=ttown.searches[response.place_id];
        marker.icon.url="./img/search_end.svg";
        marker.setMap(ttown)// force icon to re-render;
        marker.search_window.setSearchWindowContent(response.extra)        
    });

    $(document).on("moveSearch", function(e,response){
        marker=ttown.searches[response.place_id];
        var search_loc = new google.maps.LatLng(response.latitude,response.longitude);
        marker.setPosition(search_loc);
    });

//client events
    $(document).on("endSearch_click", function(e,marker_key){
        search_data.place.update(marker_key,
            {extra: {end_time:Date()}})
        .done(function(response){
            $.event.trigger("endSearch",response);
            socket.emit('message',{eventType: 'endSearch', payload: response});                        
        });        
    });        

    $(document).on("markerMove", function(e,marker_key){
        marker=ttown.searches[marker_key];
        search_data.place.update(marker_key,
            {latitude:  marker.position.lat(),
            longitude: marker.position.lng()})
        .done(function(response){
            socket.emit('message',{eventType: 'moveSearch', payload: response});                        
        });        
    });
    
    $('#btnToggleMap').on('click',function toggleMap(){
        toggleMap.map_type=toggleMap.map_type||'google';
        if (toggleMap.map_type==='google'){
            $('#map_content').hide();
            $('#mapbox_content').show();
            toggleMap.map_type='mapbox'
        } else {
            $('#map_content').show();
            $('#mapbox_content').hide();        
            toggleMap.map_type='google'
        }
        $('#mapPage').trigger('pageshow');        
    });

//jqm page events 
    $("#mapPage").on("pageshow",function(){
        google.maps.event.trigger(ttown, 'resize');
    });

// load layer panel
    search_data.layers.each(function(layer){
        $('#layer_list').append( 
           "<li class='viewLayer' data-layer_id="+layer.layer_id+">\
               <a  data-role='button' data-rel='dialog'>\
                   <i class='icon-copy' ></i>&nbsp;"+layer.name+"&nbsp; "+layer.layer_id+"  </a>\
           </li>"           
        )})
        .done(function(){
            $("#layer_list").listview('refresh').trigger("create");
            $("li.viewLayer").on('click',function(){

                $( "#layer_panel" ).panel( "close" );
                layer_id = $(this).data('layer_id');
                layer_name = $(this).text()
                $('li#current_layer').data('current-layer',layer_id);
                $('li p#layer_label').text(layer_name);                
                
                displayLayer(layer_id);
            });
        });

    function displayLayer(layer_id){
        search_data.places.each({layer_id:layer_id},function(response){
            $('.search_map').trigger('display_search',[response]);            
        })
        .done(function(){
            $('.search_map').trigger('display_all');
        });   
    }


//map events
$('.search_map').on('stop_add_search',function(e,search_location){
    var geoOptions = {
          layer_id: $('li#current_layer').data('current-layer'),
          latitude:search_location.latitude,
          longitude:search_location.longitude,
          radius:100,
          extra:{start_time:Date()} 
    };

    search_data.place.add(geoOptions).done(function(response){
        $('.search_map').trigger('display_search',[response]);  
        socket.emit('message', {eventType: 'newSearch', payload: response});
    });
})

//panel menu choices


    $("#addSearch").on('click',function(){
        $( "#menu_panel" ).panel( "close" );
        $('.search_map').trigger('start_add_search');
            
    });

    $('a#viewSearches').click(function(){
        $( "#menu_panel" ).panel( "close" );
        $('.search_map').trigger('display_all');
    });    

    $('a#viewUser').click(function(){
         $( "#menu_panel" ).panel( "close" );
         $('.search_map').trigger("show_user");
    });    

    $('a#clearLayers').click(function(){
        $( "#menu_panel" ).panel( "close" );
        $('.search_map').trigger("clear_map");
    });    



//authentication
    function newUser(auth){
        this_auth=auth;
        search_data.user.create(
            {   username:auth.username,
                email:auth.username,
                password:auth.password
            })
        .done(function(response){
            $(this).data('register-user',false);
            search_data.login(this_auth);
        })
        .fail(function(error){
            $('#signin_msg').text(error.error_description);   
        });
        
    };

    $('#signin_page').on('pagebeforeshow',function(){
        var register_user =$(this).data('register-user');
        
        retype_type = register_user && "password" || "hidden";
        signin_title = register_user && "Registration" || "Sign In";
        signin_btn_text = register_user && "Sign Me Up!" || "Sign In";
        
        
        $('#retypePassword').attr('type',retype_type);
        $('#signin_title').text(signin_title)
        $('button#signin').text(signin_btn_text).button( "refresh" );

        if (register_user){
            $('#retypePassword').parent().show();
        } else {
            $('#retypePassword').parent().hide();
        };
        

        $(this).trigger("create");        
    });

    $('button#signin').click(function(e){        
        var auth={}; auth.username = $('input#email').val(),
        auth.password = $('input#password').val();
        $('#signin_msg').text('');       
          if ($('#retypePassword').attr('type')==='password'){
              auth.retype=$('input#retypePassword').val();
              if (auth.password!=auth.retype){
                  $('#signin_msg').text('Passwords do not match')                  
              } else {
                newUser(auth);
              }
          } else {
              search_data.login(auth);
          }          
    });    

    $('a#btnStartRegister').on('click',function(){
        $('#signin_page').data('register-user',true);
    });
        
    $('button#signin_quit').on('click',function(){
        $('#signin_page').data('register-user',false);
        $('#signin_msg').text(''); 
        $('#retypePassword').attr('type','hidden').parent().hide();
        $('#signin_page').trigger("create");        
        $.mobile.changePage('#mapPage');
    });    
    

    geoloqi.onAuthorize = function(response, error){
      console.log("You are a user!");
      
      $.mobile.changePage('#mapPage');
    };
    
    geoloqi.onLoginError = function(error){
      console.log("You are not a user!");
      $('#linkDialog').click();
    }

//watch position init 
    var userPositionChange = function(pos) {
        var crd = pos.coords;
        
        
        currentLatlng = new google.maps.LatLng(crd.latitude, crd.longitude);          
        ttown.user.setPosition(currentLatlng);
        ttown.user_accuracy=crd.accuracy;        
    };
     var errorPositionChange = function (err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    
    posOptions = {enableHighAccuracy: true}; 
    distWatchID = navigator.geolocation.watchPosition(userPositionChange, errorPositionChange, posOptions);       
    
 

// GO!
    $('#mapPage').trigger('pageshow');
});

