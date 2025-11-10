<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '../firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'

const datalist = ref([]);
let unsubscribe = null;  // ✅ Added for cleanup

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString();
}

onMounted(() => {
  const q = query(
    collection(db, "iss_location"), 
    orderBy("createdAt", "desc"), 
    limit(10)
  );
  
  // ✅ Changed from getDocs to onSnapshot
  unsubscribe = onSnapshot(q, (querySnapshot) => {
    datalist.value = [];  // Clear old data
    
    querySnapshot.forEach((doc) => {
      datalist.value.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`🔄 Table updated: ${datalist.value.length} rows`);
  });
});

// ✅ Added cleanup
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
    console.log('📊 Table real-time updates stopped');
  }
});
</script>

<template>
  <div class="data-table-container">
    <div class="table-wrapper">
      <table class="iss-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Altitude</th>
            <th>Longitude</th>
            <th>Latitude</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in datalist" :key="item.id">
            <td class="time-col">{{ formatTime(item.createdAt) }}</td>
            <td class="alt-col">{{ item.altitude.toFixed(2) }}</td>
            <td class="lon-col">{{ item.longitude.toFixed(4) }}°</td>
            <td class="lat-col">{{ item.latitude.toFixed(4) }}°</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.data-table-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow: hidden;
  padding: 0.75rem;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
  background: rgba(99, 102, 241, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.iss-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.iss-table thead {
  position: sticky;
  top: 0;
  background: rgba(99, 102, 241, 0.1);
  z-index: 10;
}

.iss-table th {
  padding: 0.75rem 0.5rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
}

.iss-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(99, 102, 241, 0.05);
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

.iss-table tbody tr {
  transition: background 0.2s;
}

.iss-table tbody tr:hover {
  background: rgba(99, 102, 241, 0.05);
}

.iss-table tbody tr:nth-child(even) {
  background: rgba(99, 102, 241, 0.02);
}

/* Column colors */
.time-col {
  color: #e5e7eb;
  font-weight: 600;
}

.alt-col {
  color: #60a5fa;
  font-weight: 700;
}

.alt-col::after {
  content: ' km';
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
}

.lon-col {
  color: #a78bfa;
  font-weight: 700;
}

.lat-col {
  color: #34d399;
  font-weight: 700;
}

/* Scrollbar */
.table-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: rgba(99, 102, 241, 0.05);
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

@media (max-width: 768px) {
  .data-table-container {
    padding: 0.5rem;
  }
  
  .iss-table th,
  .iss-table td {
    padding: 0.5rem 0.4rem;
    font-size: 0.75rem;
  }
}
</style>