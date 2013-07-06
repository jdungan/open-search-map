jQuery(document).ready(function() {
    
//init the map
    var currentLatlng  = currentLatlng || new google.maps.LatLng(36.1539,-95.9925),
        ttown= ttown || new search_map(document.getElementById("map_content"));

// init search data
    var search_data = search_data || new search_db();

//init socket
    var socket = io.connect('http://206.214.164.229');
    socket.on('message', function (data) {
      console.log(data);
      $.event.trigger(data.message.eventType,data.message.payload);      
    });  

//socket events
    $(document).on("newSearch", function(e,response){
        var search_loc = new google.maps.LatLng(response.latitude,response.longitude);
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
                layer_id=$(this).data('layer_id')
                displayLayer(layer_id);
            });
        });

    function displayLayer(layer_id){
        search_data.places.each({layer_id:layer_id},function(response){
            var search_loc = new google.maps.LatLng(response.latitude,response.longitude);
            ttown.addSearch(search_loc,response.place_id,response.extra);                
        })
        .done(function(){
            $('a#viewSearches').trigger('click');
        });   
    }

//panel menu choices
    $("#addSearch").on('click',function(){
        $( "#menu_panel" ).panel( "close" );
        ttown.setOptions({ draggableCursor : "url(http://s3.amazonaws.com/besport.com_images/status-pin.png) 64 64, auto" })        
        google.maps.event.addListenerOnce(ttown, "click",function(e){
            search_data.place.add({
                  latitude: e.latLng.lat(),
                  longitude: e.latLng.lng(),
                  layer_id: '8neY',
                  radius: 100,
                  extra: {start_time:Date()}
                })
                .done(function(response){
                    ttown.setOptions({ draggableCursor : "" });
                    search_loc=new google.maps.LatLng(response.latitude,response.longitude);
                    ttown.addSearch(search_loc,response.place_id,response.extra);                    
                    socket.emit('message', {eventType: 'newSearch', payload: response});
                });
        });
    });
    
    $('a#viewSearches').click(function(){
        $( "#menu_panel" ).panel( "close" );
        ttown.fitBounds(ttown.searchBounds());
    });    

    $('a#viewUser').click(function(){
         $( "#menu_panel" ).panel( "close" );
         ttown.panTo(ttown.user.position);
         ttown.user.setAnimation(google.maps.Animation.DROP);
    });    

    $('a#clearLayers').click(function(){
        $( "#menu_panel" ).panel( "close" );
        ttown= new search_map(document.getElementById("map_content"));
        ttown.searches={};
    });    



//authentication

    $('button#signin').click(function(){
      var auth={}; auth.username = $('input#email').val(),
          auth.password = $('input#password').val();
          if ($('#retypePassword').attr('type')!='hidden'){
              auth.retype=$('input#retypePassword').val();
              if (auth.password!=auth.retype){
                  $('#signin_msg').text('Passwords do not match')                  
              } else {
                  search_data.login(auth);
              }
              
          } else {
              search_data.login(auth);
          }          
    });    

    $('a#btnStartRegister').click(function(){
        $('#retypePassword').attr('type','password');
        $('#signin_page').trigger("create");
        $.mobile.changePage('#signin_page');
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
        // ttown.panTo(ttown.user.position);
        
    };
     var errorPositionChange = function (err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    
    posOptions = {enableHighAccuracy: true}; 
    distWatchID = navigator.geolocation.watchPosition(userPositionChange, errorPositionChange, posOptions);       

// GO!
    $('#mapPage').trigger('pageshow');
    
});

