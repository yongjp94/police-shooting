var map;
// Function to draw your map
var drawMap = function() {

    map = L.map('map').setView([38.4794, -99.2285], 4);

    var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    
    layer.addTo(map);

    // Execute your function to get data
    getData();
}

// Function for getting data
var getData = function() {
      // Execute an AJAX request to get the data in data/response.js
    $.getJSON( "../data/response.json", function(dat) {
        console.log("Load was performed.");  
        data = dat;
    }).then(customBuild);
  // When your request is successful, call your customBuild function
}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data) {
	// Be sure to add each layer to the map
    console.log("parsing");
    var counter = [0,0,0,0,0];

    var white = new L.LayerGroup([]),
        black = new L.LayerGroup([]),
        asian = new L.LayerGroup([]),
        hispanic = new L.LayerGroup([]),
        unknown = new L.LayerGroup([]);
    
    
    data.map(function(data) {
        var latitude = data.lat,
            longitude = data.lng,
            
            date = data['Date Searched'],
            armed = data['Armed or Unarmed?'],
            race = data['Race'],
            age = data["Victim's Age"],
            hol = data['Hispanic or Latino Origin'],
            name = data["Victim Name"],
            age = data["Victim's Age"],
            gender = data["Victim's Gender"],
            hitOrKilled = data["Hit or Killed?"],
            armed = data["Armed or Unarmed?"],
            link = data["Source Link"];
                               
            
        
        
        
        sortRace(latitude, longitude, race, hol, white, black, asian, hispanic, unknown, counter, name, age, gender, hitOrKilled, armed, link);
    });
    
    var layers = {
        "White" : white,
        "Black" : black,
        "Asian" : asian,
        "Hispanic" : hispanic,
        "Race Unknown" : unknown
    }
        
    console.log("WHITE: " + counter[0]);
    console.log("BLACK: " + counter[1]);
    console.log("ASIAN: " + counter[2]);
    console.log("HISPANIC: " + counter[3]);
    console.log("UNKNOWN: " + counter[4]);
    
    $('#white-num').html(counter[0]);
    $('#black-num').html(counter[1]);
    $('#azn-num').html(counter[2]);
    $('#hisp-num').html(counter[3]);
    $('#unknown-num').html(counter[4]);
    

	// Once layers are on the map, add a leaflet controller that shows/hides layers  
    // white.addTo(map);
    L.control.layers(null, layers).addTo(map);
}

var sortRace = function(latitude, longitude, race, hol, white, black, asian, hispanic, unknown, counter, name, age, gender, hitOrKilled, armed, link) {
    
    var layerGroup;
    var color;
    if (race == "White") {
        color = '#a9a9a9';
        layerGroup = white;
        counter[0]++;
    } else if (race == "Black or African American") {
        color = 'black';
        layerGroup = black;
        counter[1]++;
    } else if (race == "Asian") {
        color = 'yellow';
        layerGroup = asian;
        counter[2]++;
    } else if (race == "Unknown") {
        if (hol == "Hispanic or Latino origin") {
            color = 'brown';
            layerGroup = hispanic;
            counter[3]++;
        } else {
            color = '#ffc0cb';
            layerGroup = unknown;
            counter[4]++;
        }
    } else {
        color = '#ffc0cb';
        layerGroup = unknown;
        counter[4]++;
    }
    
    var circle = new L.circleMarker([latitude, longitude], {color: color, opacity:0.8, radius:6});
    
    var popup = L.popup().setContent(
                    "<p>Name: </p>" + name +
                    "<p>Age: </p>" + age +
                    "<p>Gender: </p>" + gender +
                    "<p>Armed or Unarmed?: </p>" + armed + 
                    "<p>Hit Or Killed?: </p>" + hitOrKilled +
                    "<p><a href='" + link + "'>Source</a></p>");
    
    circle.bindPopup(popup);
    circle.addTo(layerGroup);
}