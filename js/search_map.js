//  map object 
var search_map= function (element) {    
    // 'tulsa 36.1539,-95.9925'
        var this_map,
        search_overlay,
        map_element = null,
        tulsaLatlng =  tulsaLatlng ||  new google.maps.LatLng(36.1539,-95.9925),
        searchMapOptions = {
            visualRefresh:true,
            zoom: 18,
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
        },
       
    geo=google.maps.geometry.spherical,    
    
    search_list = {},

    search_info = function (key,info_obj) {
        var response = [];
        i=0;
        for (var p in info_obj){
            response[i] = "<p>"+p+": "+info_obj[p]+"</p>";
            i+=1;
        };
        content_text=response.join("") 
        if (!info_obj.end_time){
            content_text +="</br><button id='"+key+"_button'>End Search</button"
        }
        return content_text;
    },

    set_search_click = function (marker, key, info_obj) {
        var infowindow = new google.maps.InfoWindow({
                content:  search_info(key, info_obj),
                position: marker.LatLng                     
         });

         google.maps.event.addListener(infowindow, 'domready',function(){
             var endButton = document.getElementById(marker.search_key+'_button');
             if(endButton){
                 google.maps.event.addDomListener(endButton,'click', function(event){
                     event.preventDefault();
                     $.event.trigger("endSearch_click",marker.search_key);
                     infowindow.close();
                 });
             }
         });

         google.maps.event.addListener(marker, 'click',function () {
             infowindow.open(this_map, marker);
             //TODO: close info window on click but re-open on next click
             // google.maps.event.addListenerOnce(marker,'click',function(){
             //     infowindow.close();                        
             // });
             }
         );

         google.maps.event.addListener(marker, 'dragend',function () {
              $.event.trigger("markerMove",marker.search_key);
             }
         );
         
         
         this_infowindow=infowindow;
         infowindow.setSearchWindowContent = function(extra){
             
              this_infowindow.setContent(search_info(key,extra))
         }
         
         return infowindow;  
    },

    addSearch = function (position,key,info_obj) {
        
        search_icon= (info_obj.end_time && "./img/search_end.svg") || "./img/search_start.svg";
        
        if (!search_list[key]) {
            var marker = new google.maps.Marker({
                  draggable:true,
                  map: this_map,
                  position: position,
                  visible:true,
                  icon:{
                      anchor: new google.maps.Point(32, 32),
                      scaledSize: new google.maps.Size(64,64,'px','px'),
                      url: search_icon
                      
                  }
              });
            marker.search_key=key;
            marker.search_window= set_search_click(marker, key, info_obj);
        }
        return marker;
    };
        
    if (element !== map_element){
        map_element = element;
        google.maps.visualRefresh=true;
        this.map = new google.maps.Map(element, searchMapOptions); 

       var user_marker = user_marker || new google.maps.Marker({
            map: this.map,
            visible:true,
            icon:{
                anchor: new google.maps.Point(32,32),
                scaledSize: new google.maps.Size(64,64,'px','px'),
                url: "./img/searcher.svg"                
            }
        });
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

        // user circle
         // var user_circle = new google.maps.Circle({
         //   map: this.map,
         //   radius: 2,  
         //   fillColor: 'blue',
         //   fillOpacity: 1,
         //   strokeColor:"white",
         //   strokeOpacity:1
         // });
         // user_circle.bindTo('center', user_marker, 'position');

    }
    
    this.map.searchBounds = function (){        
        // Based on Google Maps API v3 
        // Purpose: given an array of Latlng's return a LatlngBounds
        // Why: This is helpful when using fitBounds, panTo
        var newBounds = new google.maps.LatLngBounds,p=0;

        for (var m in search_list){
            newBounds.extend(search_list[m].position);
        };
        return newBounds;
    };
    
    google.maps.event.addListener(this.map, 'zoom_changed',function () {
        // scaledSize: new google.maps.Size(64,64,'px','px')
        var zoom_scale = function(z){
            if (z<=2 )
                {return 8;}
            if (z<=20 )
                {return 64*(z/21);}
            if (z>=21)
                {return 64;}  
        };
        
        
        for (var m in search_list){
            (function(zoom){
                ns=zoom_scale(zoom);
                na=ns/2;
                console.log ('zoom: '+zoom +' ns: '+ns)
                search_list[m].icon.scaledSize = new google.maps.Size(ns,ns,'px','px');
                search_list[m].icon.anchor=new google.maps.Point(na,na)
            })(this_map.zoom);
        };
    });
    
    this.map.user = user_marker;
    this.map.user.accuracy=user_accuracy_circle.radius;
    this.map.searches=search_list;
    this.map.addSearch = addSearch;      
    this_map=this.map;
    return this.map;
};
