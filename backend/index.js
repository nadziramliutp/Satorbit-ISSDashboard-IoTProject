const express = require('express');
const admin = require('firebase-admin');
const axios = require('axios');

const app = express();

// ✅ Add these routes for Render's health checks
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'ISS Data Fetcher',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'ISS Location Tracker API - Data fetching service is running',
    lastUpdated: new Date().toISOString()
  });
});

// Your existing ISS fetching code (NO CHANGES NEEDED)
console.log('Starting backend service...');

const serviceAccount = {
  type: process.env.FIREBASE_TYPE || "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
  token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com"
};

console.log('✅ Environment variables loaded successfully!');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log('✅ Firebase Admin SDK initialized successfully!');

// Get the firestore database instance
const db = admin.firestore();
console.log('✅ Firestore database instance obtained successfully!');

const ISS_API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

async function fetchISSLocation() {
  try {
    const response = await axios.get(ISS_API_URL);
    const data = response.data;
    await db.collection('iss_location').add({
      latitude: data.latitude,
      longitude: data.longitude,
      altitude: data.altitude,
      velocity: data.velocity,
      timestamp: data.timestamp,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ ISS data stored at:', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('❌ Error fetching ISS data:', error.message);
  }
}

// Start fetching data
fetchISSLocation();
setInterval(fetchISSLocation, 60000); // Fetch every 60 seconds

// ⭐⭐⭐ CRITICAL: Add this at the end ⭐⭐⭐
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ HTTP server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});