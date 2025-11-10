<template>
  <div class="current-position-card">
    <div v-if="loading" class="loading">
      <span class="loading-spinner">⏳</span>
      <span>Loading position data...</span>
    </div>
    
    <div v-else class="position-content">
      <div class="position-grid">
        <div class="position-item">
          <div class="item-icon">📍</div>
          <div class="item-info">
            <span class="item-label">Latitude</span>
            <span class="item-value">{{ data.latitude?.toFixed(4) }}°</span>
          </div>
        </div>
        
        <div class="position-item">
          <div class="item-icon">🧭</div>
          <div class="item-info">
            <span class="item-label">Longitude</span>
            <span class="item-value">{{ data.longitude?.toFixed(4) }}°</span>
          </div>
        </div>
        
        <div class="position-item">
          <div class="item-icon">🚀</div>
          <div class="item-info">
            <span class="item-label">Altitude</span>
            <span class="item-value">{{ data.altitude?.toFixed(2) }} km</span>
          </div>
        </div>
        
        <div class="position-item">
          <div class="item-icon">⚡</div>
          <div class="item-info">
            <span class="item-label">Velocity</span>
            <span class="item-value">{{ (data.velocity / 1000)?.toFixed(2) }} km/s</span>
          </div>
        </div>
      </div>
      
      <div class="update-footer">
        <span class="update-time">🔄 {{ lastUpdate }}</span>
        <span class="update-interval">Every 60s</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const loading = ref(true);
const data = ref({});
const lastUpdate = ref('--:--:--');
let unsubscribe = null;

onMounted(() => {
  const q = query(
    collection(db, 'iss_location'),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  
  unsubscribe = onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      data.value = snapshot.docs[0].data();
      lastUpdate.value = new Date().toLocaleTimeString();
      loading.value = false;
      console.log('🔄 Position updated');
    }
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

<style scoped>
.current-position-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow: hidden;
}

.loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.9rem;
}

.loading-spinner {
  font-size: 2rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.position-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.position-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  flex: 1;
}

.position-item {
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.position-item:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

.item-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.item-label {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-value {
  font-size: 1.1rem;
  color: #60a5fa;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.update-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-top: 0.75rem;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 8px;
  font-size: 0.75rem;
}

.update-time {
  color: #e5e7eb;
  font-weight: 500;
}

.update-interval {
  color: #10b981;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

@media (max-width: 768px) {
  .position-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .position-item {
    padding: 0.75rem;
  }
  
  .item-value {
    font-size: 1rem;
  }
  
  .update-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
```

---

## 🎯 **What Changed**

### **Simplified Structure:**
```
BEFORE: Multiple nested divs with complex styling
AFTER:  Clean, minimal structure with dark theme
```

### **Dark Theme Applied:**
```
✅ Transparent card background (inherits from dashboard)
✅ Dark blue/purple accent colors
✅ Glow effects on icons
✅ Smooth hover animations
✅ Monospace font for values
✅ Green accent for update info
```

### **Kept All Data:**
```
✅ Latitude
✅ Longitude  
✅ Altitude
✅ Velocity
✅ Last update time
✅ Update interval
✅ Real-time updates
✅ Loading state
```

---

## 🎨 **Visual Design**
```
┌─────────────────────────────────────┐
│  📍 Latitude        🧭 Longitude    │
│  45.1234°          -79.6789°        │
│                                     │
│  🚀 Altitude        ⚡ Velocity     │
│  423.56 km         27.58 km/s      │
│                                     │
│  🔄 10:30:45 PM    [Every 60s]     │
└─────────────────────────────────────┘
```

---

## 🎯 **Key Features**

### **1. Clean Layout:**
```
- 2x2 grid for data
- Icon + Label + Value
- Update info at bottom
- Minimal padding