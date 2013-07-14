//  map object 
var googleMap= function (element) {    
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
           
    search_list = {},
    
    searchBounds = function (){        
        // Based on Google Maps API v3 
        // Purpose: given an array of Latlng's return a LatlngBounds
        // Why: This is helpful when using fitBounds, panTo
        var newBounds = new google.maps.LatLngBounds;

        for (var m in search_list){
            newBounds.extend(search_list[m].position);
        };
        return newBounds;
    },    

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

    addSearch = function (response) {
        
        var position= new google.maps.LatLng(response.latitude,response.longitude),
        key=response.place_id;
        response.extra = response.extra || {};
        search_icon= (response.extra.end_time && "./img/search_end.svg") || "./img/search_start.svg";
        
        if (!search_list[key]) {
            var marker = new google.maps.Marker({
                  draggable:true,
                  map: this_map,
                  position: position,
                  visible:true,
                  icon:{
                      anchor: new google.maps.Point(32, 32),
                      scaledSize: new google.maps.Size(64,64,'px','px'),
                      url: search_icon+'# '+key
                  }
              });
            marker.search_key=key;
            marker.search_window= set_search_click(marker, key, response.extra);
            search_list[key]=marker;
        }
    };
        
    if (element !== map_element){
        map_element = element;
        google.maps.visualRefresh=true;
        this.map = new google.maps.Map(element, searchMapOptions); 
        
        
        $(element).on('start_add_search', function(){
            console.log('ggl start_add_search')
            this_map.setOptions({ draggableCursor : "url(http://s3.amazonaws.com/besport.com_images/status-pin.png) 64 64, auto" })
            google.maps.event.addListenerOnce(this_map,'click', function(e){
            
               this_map.setOptions({ draggableCursor : "" })
               search_location={
                   latitude:e.latLng.lat(),
                   longitude:e.latLng.lng()
               };
               $('#map_holder').trigger("stop_add_search",[search_location])
            });
        });


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

    }
    
// listenters    
    $(element).on('show_user', function(){
        this_map.panTo(ttown.user.position);
        this_map.setZoom(18);
        this_map.user.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function(){ this_map.user.setAnimation(null); }, 3000);
    });
    
    $(element).on('clear_map', function(){
        for (var m in search_list){
            search_list[m].setMap(null);
        };        
        search_list={};
    });

    $(element).on('display_search', function(e,response){
        this_map.addSearch(response);                
    });
    
    $(element).on('display_all', function(e,response){
        this_map.fitBounds(this_map.searchBounds());                
    });

    $(element).on('end_search', function(e,response){
        marker=this_map.searches[response.place_id];
        marker.icon.url="./img/search_end.svg";
        marker.setMap(this_map)// force icon to re-render;
        marker.search_window.setSearchWindowContent(response.extra)        
    });
    
    $(element).on('move_search', function(e,response){
        marker=this_map.searches[response.place_id];
        var search_loc = new google.maps.LatLng(response.latitude,response.longitude);
        marker.setPosition(search_loc);                      
    });
    
//end map object listeners
    
    google.maps.event.addListener(this.map, 'zoom_changed',function () {
        // scaledSize: new google.maps.Size(64,64,'px','px')
        var setzoom = function(z){
            setzoom.answers= setzoom.answers || {};
            if (!setzoom.answers[z]){
                var ns=Math.floor(64*(z/21));
                var na=Math.floor(32*(z/21));
                setzoom.answers[z] ={
                    scale  : new google.maps.Size(ns,ns,'px','px'),
                    anchor : new google.maps.Point(na,na)
                };
            }   
            return setzoom.answers[z]
        };

        for (var m in search_list){
            (function (zoom){
                search_list[m].icon.scaledSize = setzoom(zoom).scale;
                search_list[m].icon.size = setzoom(zoom).scale;
                search_list[m].icon.anchor = setzoom(zoom).anchor;
            })(this_map.zoom);
        };
    });
    
    this.map.user = user_marker;
    this.map.user.accuracy=user_accuracy_circle.radius;
    this.map.searches=search_list;
    this.map.searchBounds=searchBounds;
    this.map.addSearch = addSearch;      
    this_map=this.map;
    return this.map;
};
