// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Your web app's Firebase configuration - USING import.meta.env for Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug: Check if environment variables are loading
console.log('=== VITE ENVIRONMENT CHECK ===');
console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log('VITE_FIREBASE_API_KEY exists:', !!import.meta.env.VITE_FIREBASE_API_KEY);
console.log('All env vars:', import.meta.env);
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