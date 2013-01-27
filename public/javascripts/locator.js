var agencies = [
{ "address1": "via Foro Boario, 11", "address2": "44122 Ferrara", "image_path": "001_agency.png", "lat": 44.82488, "lng": 11.606901, "services": "Acquisto, Investimenti, Lottomatica, RAEE", "tel": "0532 977111" },
{ "address1": "Via Della Cittadella, 49", "address2": "44121 Ferrara", "image_path": "002_agency.png", "lat": 44.843248, "lng": 11.613268, "services": "Acquisto, Investimenti, Lottomatica, RAEE", "tel": "0532 249740" }
];
var showFields = function(selected){
        $('#agencyPosition').val(agencies[selected].address1 + ', ' + agencies[selected].address2);
        $('#agencyNumber').val(selected);
}
var map;
var markers = [];
var infowindows = [];
var markerImage;
var initialPosition = new google.maps.LatLng(41.918629,12.612305);
var initialZoom = 6;
var autocomplete;
var suggestedPlace;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var zoomInLevel = 13;
var currentPositionMarker;
// Create a directions object and register a map and DIV to hold the 
// resulting computed directions

$(document).ready(function() {

	//------- Google Maps ---------//

	// Creating a LatLng object containing the coordinate for the center of the map

	// Creating an object literal containing the properties we want to pass to the map  
	var options = {  
		zoom: initialZoom, // This number can be set to define the initial zoom level of the map
	center: initialPosition,
	mapTypeId: google.maps.MapTypeId.ROADMAP // This value can be set to define the map type ROADMAP/SATELLITE/HYBRID/TERRAIN
	};  
	// Calling the constructor, thereby initializing the map  
	map = new google.maps.Map(document.getElementById('map_div'), options);  

	// Define Marker properties
	markerImage = new google.maps.MarkerImage('images/marker.png',
		// This marker is 129 pixels wide by 42 pixels tall.
		new google.maps.Size(129, 42),
		// The origin for this image is 0,0.
		new google.maps.Point(0,0),
		// The anchor for this image is the base of the flagpole at 18,42.
		new google.maps.Point(18, 42)
		);

	for (var i=0; i< agencies.length; i++){
		// Add Marker
		var marker = createMarker(agencies[i], map, i);
		markers.push(marker);

		// Add information window
		var infowindow = new google.maps.InfoWindow({  
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

		infowindows.push(infowindow);


	}
	initializeDirections();
	initializeAutocomplete();
	// Zoom and center map if user selects a suggested place
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		if ($('#agencyPosition').val() == ""){
			suggestedPlace = autocomplete.getPlace();
			map.setCenter(autocomplete.getPlace().geometry.location);
			map.setZoom(zoomInLevel);
		}
	});
	initializeCalculate();

	// Create information window
	function createInfo(title, content) {
		return '<div class="infowindow"><strong>'+ title +'</strong><br />'+content+'</div>';
	} 

});


function initializeDirections() {
  directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("directionsPanel"));
}

function calcRoute() {
  resetCurrentLocationMarker();
  directionsDisplay.setMap(map);
  var selectedAgency = parseInt($('#agencyNumber').val());
  var end = markers[selectedAgency].position;
  var start = $('#currentPosition').val();
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      infowindows[selectedAgency].close();
      directionsDisplay.setDirections(response);
      currentPositionMarker = new google.maps.Marker({
	  position: response.routes[0].legs[0].start_location,
	  map: map,
	  title: "La tua posizione"
      });
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

function initializeCalculate(){
	$('#doRoute').bind('click', function(event){
		calcRoute();
	});
	$('#resetLocator').bind('click', function(event){
		resetLocator();
	});
        $('.locationField').bind('keyup change', function(event){
		$('#directionsPanel').empty();
		toggleDoRoute();
	});
}

function resetLocator(){
	map.setCenter(initialPosition);
        map.setZoom(initialZoom);
	$('#directionsPanel').empty();
	$('.locationField').val('');
        var selectedAgencyIndex = $('#agencyNumber').val();
	if (selectedAgencyIndex != ""){
		var selectedAgency = parseInt(selectedAgencyIndex);
		infowindows[selectedAgency].close();
		directionsDisplay.setMap(null);
		resetCurrentLocationMarker();
	}
	$('#doRoute').attr('disabled', 'disabled');
}

function resetCurrentLocationMarker(){
		if (currentPositionMarker != undefined)
			currentPositionMarker.setMap(null);
}
function toggleDoRoute(){
	if ($('#currentPosition').val() == "" || $('#agencyPosition').val() == "")
		$('#doRoute').attr('disabled', 'disabled');
	else $('#doRoute').attr('disabled', false);
}
function createMarker(agency, map, agencyIndex){
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(agency.lat,agency.lng),
		index: agencyIndex,
	    map: map
	});	
		// Add listener for a click on the pin
		google.maps.event.addListener(marker, 'click', function() {  
			infowindows[marker.index].open(map, marker);  
			map.setCenter(marker.position);
			map.setZoom(zoomInLevel);
			showFields(marker.index);
		        toggleDoRoute();
		});
	return marker;
}
