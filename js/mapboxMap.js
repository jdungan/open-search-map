var mapboxMap = function(){

   var obj = {};

   obj.map = function(options){
      // console.log(options.center);
      // console.log(options.zoomLevel);
      var m = L.mapbox.map(options.mapElement, 'jdungan.map-lc7x2770').setView(options.center, options.zoomLevel);
      
      
      
      
      
      m.addSearch = function(search_icon, position){
         var mbIcon = L.icon({
            iconUrl:search_icon,
            iconSize:[32, 32],
            iconAnchor:[32, 32]
         });    
         // console.log(search_icon); 
         var mbMarker = L.marker(position, {icon:mbIcon}).addTo(this);
         return mbMarker;
      };

      m.getInfo = function(position, key, info_obj){

      };
            
      return m;
   };

   return obj;
}; 
