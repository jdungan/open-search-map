
// map functions



    // var placeLocationTitle = function (map,title,loc_postion){
    // 
    //     var marker1 = new MarkerWithLabel({
    //       position: loc_postion,
    //       map: map,
    //       labelContent: title,
    //       labelAnchor: new google.maps.Point(22, 0),
    //       labelClass: "loc_labels", // the CSS class for the label
    //       labelStyle: {opacity: 1},
    //       visible: true,
    //       icon:{}
    //     });
    // };
    // 
    // var placeLocationCircle = function (map,marker){
    //     var location_circle = new google.maps.Circle({
    //       map: map,
    //       radius: 2,  
    //       fillColor: 'silver',
    //       fillOpacity: 1,
    //       strokeOpacity:.1
    //     });
    //     location_circle.bindTo('center', marker, 'position');
    // };

//  map object 
var search_map= function (element) {    
    // 'tulsa 36.1539,-95.9925'
        var this_map,
        search_overlay,
        map_element = null,
        tulsaLatlng =  tulsaLatlng ||  new google.maps.LatLng(36.1539,-95.9925),
        dispatchMapOptions = {
            visualRefresh:true,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center:tulsaLatlng,
            panControl: false,
            scaleControl: false,
            overviewMapControl: false,

            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER,
            },

            mapTypeControl: true,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM,
            },

            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_CENTER,
            },
        };
        
       
    var geo=google.maps.geometry.spherical;        
        

    var goodPositionChange = function(pos) {
        var crd = pos.coords;

        currentLatlng = new google.maps.LatLng(crd.latitude, crd.longitude);          

        console.log(pos);
        //update map

        user_marker.setPosition(currentLatlng);
        user_accuracy_circle.radius=crd.accuracy;

        var ne=geo.computeOffset(currentLatlng, crd.accuracy*1.5, 45),
          sw=geo.computeOffset(currentLatlng, crd.accuracy*1.5, 225);
        var currentView= new google.maps.LatLngBounds(sw,ne);           

        this_map.panToBounds(currentView);
        this_map.setCenter(currentLatlng);

    };

     var badPositionChange = function (err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    var createMarker = function (position){
              var marker = new google.maps.Marker({
                    draggable:true,
                    map: this_map,
                    position: position,
                    visible:true,
                    icon:{
                        anchor: new google.maps.Point(32, 32),
                        scaledSize: new google.maps.Size(50,50,'px','px'),
                        url:"./img/search_end.svg"
                    }
                });
                
                
           // this_map.panTo(marker.getPosition());               
    };



    if (element !== map_element){
        map_element = element;
        google.maps.visualRefresh=true;
        this.map = new google.maps.Map(element, dispatchMapOptions); 

       var user_marker = user_marker || new google.maps.Marker({
            map: this.map,
            visible:false,
        });

        // user circle
         var user_circle = new google.maps.Circle({
           map: this.map,
           radius: 2,  
           fillColor: 'blue',
           fillOpacity: 1,
           strokeColor:"white",
           strokeOpacity:1
         });
         user_circle.bindTo('center', user_marker, 'position');

        // Add circle overlay and bind to marker
         var user_accuracy_circle = new google.maps.Circle({
           map: this.map,
           clickable:false,
           radius: 10,  
           fillColor: 'aqua',
           fillOpacity: 0.3,
           strokeOpacity:0
         });
         user_accuracy_circle.bindTo('center', user_marker, 'position');        
    }
    
    this.map.createMarker = createMarker;      
    this.map.goodPositionChange = goodPositionChange;
    this.map.badPositionChange = badPositionChange;
    this_map=this.map;
    return this.map;
};
