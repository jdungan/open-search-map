open-search-map v 0.0.3
===============

This is an HTML mobile app for adding and viewing search and rescue activities.

File descriptions:
These descriptions are suggestions for managing the code.  We are not above fudging the distinctions in favor of good things.):

index.html  --  Contains markup for jqm pages
ready.js  -- loads the base maps to the global search_app


Description of modules:

search.app  -- creates search_app in the global spaace.  Adds methods for changing the base map
search.data   -- adds .data to the search app.  This includes all calls to the geoloqi database 
search.users  -- user login
search.markers -- adds .searches to the search app for manipulating a Leaflet feature collection of search markers
search.layer.menu -- adds methods to search_app for retrieving saved searches


Also loaded by not adding to the search_app object:
search.main.menu -- events for the left panel of the app
socket.messages -- loads socket.io listener and events for incoming messages


Libraries:
socket.io.min.js for sharing map changes

