var earthquakeurl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var plates = "static/js/tectonic_plates.json";
// "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(mag) {
  return mag * 20000;
}

// Define color function to change circle color
function getColor(d) {
  return (d === "0-1") | (d < 1)
    ? "rgba(183,243,77)"
    : (d === "1-2") | ((d < 2) & (d >= 1))
    ? "rgba(225,243,77)"
    : (d === "2-3") | ((d < 3) & (d >= 2))
    ? "rgba(243,219,77)"
    : (d === "3-4") | ((d < 4) & (d >= 3))
    ? "rgba(243,186,77)"
    : (d === "4-5") | ((d < 5) & (d >= 4))
    ? "rgb(240,167,107)"
    : "rgb(240,107,107)";
}

// Create an empty list to hold earthquake circle data
var earthquakeCircles = [];
var platesLine = [];

d3.json(earthquakeurl, function (data) {
  // Once we get a response, send the earthquakeData object to the createFeatures function
  createFeatures(data.features);
});

d3.json(plates, function (data) {
  console.log(data);
});

function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      "<h1>" +
        earthquakeData[i].properties.place +
        "</h1>" +
        "<hr>" +
        "<h3>Magnitude: " +
        earthquakeData[i].properties.mag +
        "</h3>"
    );
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  for (var i = 0; i < earthquakeData.length; i++) {
    var location = [
      earthquakeData[i].geometry.coordinates[1],
      earthquakeData[i].geometry.coordinates[0],
    ];

    earthquakeCircles.push(
      L.circle(location, {
        stroke: false,
        fillOpacity: 1,
        color: "black",
        weight: 1,
        fillColor: getColor(earthquakeData[i].properties.mag),
        radius: markerSize(earthquakeData[i].properties.mag),
      }).bindPopup(
        "<h1>" +
          earthquakeData[i].properties.place +
          "</h1>" +
          "<hr>" +
          "<h3>Magnitude: " +
          earthquakeData[i].properties.mag +
          "</h3>"
      )
    );
  }

  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature,
  // });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakeCircles);
}

function createMap(earthquakeCircles) {
  // Create circles and add data to earthquakeCircles list

  // Create tiles
  var satellite = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.streets-satellite",
      accessToken: API_KEY,
    }
  );

  var streets = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY,
    }
  );

  var outdoors = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.outdoors",
      accessToken: API_KEY,
    }
  );

  var baseMaps = {
    Street: streets,
    Satellite: satellite,
    Outdoors: outdoors,
  };

  var earthquakeLayer = L.layerGroup(earthquakeCircles);

  // var platesLayer = L.layerGroup();

  // var plates = L.geoJSON(platesurl);
  // d3.json(platesurl, function (data) {
  //   console.log(data);

  //   // for (var i = 0; i < earthquakeData.length; i++) {
  //   //   var location = [
  //   //     earthquakeData[i].geometry.coordinates[i][1],
  //   //     earthquakeData[i].geometry.coordinates[i][0],
  //   //   ];
  //   //   console.log(location);
  //   //   platesLine.push(
  //   //     new L.Polyline(location, {
  //   //       color: "red",
  //   //       weight: 3,
  //   //       opacity: 0.5,
  //   //       smoothFactor: 1,
  //   //     })
  //   //   );
  //   // L.geoJSON(platesData, {
  //   //   style: {
  //   //     color: "orange",
  //   //   },
  //   // });
  //   // })
  // });

  // L.geoJSON(platesurl).addTo(platesLayer);

  var platesLayer = L.layerGroup(platesLine);

  // Overlays that may be toggled on or off
  var overlayMaps = {
    Earthquake: earthquakeLayer,
    Plates: platesLayer,
  };

  var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 4,
    layers: [streets, earthquakeLayer, platesLayer],
  });

  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);

  // Add a legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

    for (var i = 0; i < labels.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(labels[i]) +
        '"></i> ' +
        labels[i] +
        (labels[i] ? "<br>" : "");
    }
    return div;
  };
  legend.addTo(myMap);
}
