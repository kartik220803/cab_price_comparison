// Initialize Google Places Autocomplete for Pickup and Drop Locations
function initAutocomplete() {
    const pickupInput = document.getElementById('pickup');
    const dropInput = document.getElementById('drop');

    new google.maps.places.Autocomplete(pickupInput);
    new google.maps.places.Autocomplete(dropInput);
}

// Call initAutocomplete after Google Maps script is loaded
window.onload = initAutocomplete;

// Handle form submission
document.getElementById('locationForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const pickup = document.getElementById('pickup').value;
    const drop = document.getElementById('drop').value;

    if (pickup && drop) {
        fetch('http://localhost:3000/get-fare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}`,
        })
        .then(response => response.json()) // Assuming the server returns JSON
        .then(data => {
            document.getElementById('fareResults').classList.remove('d-none');
            
            // Update the results array with the fetched fare prices
            const results = [
                { provider: 'Uber', fare: `₹${data[0].Details[0].Fare}`, loginUrl: 'https://play.google.com/store/apps/details?id=com.ubercab&hl=en_IN' },
                { provider: 'Ola', fare: `₹${data[1].Details[0].Fare}`, loginUrl: 'https://play.google.com/store/apps/details?id=com.olacabs.customer&hl=en_IN' },
                { provider: 'Meru', fare: `₹${data[2].Details[0].Fare}`, loginUrl: 'https://play.google.com/store/apps/details?id=com.winit.merucab&pcampaignid=web_share' }
            ];

            const fareList = document.getElementById('fareList');
            fareList.innerHTML = ''; // Clear previous results

            // Append new results
            results.forEach(result => {
                const item = document.createElement('a');
                item.href = result.loginUrl;
                item.className = 'list-group-item list-group-item-action';
                item.target = '_blank'; // Open in new tab
                item.innerHTML = `<strong>${result.provider}</strong> - Fare: ${result.fare}`;
                fareList.appendChild(item);
            });
        })
        .catch(error => console.error('Error:', error));
    }
});

// Use Current Location Button Click Handler
document.getElementById('currentLocationBtn').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Show the user's current location in the Pickup input field
function showPosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBzh-N6q0vgIIcdWyVk8MiSl4pTx__r5us`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            const address = data.results[0]?.formatted_address || "Unable to detect address";
            document.getElementById('pickup').value = address;
        })
        .catch(error => console.error('Error fetching geocode:', error));
}

// Handle Geolocation Errors
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
