const socket = io();
console.log("hey");

const map = L.map("map").setView([0.0, 0.0], 2);

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { longitude, latitude });

            map.setView([latitude, longitude], 13);

            L.marker([latitude, longitude]).addTo(map);
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Tousif coding"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    console.log("Received location data:", data);
    const { id, latitude, longitude } = data;
    
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});