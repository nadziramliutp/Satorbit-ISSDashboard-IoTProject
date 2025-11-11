# TFB2093 - Internet of Things: 2nd Year 2nd Semester

## ISS Tracker Dashboard - Real-Time Telemetry Monitoring System

This is a real-time IoT dashboard built with **Vue.js** and **Node.js** that tracks the International Space Station (ISS) position, collecting telemetry data every 60 seconds and visualizing it on an interactive dashboard with live updates.

🎥 **[Click here for demo on Youtube](#)** *(Add your video link)*

---

## 👥 Group Members

| Name | Student ID |
|------|------------|
| NADZIRA BINTI RAMLI | 22010431 |
| JASHBINDAR SINGH | 22010355 |
| NURHUMAIRA NOORHIDAYAT | 22010451 |
| ETHAN LEE | 22010392 |

**Lecturer:** Dr. [Lecturer Name]

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Dashboard Components](#dashboard-components)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [References](#references)
- [License](#license)

---

## 🎯 Project Overview

The **ISS Tracker Dashboard** is a comprehensive IoT system that demonstrates real-time data collection, cloud storage, and interactive visualization. The system continuously monitors the International Space Station's position, altitude, and velocity, providing live updates through an intuitive web dashboard.

### Project Objectives

- ✅ Collect ISS telemetry data every 60 seconds for 3+ days
- ✅ Store historical location data in cloud database (Firebase Firestore)
- ✅ Compute real-time analytics (max/min longitude, altitude changes)
- ✅ Visualize ISS path and current position on an interactive map
- ✅ Display altitude changes over time using dynamic charts
- ✅ Implement three-layer IoT architecture (Perception, Network, Application)

---

## ✨ Features

### Real-Time Tracking
- 🛰️ **Live ISS Position**: Updates every 60 seconds with current coordinates
- 🗺️ **Interactive Map**: Shows ISS location and recent orbital path
- 📈 **Dynamic Charts**: Real-time altitude tracking with smooth animations
- 📊 **Live Statistics**: Automatic calculation of max, min, average values

### Data Management
- 💾 **Cloud Storage**: All data stored in Firebase Firestore
- 🔄 **Continuous Collection**: Backend runs 24/7 collecting telemetry
- 📋 **Historical Data**: Table view of latest readings
- 🔍 **Data Analytics**: Computed statistics from collected data

### User Interface
- 📱 **Responsive Design**: Works on desktop and tablet
- 🎨 **Clean Layout**: 2×2 grid dashboard with organized components
- ⚡ **Fast Performance**: Optimized queries and efficient rendering
- 🎯 **Single Page**: Everything fits in one viewport without scrolling

---

## 🏗️ System Architecture

### Three-Layer IoT Architecture
┌─────────────────────────────────────────────────────────┐
│                APPLICATION LAYER                        │
│  (Vue.js Frontend - Data Visualization & Analytics)    │
│  - Dashboard UI                                         │
│  - Real-time Charts & Maps                             │
│  - Analytics Computation                               │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │
┌─────────────────────────────────────────────────────────┐
│                  NETWORK LAYER                          │
│     (Firebase Firestore - Cloud Database)              │
│  - Data Storage                                         │
│  - Real-time Synchronization                           │
│  - Query Processing                                     │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │
┌─────────────────────────────────────────────────────────┐
│                 PERCEPTION LAYER                        │
│    (Node.js Backend - Data Collection Service)         │
│  - ISS API Integration                                  │
│  - Continuous Data Fetching (60s interval)             │
│  - Data Formatting & Storage                           │
└─────────────────────────────────────────────────────────┘
```

### Data Flow
```
ISS Satellite
    ↓
WTIA API (https://api.wheretheiss.at/v1)
    ↓
Node.js Backend (Fetch every 60s)
    ↓
Firebase Firestore (Cloud Storage)
    ↓
Vue.js Frontend (Real-time Display)
    ↓
User Dashboard (Interactive Visualization)
```

---

## 🛠️ Technology Stack

### Backend
- **Node.js** (v18+) - Runtime environment
- **Firebase Admin SDK** - Firestore integration
- **Axios** - HTTP client for API requests

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vuestic UI** - Vue component library
- **Chart.js** - Data visualization library
- **Leaflet.js** - Interactive maps
- **Firebase SDK** - Real-time database connection

### Database
- **Firebase Firestore** - NoSQL cloud database

### External APIs
- **Where The ISS At (WTIA) API** - Real-time ISS telemetry data

---

## 📦 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Firebase Account** - [Create free account](https://firebase.google.com/)
- **Git** (optional) - For cloning repository
- **Code Editor** - VS Code recommended

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/iss-tracker-dashboard.git
cd iss-tracker-dashboard
```

### Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (e.g., "ISS-Tracker")
3. Enable **Firestore Database**
4. Create a collection named `iss_location`

#### Get Firebase Credentials

**For Backend (Admin SDK):**
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as `backend/firebasecredential.json`

**For Frontend (Web SDK):**
1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy the config object

### Step 3: Backend Setup
```bash
cd backend
npm install
```

Create `backend/index.js`:
```javascript
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp({
  credential: admin.credential.cert(require('./firebasecredential.json'))
});

const db = admin.firestore();
const ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544';

async function fetchAndStore() {
  try {
    const response = await axios.get(ISS_API);
    const data = response.data;
    
    await db.collection('iss_location').add({
      latitude: data.latitude,
      longitude: data.longitude,
      altitude: data.altitude,
      velocity: data.velocity,
      timestamp: data.timestamp,
      visibility: data.visibility,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✓ Data stored:', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

fetchAndStore();
setInterval(fetchAndStore, 60000);

console.log('🛰️ ISS Tracker backend started');
```

Install dependencies:
```bash
npm install firebase-admin axios
```

### Step 4: Frontend Setup
```bash
cd ../frontend
npm install
```

Create `frontend/src/firebase/config.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
```

Install dependencies:
```bash
npm install firebase leaflet chart.js
```

---

## 📁 Project Structure
```
iss-tracker-dashboard/
│
├── backend/
│   ├── index.js                    # Data collection service
│   ├── firebasecredential.json     # Firebase Admin credentials (gitignored)
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   │   └── DashboardView.vue   # Main dashboard layout
│   │   │
│   │   ├── components/
│   │   │   ├── CurrentPosition.vue # Live ISS position card
│   │   │   ├── GroupMembers.vue    # Team information
│   │   │   ├── DataTable.vue       # Telemetry data table
│   │   │   ├── ISSMap.vue          # Interactive map
│   │   │   └── AltitudeChart.vue   # Real-time altitude chart
│   │   │
│   │   ├── firebase/
│   │   │   └── config.js           # Firebase frontend config
│   │   │
│   │   ├── router/
│   │   │   └── index.js            # Vue Router config
│   │   │
│   │   ├── App.vue                 # Root component
│   │   └── main.js                 # Entry point
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## ⚙️ How It Works

### Data Collection Process

1. **Backend Service Starts**
   - Node.js application connects to Firebase
   - Establishes connection to WTIA API

2. **Continuous Data Fetching**
   - Every 60 seconds, backend fetches ISS telemetry
   - Data includes: latitude, longitude, altitude, velocity

3. **Data Storage**
   - Raw data stored in Firestore `iss_location` collection
   - Timestamp added for chronological tracking

4. **Frontend Real-Time Updates**
   - Vue components listen to Firestore changes
   - Dashboard updates automatically without refresh

5. **Analytics Computation**
   - Frontend computes statistics on-demand
   - Max/min values, averages, ranges calculated in real-time

---

## 🎛️ Dashboard Components

### 1. Current Position Card (Top-Left)
- **Real-time updates**: Every 60 seconds
- **Displays**: Latitude, Longitude, Altitude, Velocity
- **Status indicator**: Live badge with pulsing animation

### 2. Group Members Card (Top-Left)
- **Static information**: Team members and student IDs
- **Purpose**: Project identification

### 3. Interactive Map (Top-Right)
- **Technology**: Leaflet.js
- **Features**:
  - Live ISS marker with satellite icon
  - Orbital path (last 20 positions)
  - Auto-centering on ISS location
  - Zoom controls

### 4. Data Table (Bottom-Left)
- **Displays**: Latest 10 telemetry readings
- **Columns**: Time, Altitude, Longitude, Latitude
- **Features**:
  - Scrollable for more data
  - Color-coded values
  - Sticky header

### 5. Altitude Chart (Bottom-Right)
- **Technology**: Chart.js
- **Real-time updates**: Smooth animations
- **Features**:
  - Rolling window (last 50 points)
  - Statistics: Max, Min, Range, Average
  - Interactive tooltips

---

## 🔧 Configuration

### Backend Configuration

**Adjust data collection frequency:**
```javascript
// In backend/index.js
setInterval(fetchAndStore, 60000); // 60000ms = 60 seconds
```

**Change ISS satellite ID:**
```javascript
// Different satellite (if needed)
const ISS_API = 'https://api.wheretheiss.at/v1/satellites/SATELLITE_ID';
```

### Frontend Configuration

**Modify data display limits:**
```vue
<!-- In DashboardView.vue -->
<DataTable :rowCount="10" />  <!-- Show 10 rows -->
<AltitudeChart :dataLimit="50" />  <!-- Show 50 points -->
```

**Change chart colors:**
```javascript
// In AltitudeChart.vue
borderColor: '#3b82f6',  // Blue
backgroundColor: 'rgba(59, 130, 246, 0.1)',
```

---

## ▶️ Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
node index.js
```

**Expected output:**
```
🛰️ ISS Tracker backend started
📡 Fetching ISS data every 60 seconds...
✓ Data stored: 10:30:45 PM
✓ Data stored: 10:31:45 PM
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Access Dashboard

Open browser and navigate to:
```
http://localhost:5173
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: "Cannot find module 'firebase-admin'"**
```bash
cd backend
npm install firebase-admin axios
```

**Problem: "ECONNREFUSED - Cannot connect to Firestore"**
- Check `firebasecredential.json` is in correct location
- Verify Firebase project has Firestore enabled
- Check internet connection

**Problem: "API rate limit exceeded"**
- WTIA API allows reasonable requests
- Default 60-second interval is safe
- Consider increasing interval if needed

### Frontend Issues

**Problem: "Module not found: leaflet"**
```bash
cd frontend
npm install leaflet chart.js firebase
```

**Problem: "Map not displaying"**
- Check Leaflet CSS is imported
- Verify map container has height
- Check browser console for errors

**Problem: "Real-time updates not working"**
- Verify Firebase config is correct
- Check browser console for connection errors
- Ensure Firestore security rules allow read access

### Firestore Security Rules

For development, use these rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /iss_location/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

⚠️ **Note:** For production, implement proper authentication!

---

## 📊 Performance Optimization

### Database Queries

- **Limit queries**: Fetch only necessary data points
- **Use indexes**: Firestore auto-indexes on `createdAt`
- **Pagination**: Implement for large datasets

### Frontend Optimization

- **Lazy loading**: Components load on demand
- **Computed properties**: Cache calculated values
- **Debouncing**: Prevent excessive updates

---

## 🔮 Future Enhancements

### Planned Features

- [ ] **Historical Data Analysis**: View data from specific dates
- [ ] **Data Export**: Download telemetry as CSV/JSON
- [ ] **Prediction Algorithm**: Estimate future ISS positions
- [ ] **Alert System**: Notifications for specific events
- [ ] **Mobile App**: React Native version
- [ ] **Dark Mode**: Theme toggle for better UX
- [ ] **Multiple Satellites**: Track other objects
- [ ] **3D Visualization**: Three.js Earth globe view

### Technical Improvements

- [ ] **Authentication**: User login system
- [ ] **API Caching**: Reduce external API calls
- [ ] **Error Handling**: Better error messages
- [ ] **Testing**: Unit and integration tests
- [ ] **CI/CD Pipeline**: Automated deployment
- [ ] **Docker**: Containerization for easy deployment

---

## 📚 References

### APIs
- [Where The ISS At API Documentation](https://wheretheiss.at/w/developer)
- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)

### Libraries
- [Vue.js Documentation](https://vuejs.org/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Leaflet.js Documentation](https://leafletjs.com/)
- [Vuestic UI Components](https://vuestic.dev/)

### Learning Resources
- [IoT Three-Layer Architecture](https://www.iotforall.com/iot-architecture)
- [Real-time Database Design](https://firebase.google.com/docs/database)

---

## 📄 License

This project is created for educational purposes as part of **TFB2093 - Internet of Things** course at Universiti Teknologi PETRONAS.

**Course:** TFB2093 - Internet of Things  
**Semester:** 2nd Semester, 2024/2025  
**Institution:** Universiti Teknologi PETRONAS  

---

## 🙏 Acknowledgments

- **Lecturer:** Dr. [Lecturer Name] for guidance and support
- **WTIA API:** For providing free ISS telemetry data
- **Firebase:** For cloud infrastructure
- **Open Source Community:** For amazing libraries and tools

---

## 🌟 Project Highlights

**Key Achievements:**
- ✅ Successfully implemented three-layer IoT architecture
- ✅ Real-time data collection for 3+ days (4,320+ data points)
- ✅ Live dashboard with automatic updates
- ✅ Professional UI/UX design
- ✅ Cloud-based storage and synchronization
- ✅ Responsive and performant application

**Technical Challenges Overcome:**
- Real-time data synchronization
- Efficient database queries
- Responsive layout design
- Chart animation performance
- Component lifecycle management

---

**⭐ If you found this project helpful, please give it a star!**

---

*Last Updated: 1st November 2025*  
*Version: 1.0.0*
