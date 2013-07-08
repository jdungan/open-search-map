var googleMap = function(){

   var obj = {};

   obj.map = function(options){
      var gOpts = {
         visualReference:true,
         zoom:options.zoomLevel,
         mapTypeId:google.maps.MapTypeId.ROADMAP,
         center:new google.maps.LatLng(options.center[0], options.center[1]),
         scaleControl:false,
         overviewMapControl:false,
         streetViewControl:true,
         streetViewControlOptions:{
            position:google.maps.ControlPosition.LEFT_CENTER,
         },
         zoomControl:true,
         zoomControlOptions:{
            style:google.maps.ZoomControlStyle.SMALL,
            position:google.maps.ControlPosition.RIGHT_CENTER
         }
      };
   
      google.maps.visualRefresh = true;
      var m = new google.maps.Map(gDiv[0], gOpts);
      
      m.addSearch = function(search_icon, position, key, info_obj){

         var marker = new google.maps.Marker({
            draggable:true,
            map:openMap.gMap,
            position:new google.maps.LatLng(position),
            icon:{
               anchor:new google.maps.Point(32,32),
               scaledSize:new google.maps.Size(64,64,'px','px'),
               url:search_icon
            }
         });  

         marker.search_key = key;
         return marker;
      };
      
       
      return m;
   };

   
   return obj;
};


googleMap.swapCursor = function(url){


};
