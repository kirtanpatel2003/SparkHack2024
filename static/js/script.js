// document.addEventListener('DOMContentLoaded', function() {
//     var map = L.map('map').setView([51.505, -0.09], 13); // Default view

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     }).addTo(map);

//     function onLocationFound(e) {
//         var radius = e.accuracy / 2;
//         L.marker(e.latlng).addTo(map)
//             .bindPopup("You are within " + radius + " meters from this point").openPopup();
//         L.circle(e.latlng, radius).addTo(map);
//     }

//     function onLocationError(e) {
//         alert(e.message);
//     }

//     map.on('locationfound', onLocationFound);
//     map.on('locationerror', onLocationError);

//     map.locate({setView: true, maxZoom: 16});
// });

// document.querySelector('.dropbtn').addEventListener('click', function() {
//     document.querySelector('.dropdown-content').classList.toggle('show');
// });

// // Close the dropdown if the user clicks outside of it
// window.onclick = function(event) {
//     if (!event.target.matches('.dropbtn')) {
//         var dropdowns = document.getElementsByClassName("dropdown-content");
//         for (var i = 0; i < dropdowns.length; i++) {
//             var openDropdown = dropdowns[i];
//             if (openDropdown.classList.contains('show')) {
//                 openDropdown.classList.remove('show');
//             }
//         }
//     }
// }
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('locationForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const location = document.getElementById('locationInput').value;
        fetch('/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address: location }), // Send the location as JSON
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json(); // This returns a promise
            })
            .then(data => {
                console.log(data);
                if (!data.error) {
                    // If there's no error, display the map and set the location
                    const lat = parseFloat(data.lat);
                    const lon = parseFloat(data.lon);
                    displayMap(lat, lon); // Use the actual latitude and longitude
                } else {
                    alert('Location not found');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred: ' + error.message);
            });
    });
});

function displayMap(lat, lon) {
    document.getElementById('globeContainer').style.display = 'none'; // Hide the globe
    const mapContainer = document.getElementById('mapContainer');
    mapContainer.style.display = 'block'; // Show the map container

    var map = L.map('mapContainer').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([lat, lon]).addTo(map)
        .bindPopup('Friend\'s Location').openPopup();

    map.locate({ setView: false, maxZoom: 16 }); // Don't automatically change view
    map.on('locationfound', function (e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();
        L.circle(e.latlng, radius).addTo(map);
    });
    map.on('locationerror', function (e) {
        alert(e.message);
    });


}


function logMyLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var myLat = position.coords.latitude;
            var myLon = position.coords.longitude;
            console.log("My Latitude: " + myLat + ", My Longitude: " + myLon);

            // These coordinates are now available for your reference
            // You can use them as needed or just keep them logged for now
        }, function(error) {
            console.error("Error obtaining location: ", error);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// Call the function to log your current location
function findAndDisplayRoute(map, startPoint, endPoint) {
    // OSRM demo server endpoint for routing
    const osrmRouteUrl = `https://router.project-osrm.org/route/v1/driving/${startPoint[1]},${startPoint[0]};${endPoint[1]},${endPoint[0]}?overview=full&geometries=geojson`;

    fetch(osrmRouteUrl)
        .then(response => response.json())
        .then(data => {
            // Check if the OSRM server returned a route
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0].geometry;

                // Create a Leaflet polyline for the route and add it to the map
                const routeLine = L.geoJSON(route, {
                    style: { color: '#ff0000', weight: 5 }
                }).addTo(map);

                // Optionally, adjust the map view to fit the route
                map.fitBounds(routeLine.getBounds());
            } else {
                console.log("No route found.");
            }
        })
        .catch(error => console.error('Error fetching the route from OSRM:', error));
}

// Example coordinates: [latitude, longitude]
const startPoint = [41.8976787, -87.68727481972229]; // New York
const endPoint = [41.8700944, -87.6864329831356]; // Boston

// Assuming 'map' is your Leaflet map instance
findAndDisplayRoute(map, startPoint, endPoint);

