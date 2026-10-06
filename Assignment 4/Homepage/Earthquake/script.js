const map = L.map('map').setView([20,0],2);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

).addTo(map);

function getColor(mag){

return mag > 5 ? 'red' :
       mag > 3 ? 'orange' :
       mag > 1 ? 'yellow' :
       'green';

}

function getRadius(mag){
return mag * 4;
}

fetch(
'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
)
.then(response => response.json())
.then(data => {

L.geoJSON(data,{

pointToLayer:function(feature,latlng){

return L.circleMarker(latlng,{

radius:getRadius(
feature.properties.mag || 0
),

fillColor:getColor(
feature.properties.mag || 0
),

color:"#000",

weight:1,

fillOpacity:0.8

});

},

onEachFeature:function(feature,layer){

layer.bindPopup(`
<b>Magnitude:</b> ${feature.properties.mag}<br>
<b>Location:</b> ${feature.properties.place}<br>
<b>Time:</b>
${new Date(feature.properties.time)}
`);

}

}).addTo(map);

});

// Legend

const legend = L.control({position:'bottomright'});

legend.onAdd = function(){

const div = L.DomUtil.create('div','legend');

div.innerHTML = `
<b>Magnitude</b><br>
<span style="color:green;">■</span> 0-1<br>
<span style="color:yellow;">■</span> 1-3<br>
<span style="color:orange;">■</span> 3-5<br>
<span style="color:red;">■</span> 5+
`;

return div;

};

legend.addTo(map);