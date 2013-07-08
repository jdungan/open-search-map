var mapboxMap = function(){

   var obj = {};

   obj.map = function(options){
      console.log(options.center);
      console.log(options.zoomLevel);
      var m = L.mapbox.map(options.mapElement, 'examples.map-y7l23tes').setView(options.center, options.zoomLevel);
      
      m.addSearch = function(search_icon, position, key, info_obj){
         var mbIcon = L.icon({
            iconUrl:search_icon,
            iconSize:[32, 32],
            iconAnchor:[32, 32]
         });    
         
         var mbMarker = L.marker(position, {icon:mbIcon}).addTo(this);
      };
      
      return m;
   };

   return obj;
}; 
