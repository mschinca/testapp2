var agencies = [
{ "address1": "via Foro Boario, 11", "address2": "44122 Ferrara", "image_path": "001_agency.png", "lat": 44.824828, "lng": 11.60701, "services": "Acquisto Investimenti Lottomatica RAEE", "tel": "0532 977111" }
];
var showFields = function(selected){
        $('#agencyPosition').val(agencies[selected].address1 + ', ' + agencies[selected].address2);
        $('#agencyNumber').val(selected);
}
var map;
// Create a directions object and register a map and DIV to hold the 
// resulting computed directions

$(document).ready(function() {

	//------- Google Maps ---------//

	// Creating a LatLng object containing the coordinate for the center of the map
	var latlng = new google.maps.LatLng(41.918629,12.612305);

	// Creating an object literal containing the properties we want to pass to the map  
	var options = {  
		zoom: 6, // This number can be set to define the initial zoom level of the map
	center: latlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP // This value can be set to define the map type ROADMAP/SATELLITE/HYBRID/TERRAIN
	};  
	// Calling the constructor, thereby initializing the map  
	map = new google.maps.Map(document.getElementById('map_div'), options);  

	// Define Marker properties
	var image = new google.maps.MarkerImage('images/marker.png',
		// This marker is 129 pixels wide by 42 pixels tall.
		new google.maps.Size(129, 42),
		// The origin for this image is 0,0.
		new google.maps.Point(0,0),
		// The anchor for this image is the base of the flagpole at 18,42.
		new google.maps.Point(18, 42)
		);

	for (var i=0; i< agencies.length; i++){
		// Add Marker
		var marker1 = new google.maps.Marker({
			position: new google.maps.LatLng(agencies[i].lat,agencies[i].lng),
                        index: i,
		    map: map
		});	

		// Add listener for a click on the pin
		google.maps.event.addListener(marker1, 'click', function() {  
			infowindow1.open(map, marker1);  
			showFields(marker1.index);
		});

		// Add information window
		var infowindow1 = new google.maps.InfoWindow({  
			content:  createInfo('S18K - STUDIO18KARATI', '<br /><img src="images/' +
					  agencies[i].image_path +
					  '"></img><br />'
					  + agencies[i].address1
					  + '<br />'
					  + agencies[i].address2
					  + '<br />Servizi: '
					  + agencies[i].services
					  + '<br />Tel: '
					  + agencies[i].tel + '<br />')
		}); 
	}
	initializeDirections();
	initializeAutocomplete();

	// Create information window
	function createInfo(title, content) {
		return '<div class="infowindow"><strong>'+ title +'</strong><br />'+content+'</div>';
	} 

});

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function initializeDirections() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("directionsPanel"));
}

function calcRoute() {
  var end = "Via Foro Boario 11, Ferrara";
  var start = "Via Marozzo 50, Lagosanto Ferrara";
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function initializeAutocomplete(){
	var input = document.getElementById('currentPosition');
	var options = {
	  componentRestrictions: {country: 'it'}
	};

	autocomplete = new google.maps.places.Autocomplete(input, options);
}
