console.log('Ok Connected')

//Set map and jsonURL variables
//const mymap = L.map('map').setView([33.724340,-112.464625], 4);
const jsonDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
const jsonDataUrl2 = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'

    //Define variables for our tile layers
    let satelite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "satellite-v9",
      accessToken: API_KEY
    });

    let light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });

    let outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "outdoors-v11",
      accessToken: API_KEY
    });

    // Only one base layer can be shown at a time
    let baseMaps = {
        Satelite: satelite,
        Grayscale: light,
        Outdoors: outdoors
    };


//Create EQ Markers Layer
//var eqMarkers = [];
//Read GeoJSON file
d3.json(jsonDataUrl).then(data=>{
    //console.log(data.features)
    let eqMarkers = [];
    data.features.forEach(eq=>{
        //console.log(eq.geometry.coordinates[0])
        //console.log(eq.properties.mag)
        eqMarkers.push(
            L.circle([eq.geometry.coordinates[1],eq.geometry.coordinates[0]], {
                color: 'grey',
                weight: .5,
                fillColor: getColor(eq.properties.mag), //Get color based on magnitude
                fillOpacity: 1,
                radius: 10000 * 2 * eq.properties.mag // Set radius based on magnitude
              }).bindPopup(`Earthquake Magnitude:<h4>${eq.properties.mag}</h4><hr>Location:<br>${eq.properties.place}`) //Add popup when clicked w/ more info
        );
    })
    let eqLayer = L.layerGroup(eqMarkers);

    d3.json(jsonDataUrl2).then(data=>{
      console.log(data.features)
      let boudLines = [];
      data.features.forEach(eq=>{
          //console.log(eq.geometry.coordinates[0])
          //console.log(eq.properties.mag)
          boudLines.push(
              L.geoJSON([eq.geometry]) //Add popup when clicked w/ more info
          );
      })
      let boundLayer = L.layerGroup(boudLines);

    // Overlays that may be toggled on or off
    let overlayMaps = {
      Earthquakes: eqLayer,
      'Fault Lines': boundLayer
    };

  // Create map object and set default layers
  let mymap = L.map("map", {
      center: [33.724340,-112.464625],
      zoom: 4,
      layers: [light, eqLayer, boundLayer]
    });

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(mymap);

  //Add legend at bottom right
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
      let div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];
      //Loop thru grades and create colored label
      for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
  };
  legend.addTo(mymap);



    })
    .catch(e=>{
        console.log(e)
    })


})
.catch(e=>{
    console.log(e)
})

    /**
     * Returns color based on Earthquake magnitude
     * @param {number} d Earthquake Magnitude
     */
    function getColor(d) {
      return d > 5 ? '#F06B6B' :
            d > 4  ? '#F0A76B' :
            d > 3  ? '#F3BA4D' :
            d > 2  ? '#F3DB4D' :
            d > 1   ? '#E1F34D' :
                        '#B7F34D';
  }

