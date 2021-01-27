console.log('Ok Connected')

//Set map and jsonURL variables
const mymap = L.map('map').setView([33.724340,-112.464625], 4);
const jsonDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

//Initiate map layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(mymap);

//Read GeoJSON file
d3.json(jsonDataUrl).then(data=>{
    //console.log(data.features)
    data.features.forEach(eq=>{
        //console.log(eq.geometry.coordinates[0])
        //console.log(eq.properties.mag)
        L.circle([eq.geometry.coordinates[1],eq.geometry.coordinates[0]], {
            color: 'grey',
            weight: .5,
            fillColor: getColor(eq.properties.mag), //Get color based on magnitude
            fillOpacity: 1,
            radius: 10000 * 2 * eq.properties.mag // Set radius based on magnitude
          }).bindPopup(`Earthquake Magnitude:<h4>${eq.properties.mag}</h4><hr>Location:<br>${eq.properties.place}`).addTo(mymap); //Add popup when clicked w/ more info
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

//Add legend at bottom right
let legend = L.control({position: 'bottomright'});
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
