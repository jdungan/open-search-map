open-search-map
===============

This is an HTML mobile app for adding and viewing search and rescue activities.


File descriptions (
These descriptions are suggestions for managing the code.  We are not above fudging the distinctions in favor of good things.):

index.html  --  Contains markup for jqm pages

search_db.js --  Intermediate object for handling search data, currently we use geoloqi

ggl_map.js -- map object for interacting with google maps api

mapboxMap.js -- map object for mapbox interactions

jqm_app.js -- Any jqm interactions.  This 


Libraries:
socket.io.min.ja for sharing map changes


NOTE:  GeoJSON.js, markerwithclusterer_compiled.js, and markerwithlabel.js are unused so far but hanging around just in case.
_


Map Object 

Contruct  e.g  coolmap = new coolMap(document.getElementById('map_content'))
    
Listen for these events:
    
        start_add_search: adds onetime listenter for next click on map, 
        triggers a 'stop_add_search' event and includes an object with
        latitude and longitude e.g.  {latitude:00.00,longitude:00.00}
        
        show_user: center map on user location
        
        clear_map: remove all markers from the map, clears the search_list
        
        display_search: receive a valid geoloqi place response in the trigger.  
        Place it on the map. Add the marker to the search_list
        
        display_all: fit all searches on map in view
        
        
        
        
        
            