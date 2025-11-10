<template>
  <div class="iss-map">
    <div id="map"></div>
    
    <div class="map-footer">
      <div class="position-info">
        <div class="info-row">
          <span class="info-label">Lat:</span>
          <span class="info-value">{{ currentLat.toFixed(4) }}°</span>
        </div>
        <div class="info-row">
          <span class="info-label">Lon:</span>
          <span class="info-value">{{ currentLon.toFixed(4) }}°</span>
        </div>
        <div class="info-row">
          <span class="info-label">Alt:</span>
          <span class="info-value">{{ currentAlt.toFixed(2) }} km</span>
        </div>
      </div>
      <div class="path-count">{{ pathCount }} positions</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const currentLat = ref(0);
const currentLon = ref(0);
const currentAlt = ref(0);
const pathCount = ref(0);

let map = null;
let marker = null;
let pathLine = null;
let unsubscribe = null;

async function loadPath() {
  const q = query(
    collection(db, 'iss_location'),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  
  const snapshot = await getDocs(q);
  const coords = [];
  
  snapshot.forEach(doc => {
    const d = doc.data();
    coords.push([d.latitude, d.longitude]);
  });
  
  pathCount.value = coords.length;
  
  if (pathLine && coords.length > 0) {
    pathLine.setLatLngs(coords.reverse());
  }
}

function setupRealTime() {
  const q = query(
    collection(db, 'iss_location'),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  
  unsubscribe = onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      
      currentLat.value = data.latitude;
      currentLon.value = data.longitude;
      currentAlt.value = data.altitude;
      
      if (marker && map) {
        marker.setLatLng([data.latitude, data.longitude]);
        map.setView([data.latitude, data.longitude], 3);
      }
    }
  });
}

onMounted(async () => {
  // Dark theme tile layer
  map = L.map('map', {
    zoomControl: true,
    attributionControl: false
  }).setView([0, 0], 2);
  
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19
}).addTo(map);
  
  // ISS icon
  const icon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
    iconSize: [50, 30],
    iconAnchor: [25, 15]
  });
  
  marker = L.marker([0, 0], { icon }).addTo(map);
  
  // Path line (light blue to match theme)
  pathLine = L.polyline([], { 
    color: '#60a5fa', 
    weight: 2,
    opacity: 0.8
  }).addTo(map);
  
  await loadPath();
  setupRealTime();
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
  if (map) map.remove();
});
</script>

<style scoped>
.iss-map {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow: hidden;
}

#map {
  flex: 1;
  min-height: 0;
  background: #1a1f2e;
  border-radius: 8px;
  overflow: hidden;
}

.map-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-top: 0.75rem;
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 8px;
  flex-shrink: 0;
}

.position-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.coord {
  font-size: 0.85rem;
  color: #e5e7eb;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}
.info-label {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
}

.info-value {
  font-size: 0.85rem;
  color: #e5e7eb;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.altitude {
  font-size: 0.75rem;
  color: #60a5fa;
  font-weight: 600;
}

.path-count {
  font-size: 0.75rem;
  color: #9ca3af;
  padding: 0.25rem 0.5rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

/* Dark theme for Leaflet controls */
:deep(.leaflet-control-zoom) {
  border: 1px solid rgba(99, 102, 241, 0.3) !important;
  background: #1e293b !important;
}

:deep(.leaflet-control-zoom a) {
  background: #1e293b !important;
  color: #e5e7eb !important;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2) !important;
}

:deep(.leaflet-control-zoom a:hover) {
  background: #334155 !important;
}

:deep(.leaflet-popup-content-wrapper) {
  background: #1e293b !important;
  color: #e5e7eb !important;
}

:deep(.leaflet-popup-tip) {
  background: #1e293b !important;
}

@media (max-width: 768px) {
  .map-footer {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .coord {
    font-size: 0.8rem;
  }
}
</style>