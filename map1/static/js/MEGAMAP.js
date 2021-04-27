var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-03-16&endtime=" +
  "2021-04-16&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


d3.json(queryUrl, function(data) {

  createFeatures(data.features);
  console.log(data);
});

function createFeatures(earthquakeData) {
    
    function onEachLayer(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          radius: getRadius(feature.properties.mag),
          fillOpacity: 0.8,
          color: getColor(feature.geometry.coordinates[2]),
          fillColor: getColor(feature.geometry.coordinates[2])
        });
    }


    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Location: " + feature.properties.place +
        "</h3><hr><p><b>Date: </b>" + new Date(feature.properties.time) + "</p><p><b>Magnitude: </b>" + feature.properties.mag + "</p>" + "</p><p><b>Depth: </b>" + feature.geometry.coordinates[2] + "</p>");
    }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: onEachLayer
  });


  createMap(earthquakes);
}

function createMap(earthquakes) {

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });


  var baseMaps = {

    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [darkmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);




  var legend = L.control({
    position: 'bottomright'
});


legend.onAdd = function (color) {
    var div = L.DomUtil.create('div', 'info legend');
    depth = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    colors = ["#A3F600", "#DCF400", "#F7DB11", "#FDB72A", "#FCA35D", "#FF5F65"]
    div.innerHTML += "<h3>Depth</h3>"
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + depth[i] + '<br>';
    }
    return div;
}
legend.addTo(myMap);
}

function getColor(depth) {
    
    if (depth >= 90) {
      return "#FF5F65";
    }
    else if (depth >= 70) {
      return "#FCA35D";
    }
    else if (depth>= 50) {
     return "#FDB72A";
    }
    else if (depth >= 30) {
      return "#F7DB11";
    }
    else if (depth >= 10) {
      return "#DCF400";
    }
    else {
      return "#A3F600";
    }
  
  }
function getRadius(magnitude) {
    return magnitude ** 2;
  }
