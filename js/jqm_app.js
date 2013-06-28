jQuery(document).ready(function() {

//init the map
    var currentLatlng  = currentLatlng || new google.maps.LatLng(36.1539,-95.9925),
        ttown= ttown || new search_map(document.getElementById("map_content"));

// init search data
    var search_data = search_data || new search_db();
    search_data.stored_searches(ttown);

//init socket
    var socket = io.connect('http://206.214.164.229');
    socket.on('message', function (data) {
      console.log(data);
      $.event.trigger(data.message.eventType,data.message.payload);
      
    });            

//socket events
    $(document).on("newSearch", function(e,response){
        var search_loc = new google.maps.LatLng(response.latitude,response.longitude);
        search_data.searches[response.place_id]=ttown.addSearch(search_loc,response.place_id,response.extra);
    });
      
    $(document).on("endSearch", function(e,response){
        marker=search_data.searches[response.place_id];
        marker.setIcon("./img/search_end.svg");
        marker.search_window.setSearchWindowContent(response.extra)        
    });
    
    $(document).on("moveSearch", function(e,response){
        marker=search_data.searches[response.place_id];
        var search_loc = new google.maps.LatLng(response.latitude,response.longitude);
        marker.setPosition(search_loc);
    });
    


//client events

    $(document).on("endSearch_click", function(e,marker_key){
        search_data.post(
            'place/update/'+marker_key,
            {extra: {end_time:Date()}},
            function(response, error){
                if(!error){
                    marker=search_data.searches[marker_key];
                    marker.setIcon("./img/search_end.svg");
                    marker.search_window.setSearchWindowContent(response.extra)
                    socket.emit('message',{eventType: 'endSearch', payload: response});                        
                }
        });        
    });        



    $(document).on("search_position_changed", function(e,marker_key){
        marker=search_data.searches[marker_key];
        search_data.post(
            'place/update/'+marker_key,
            {latitude:  marker.position.lat(),
             longitude: marker.position.lng()},
            function(response, error){
                if(!error){
                    socket.emit('message',{eventType: 'moveSearch', payload: response});                        
                }
        });        
    });

//panel menu choices
    $("#addSearch").on('click',function(){
        $( "#menu_panel" ).panel( "close" );

        ttown.setOptions({ draggableCursor : "url(http://s3.amazonaws.com/besport.com_images/status-pin.png) 64 64, auto" })
        
        google.maps.event.addListenerOnce(ttown, "click",function(e){
            ttown.setOptions({ draggableCursor : "" })


            search_data.post("place/create", {
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng(),
              layer_id:search_data.layer_id,
              name:e.latLng.lat()+e.latLng.lng(),
              radius: 100,
              extra: {start_time:Date()}
            }, function(response, error){
                console.log(response, error)
                if(!error){
                    search_data.searches[response.place_id]=ttown.addSearch(e.latLng,response.place_id,response.extra);
                    socket.emit('message', {eventType: 'newSearch', payload: response});
                }
            });
        });
    });
    
    $('a#viewSearches').click(function(){
        $( "#menu_panel" ).panel( "close" );
        ttown.fitBounds(search_data.searchBounds());
    });    

    $('a#viewUser').click(function(){
         $( "#menu_panel" ).panel( "close" );
         ttown.setZoom(22);
         ttown.user.setAnimation(google.maps.Animation.DROP);
    });    


//authentication

    $('button#signin').click(function(){
      var auth={}; auth.username = $('input#email').val(),
          auth.password = $('input#password').val();
          search_data.login(auth);
    });    

    search_data.onAuthorize = function(response, error){
      console.log("You are a user!");
      $.mobile.changePage('#mapPage');
    };
    
    search_data.onLoginError = function(error){
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

    $("#mapPage").on("pageshow",function(){
        google.maps.event.trigger(ttown, 'resize');

    });
 
    $('#mapPage').trigger('pageshow');
    
});

