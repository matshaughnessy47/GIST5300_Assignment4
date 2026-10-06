// Create map
const map = L.map('map').setView([39, -98], 4);

// Basemap
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap contributors'
    }
).addTo(map);

// Layer Groups
const weatherLayer = L.layerGroup();
const earthquakeLayer = L.layerGroup();

// =====================
// WEATHER ALERTS
// =====================

fetch('https://api.weather.gov/alerts/active')
.then(response => response.json())
.then(data => {

    const alerts = L.geoJSON(data, {

        style: function(feature) {

            const severity = feature.properties.severity;

            if (severity === "Extreme") {
                return {
                    color: "purple",
                    weight: 3
                };
            }

            if (severity === "Severe") {
                return {
                    color: "red",
                    weight: 3
                };
            }

            if (severity === "Minor") {
                return {
                    color: "blue",
                    weight: 3
                };
            }

            return {
                color: "orange",
                weight: 2
            };
        },

        onEachFeature: function(feature, layer) {

            layer.bindPopup(
                "<b>" + feature.properties.event + "</b><br>" +
                feature.properties.headline
            );

        }

    });

    alerts.addTo(weatherLayer);

});

// =====================
// EARTHQUAKES
// =====================

function getColor(mag) {

    return mag > 5 ? 'red' :
           mag > 3 ? 'orange' :
           mag > 1 ? 'yellow' :
           'green';
}

function getRadius(mag) {
    return Math.max(mag * 4, 4);
}

fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
.then(response => response.json())
.then(data => {

    const quakes = L.geoJSON(data, {

        pointToLayer: function(feature, latlng) {

            return L.circleMarker(latlng, {

                radius: getRadius(feature.properties.mag || 0),

                fillColor: getColor(feature.properties.mag || 0),

                color: '#000',

                weight: 1,

                fillOpacity: 0.8

            });

        },

        onEachFeature: function(feature, layer) {

            layer.bindPopup(
                "<b>Magnitude:</b> " + feature.properties.mag + "<br>" +
                "<b>Location:</b> " + feature.properties.place + "<br>" +
                "<b>Time:</b> " + new Date(feature.properties.time)
            );

        }

    });

    quakes.addTo(earthquakeLayer);

});

// =====================
// TOGGLE CONTROL
// =====================

const overlayMaps = {
    "Weather Alerts": weatherLayer,
    "Earthquakes": earthquakeLayer
};

L.control.layers(null, overlayMaps, {
    collapsed: false
}).addTo(map);

// Show Weather by Default
weatherLayer.addTo(map);

// =====================
// EARTHQUAKE LEGEND
// =====================

const legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function () {

    const div = L.DomUtil.create('div', 'legend');

    div.innerHTML =
        '<b>Earthquake Magnitude</b><br>' +
        '<span style="color:green;">■</span> 0-1<br>' +
        '<span style="color:yellow;">■</span> 1-3<br>' +
        '<span style="color:orange;">■</span> 3-5<br>' +
        '<span style="color:red;">■</span> 5+';

    return div;
};

legend.addTo(map);