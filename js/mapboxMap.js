var mapboxMap = function(element){
   var defaultPosition = [36.1539, -95.9925];
   var defaultZoom = 18;
   var m = new L.mapbox.map(element, 'jdungan.map-lc7x2770').setView(defaultPosition, defaultZoom);
   
   m.add_Search = function(response){
      var mbIcon = L.icon({
	 iconUrl:(response.extra.end_time && './img/search_end.svg') || './img/search_start.svg',
	 iconSize:[32, 32],
	 iconAnchor:[32, 32]
      });    
      var mbMarker = L.marker([response.latitude, response.longitude], {icon:mbIcon}).addTo(this);
      return mbMarker;
   };
   
   $('#' + element.attributes['id'].value).on('start_add_search', function(){
      $(this).css('cursor', 'url("http://s3.amazonaws.com/besport.com_images/status-pin.png")');
      m.addOneTimeEventListener('click', function(e){
         $(this).css('cursor', 'pointer');
	 var search_location = {
	    latitude:e.latlng.lat,
	    longitude:e.latlng.lng
	 };
         $('#map_holder').trigger('stop_add_search', [search_location]); 
      }); 
   });
   
   $(element).on('display_search', function(e, response){
      if($('#' + element.attributes['id'].value).css('cursor') != 'pointer')
         $('#' + element.attributes['id'].value).css('cursor', 'pointer');
      m.add_Search(response);
   });

   $(element).on('show_user', function(){
      var pos = [ttown.user.position.jb, ttown.user.position.kb];
      m.panTo(pos);
      m.setZoom(18);
      var marker = new L.Marker(pos, new L.Icon.Default).addTo(mbtown);
   });
  
   $(element).on('clear_map', function(){
       
   });      
   
   return m;

}; 
