jQuery(document).ready(function() {

    //init the map
    var currentLatlng  = currentLatlng || new google.maps.LatLng(36.1539,-95.9925),
        ttown= ttown || new search_map(document.getElementById("map_content"));

    // init geoloqi
    var geoapp = geoapp || new geoloqi_app();
    geoapp.init(ttown);


    $('button#signin').click(function(){
      var auth={}; auth.username = $('input#email').val(),
          auth.password = $('input#password').val();
          geoloqi.login(auth);
    });


    $("#mapPage").on("pageshow",function(){
        google.maps.event.trigger(ttown, 'resize');
        // ttown.setCenter(currentLatlng);        
        geoloqi.get("place/list", {
          layer_id:"8neY"
        }, function(response, error){
            console.log(response, error);
            for (var i = 0; i < response.places.length; i++){
                p=response.places[i];
                var search_loc = new google.maps.LatLng(p.latitude,p.longitude);
                ttown.createMarker(search_loc);
                
            };
            
            var group = new geoloqi.Socket('layer', '8neY');

            group.events.location = function(location) {
                debugger;
              console.log(location);
            }

            group.events.disconnect = function() {
              console.log('group socket disconnected');
            }

            group.start();
            
        });
 
    });   
 
    $("#addSearch").on('click',function(){
        
        $( "#menu_panel" ).panel( "close" );

        ttown.setOptions({ draggableCursor : "url(http://s3.amazonaws.com/besport.com_images/status-pin.png) 64 64, auto" })
        
        google.maps.event.addListenerOnce(ttown, "click",function(e){
        
            ttown.setOptions({ draggableCursor : "" })
            
            geoloqi.post("place/create", {
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng(),
              layer_id:"8neY",
              name:e.latLng.lat()+e.latLng.lng(),
              radius: 100,
            }, function(response, error){
                console.log(response, error)
            });
            
            ttown.createMarker(e.latLng);            
        });
        
    });

    //     $.event.special.tap.tapholdThreshold=1500;
        // $( "#map_content" ).on( 'taphold', function ( event ) {
        //      get_started = confirm("Start a search here?");
        //      google.maps.event.trigger(ttown, 'dragend');
        //  });    
  
  
        $('#mapPage').trigger('pageshow');

});

