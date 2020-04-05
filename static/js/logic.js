var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 6,
});

L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY,
  }
).addTo(myMap);

var earthquakeData =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(mag) {
  return mag * 10000;
}

d3.json(earthquakeData, function (data) {
  console.log(data);

  for (var i = 0; i < data.features.length; i++) {
    var location = [
      data.features[i].geometry.coordinates[1],
      data.features[i].geometry.coordinates[0],
    ];

    if (data.features[i].properties.mag >= 5) {
      var color = "rgb(240,107,107)";
    } else if (
      (data.features[i].properties.mag >= 4) &
      (data.features[i].properties.mag < 5)
    ) {
      var color = "rgb(240,167,107)";
    } else if (
      (data.features[i].properties.mag >= 3) &
      (data.features[i].properties.mag < 4)
    ) {
      var color = "rgb(243,186,77)";
    } else if (
      (data.features[i].properties.mag >= 2) &
      (data.features[i].properties.mag < 3)
    ) {
      var color = "rgb(243,219,77)";
    } else if (
      (data.features[i].properties.mag >= 1) &
      (data.features[i].properties.mag < 2)
    ) {
      var color = "rgb(225,243,77)";
    } else {
      var color = "rgb(183,243,77)";
    }

    L.circle(location, {
      fillOpacity: 0.75,
      color: "black",
      weight: 1,
      fillColor: color,
      radius: markerSize(data.features[i].properties.mag),
    })
      .bindPopup(
        "<h1>" +
          data.features[i].properties.place +
          "</h1>" +
          "<hr>" +
          "<h3>Magnitude: " +
          data.features[i].properties.mag +
          "</h3>"
      )
      .addTo(myMap);
  }
});
