// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Your web app's Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};

// Debug: Check if environment variables are loaded
console.log('Firebase Config Loaded:', {
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID ? '✅' : '❌',
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY ? '✅' : '❌'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Firestore service functions
const firestoreService = {
  // Get all ISS location data
  async getISSData() {
    try {
      const querySnapshot = await getDocs(collection(db, "iss_location"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return data;
    } catch (error) {
      console.error("Error fetching ISS data:", error);
      throw error;
    }
  },

  // Get latest ISS location
  async getLatestISSData() {
    try {
      const querySnapshot = await getDocs(collection(db, "iss_location"));
      let latestData = null;
      let latestTimestamp = 0;

      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const timestamp = docData.timestamp || docData.createdAt?.toMillis() || 0;
        
        if (timestamp > latestTimestamp) {
          latestTimestamp = timestamp;
          latestData = {
            id: doc.id,
            ...docData
          };
        }
      });

      return latestData;
    } catch (error) {
      console.error("Error fetching latest ISS data:", error);
      throw error;
    }
  }
};

// Test connection on startup
firestoreService.getISSData()
  .then(data => console.log(`✅ Firebase connected. Found ${data.length} ISS records`))
  .catch(error => console.error('❌ Firebase connection failed:', error));

export { db, firestoreService, collection, getDocs };