const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('Starting backend service...');

// Load credential from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

console.log('✅ Environment variables loaded successfully!');
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

// ✅ REQUIRED: Health check endpoint for Render
app.get('/', (req, res) => {
  res.json({ 
    message: 'ISS Tracker API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    project_id: serviceAccount.project_id
  });
});

// ✅ Optional: API endpoint to get current ISS location
app.get('/api/iss-location', async (req, res) => {
  try {
    const response = await axios.get(ISS_API_URL);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error('Error fetching ISS location:', error);
    res.status(500).json({ error: 'Failed to fetch ISS location' });
  }
});

// ✅ Optional: API endpoint to get stored ISS data
app.get('/api/iss-data', async (req, res) => {
  try {
    const querySnapshot = await db.collection('iss_location')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ISS data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch data' });
  }
});

// Background job to fetch ISS data
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
        console.log('✅ ISS location data stored in Firestore successfully!');
        console.log(`   Latitude: ${data.latitude}, Longitude: ${data.longitude}, Altitude: ${data.altitude}km`);
    } catch (error) {
        console.error('❌ Error fetching or storing ISS location data:', error);
    }
}

// 🧹 SIMPLE CLEANUP - Keep only 1000 latest records
async function simpleCleanup() {
  try {
    console.log('🧹 Running cleanup...');
    
    const snapshot = await db.collection('iss_location')
      .orderBy('createdAt', 'desc')
      .get();
    
    if (snapshot.size > 1000) {
      const recordsToDelete = snapshot.docs.slice(1000);
      const deletePromises = recordsToDelete.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);
      
      console.log(`✅ Cleanup done: Deleted ${deletePromises.length} records, kept 1000`);
    } else {
      console.log(`📊 No cleanup needed: ${snapshot.size}/1000 records`);
    }
  } catch (error) {
    console.error('❌ Cleanup error:', error);
  }
}
// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/`);
  console.log(`📍 ISS API: http://localhost:${PORT}/api/iss-location`);
  
  // Start background ISS tracking
  fetchISSLocation();
  setInterval(fetchISSLocation, 60000); // Fetch every 60 seconds
  console.log('🛰️ ISS tracking started - fetching data every 60 seconds');
  // 🧹 Start cleanup - run immediately and every 30 minutes
  simpleCleanup();
  setInterval(simpleCleanup, 30 * 60 * 1000); // Every 30 minutes
  console.log('🛰️ ISS tracking started');
  console.log('🧹 Cleanup scheduled every 30 minutes (keeps 1000 records)');
});
// Optional: Manual cleanup endpoint
app.post('/cleanup-now', async (req, res) => {
  await simpleCleanup();
  res.json({ message: 'Cleanup completed' });
});