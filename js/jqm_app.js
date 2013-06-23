jQuery(document).ready(function() {

    //init the map
    var currentLatlng  = currentLatlng || new google.maps.LatLng(36.1539,-95.9925),
        ttown= ttown || new search_map(document.getElementById("map_content"));

    // init search data
    var search_data = search_data || new search_db();
    search_data.init(ttown);

    // add saved searches
    search_data.get("place/list", {
      layer_id:"909L"
    }, function(response, error){
        console.log(response, error);
        for (var i = 0; i < response.places.length; i++){
            p=response.places[i];
            var search_loc = new google.maps.LatLng(p.latitude,p.longitude);

            ttown.addSearch(search_loc,p.place_id,p.extra);
            ttown.panTo(search_loc);
        };
    });

    //init socket
    var socket = io.connect('http://206.214.164.229');
    socket.on('message', function (data) {
      console.log(data);
    });            
    
    // click functions
    $('button#signin').click(function(){
      var auth={}; auth.username = $('input#email').val(),
          auth.password = $('input#password').val();
          search_data.login(auth);
    });    

    
    $(document).on("endSearch", function(e,marker){
        marker.setIcon("./img/search_end.svg");
        search_data.post('place/update/'+marker.search_key,{
            extra: {end_time:Date()}
        });        
    });


    $("#addSearch").on('click',function(){
        
        $( "#menu_panel" ).panel( "close" );

        ttown.setOptions({ draggableCursor : "url(http://s3.amazonaws.com/besport.com_images/status-pin.png) 64 64, auto" })
        google.maps.event.addListenerOnce(ttown, "click",function(e){
            ttown.setOptions({ draggableCursor : "" })
            search_data.post("place/create", {
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng(),
              layer_id:"909L",
              name:e.latLng.lat()+e.latLng.lng(),
              radius: 100,
              extra: {start_time:Date()}
            }, function(response, error){
                console.log(response, error)
                ttown.addSearch(e.latLng,response.place_id,response.extra); 
                // socket.emit('message', 'howdy');
            });
        });
    });


    $("#mapPage").on("pageshow",function(){
        google.maps.event.trigger(ttown, 'resize');
    });
 
 
  
  $('#mapPage').trigger('pageshow');
    
});

