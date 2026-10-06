const map = L.map('map').setView([39,-98],4);

L.tileLayer(
'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',

).addTo(map);

// Radar

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

).addTo(map);


// Alerts

fetch('https://api.weather.gov/alerts/active')
.then(response => response.json())
.then(data => {

L.geoJSON(data,{

style:function(feature){

let severity =
feature.properties.severity;

if(severity === "Extreme"){
return {
color:"green",
weight:3
};
}

if(severity === "Severe"){
return {
color:"red",
weight:3
};
}

if(severity === "Minor"){
return {
color:"blue",
weight:2
};
}

return {
color:"orange",
weight:2
};

},

onEachFeature:function(feature,layer){

layer.bindPopup(`
<b>${feature.properties.event}</b><br>
${feature.properties.headline}
`);

}

}).addTo(map);

});