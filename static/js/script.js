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

                    

                    displayMapAndMeetingPoint(lat, lon); // Use the actual latitude and longitude
                      
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


function displayMapAndMeetingPoint(startLat, startLon) {
    document.getElementById('globeContainer').style.display = 'none'; // Hide the globe container
    const mapContainer = document.getElementById('mapContainer');
    mapContainer.style.display = 'block'; // Show the map container

    var map = L.map('mapContainer').setView([startLat, startLon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.locate({ setView: false, maxZoom: 16 });
    map.on('locationfound', function (e) {
        var endLat = e.latlng.lat;
        var endLon = e.latlng.lng;

        const osrmRouteUrl = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;

        fetch(osrmRouteUrl)
            .then(response => response.json())
            .then(data => {
                const route = data.routes[0].geometry;

                L.geoJSON(route, {
                    style: { color: '#ff0000', weight: 5 }
                }).addTo(map);

                L.marker([startLat, startLon]).addTo(map).bindPopup('Friend\'s Location');
                L.marker([endLat, endLon]).addTo(map).bindPopup('Your Location');

                // Find and mark the meeting point
                const midIndex = Math.floor(route.coordinates.length / 2);
                const meetingPoint = route.coordinates[midIndex];
                L.marker([meetingPoint[1], meetingPoint[0]]).addTo(map).bindPopup('Meeting Point').openPopup();

                map.fitBounds(L.geoJSON(route).getBounds());
            })
            .catch(error => console.error('Error fetching the route from OSRM:', error));
        
    });

    
    

    map.on('locationerror', function (e) {
        alert(e.message);
    });
}
