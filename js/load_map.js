(function loadGoogleMapScript() {
  var script = document.createElement("script");
  var mykey ='AIzaSyDxLr55pnqLsYMOTJLt7vpSKyBWgmqqdDQ';

  script.type = "text/javascript";
  script.src = "http://maps.google.com/maps/api/js?key='"+mykey+"'&libraries=geometry&sensor=true";
  document.body.appendChild(script);
})();

