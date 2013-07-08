var openMap = function(){
   /*OPTIONS*********************************
      latLng, zoomLevel, mapElement
   /*****************************************/
   this.gMap = {};
   this.mbMap = {}; 

};

var gDiv = $('<div>').css({'position':'relative',  'float':'left', 'height':'100%','width':'50%'});
var mbDiv = $('<div>').css({'position':'relative', 'float':'right', 'height':'100%', 'width':'50%'});

openMap.map = function(options){

   $(options.mapElement).append(gDiv);
   $(options.mapElement).append(mbDiv);
   options.mapElement = mbDiv[0]; 
   openMap.mbMap = new mapboxMap().map(options);
   options.mapElement = gDiv[0];
   openMap.gMap = new googleMap().map(options); 
   //mbDiv.toggle();
   //openMap.mbMap.toggled = true;
};

openMap.mapOptions = {
   zoomLevel:18,
   center:[35,-96]
};

openMap.toggleMap = function(){
   console.log(this.mapOptions.center);
   console.log(this.mapOptions.zoomLevel);
   //openMap.mbMap.setView(this.mapOptions.center, this.mapOptions.zoomLevel); 
   this.mbMap.setZoom(this.mapOptions.zoomLevel);
   this.mbMap.panTo(this.mapOptions.center);
   gDiv.toggle();
   mbDiv.toggle();
};

var search_list = {};
openMap.addSearch = function(position, key, info_obj){
   search_icon = (info_obj.end_time && './img/search_end.svg') || './img/search_start.svg';
   openMap.mbMap.addSearch(search_icon, position, key, info_obj);   
   openMap.gMap.addSearch(search_icon, position, key, info_obj);
   
};

openMap.setCursor = function(url){
   openMap.gMap.setOptions({draggableCursor:'url("' + url + '")'});
   mbDiv.css('cursor', 'url("' + url + '")');
};

openMap.addEventListenerOnce = function(eventType, callback){
   
   google.maps.event.addListenerOnce(openMap.gMap, 'click', function(e){
      callback(e);
   });
   
   openMap.mbMap.addOneTimeEventListener('click', function(e){
      console.log(e);
      var evObj = {};
      evObj.latLng = {};
      evObj.latLng.lat = function(){return e.latlng.lat;};
      evObj.latLng.lng = function(){return e.latlng.lng;};
      callback(evObj);
   });
};

openMap.addMapListeners = function(){

   var gCenterListener = google.maps.event.addListener(openMap.gMap, 'center_changed', mbMapMove);

   var mbMoveListener = openMap.mbMap.addEventListener('move', gMapMove);
  
   var gZoomListener = google.maps.event.addListener(openMap.gMap, 'zoom_changed', mbMapMove);


   function gMapMove(){
      google.maps.event.removeListener(gCenterListener);
      google.maps.event.removeListener(gZoomListener);

      var coords = new google.maps.LatLng(openMap.mbMap.getCenter().lat, openMap.mbMap.getCenter().lng);
      openMap.gMap.setOptions({zoom:openMap.mbMap.getZoom(), center:coords});
      gCenterListener = google.maps.event.addListener(openMap.gMap, 'center_changed', mbMapMove);
      gZoomListener = google.maps.event.addListener(openMap.gMap, 'zoom_changed', mbMapMove);
   }
      
   function mbMapMove(){
      var coords = [openMap.gMap.getCenter().jb, openMap.gMap.getCenter().kb];
      
      openMap.mbMap.removeEventListener('move', gMapMove);
      openMap.mapOptions.center = coords;
      openMap.mbMap.setView(coords, openMap.gMap.getZoom());
      openMap.mbMap.on('move', gMapMove);
   }

};
openMap.searches = search_list;
