const admin = require('firebase-admin');
const axios = require('axios');

console.log('Starting backend service...');

// Load credential, auto got access
const serviceAccount = require('./firebasecredential.json');
console.log('✅ Credentials loaded successfully!');
console.log(`   Project ID: ${serviceAccount.project_id}`);
console.log(`   Client Email: ${serviceAccount.client_email}\n`);


// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
console.log('✅ Firebase Admin SDK initialized successfully!\n');

// Get the firestore database instance
const db = admin.firestore();
console.log('✅ Firestore database instance obtained successfully!\n');

const ISS_API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
async function fetchISSLocation() {
    try {
        const response = await axios.get(ISS_API_URL);
        const data = response.data;
        await db.collection('iss_location').add({
        latitude: data.latitude,
        longitude: data.longitude,
        altitude: data.altitude,
        velocity : data.velocity,
        timestamp: data.timestamp,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Fetched ISS location data:', data);
    console.log('\t Latitude:', data.latitude);
    console.log('\t Longitude:', data.longitude);
    console.log('\t Altitude:', data.altitude);
    console.log('\t Velocity:', data.velocity);
    console.log('\t Timestamp:', data.timestamp);
    console.log('✅ ISS location data stored in Firestore successfully!\n');
    } catch (error) {
        console.error('❌ Error fetching or storing ISS location data:', error);
    }
}
fetchISSLocation();
setInterval(fetchISSLocation, 6000); // Fetch every 60 seconds

