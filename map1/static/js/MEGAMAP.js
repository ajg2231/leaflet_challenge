const KEY = "pk.eyJ1IjoiYWpnMjIzMSIsImEiOiJja252b2Vha20wbDkxMndzNzcwMnhzOTgzIn0.SzxKIeSYOwDNqL_9TNNVsA";

var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-03-16&endtime=" +
  "2021-04-16&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

d3.json(url, function(data) {
  make(data.features);
  console.log(data);
});

function oco(depth) {

    if (depth >= 90) {
      return "blue";
    }
    else if (depth >= 70) {
      return "red";
    }
    else if (depth>= 50) {
     return "green";
    }
    else if (depth >= 30) {
      return "yellow";
    }
    else if (depth >= 10) {
      return "purple";
    }
    else {
      return "orange";
    }

  }

  function pir(mag) {
      return mag ** 2;
    }

function make(eqs) {

    function ola(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          radius: pir(feature.properties.mag),
          fillOpacity: 0.8,
          color: oco(feature.geometry.coordinates[2]),
          fillColor: oco(feature.geometry.coordinates[2])
        });
    }

    function ofe(feature, layer) {
        layer.bindPopup("<h3>Location: " + feature.properties.place +
        "</h3><hr><p><b>Date: </b>" + new Date(feature.properties.time) + "</p><p><b>Magnitude: </b>" + feature.properties.mag + "</p>" + "</p><p><b>Depth: </b>" + feature.geometry.coordinates[2] + "</p>");
    }

  var qua = L.geoJSON(eqs, {
    onEachFeature: ofe,
    pointToLayer: ola
  });

  cram(qua);
}

function cram(qua) {

  var dram = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: KEY
  });

  var bam = {

    "Dark Map": dram
  };

  var ovl = {
    Earthquakes: qua
  };

  var ha = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [dram, qua]
  });

  L.control.layers(bam, ovl, {
    collapsed: false
  }).addTo(ha);


  var leg = L.control({
    position: 'bottomright'
});

leg.onAdd = function (color) {
    var div = L.DomUtil.create('div', 'info legend');
    dep = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    col = ["blue", "red", "green", "yellow", "purple", "orange"]
    div.innerHTML += "<h3>Depth</h3>"
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML += '<i style="background:' + col[i] + '"></i>' + dep[i] + '<br>';
    }
    return div;
}
leg.addTo(ha);
}
