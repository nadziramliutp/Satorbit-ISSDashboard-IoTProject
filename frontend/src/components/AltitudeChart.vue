<template>
  <div class="altitude-chart">
    <div v-if="loading" class="loading">Loading chart...</div>
    
    <div v-else class="chart-content">
      <div class="chart-wrapper">
        <canvas id="altitudeChart"></canvas>
      </div>
      
      <div class="stats">
        <div class="stat">
          <span class="label">Max</span>
          <span class="value">{{ maxAlt.toFixed(1) }}</span>
        </div>
        <div class="stat">
          <span class="label">Min</span>
          <span class="value">{{ minAlt.toFixed(1) }}</span>
        </div>
        <div class="stat">
          <span class="label">Avg</span>
          <span class="value">{{ avgAlt.toFixed(1) }}</span>
        </div>
        <div class="stat">
          <span class="label">Range</span>
          <span class="value">{{ altRange.toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const loading = ref(true);
const chartData = ref([]);
let altitudeChart = null;
let unsubscribe = null;

const props = defineProps({
  dataLimit: {
    type: Number,
    default: 50
  }
});

const maxAlt = computed(() => {
  if (chartData.value.length === 0) return 0;
  return Math.max(...chartData.value.map(d => d.altitude));
});

const minAlt = computed(() => {
  if (chartData.value.length === 0) return 0;
  return Math.min(...chartData.value.map(d => d.altitude));
});

const altRange = computed(() => maxAlt.value - minAlt.value);

const avgAlt = computed(() => {
  if (chartData.value.length === 0) return 0;
  const sum = chartData.value.reduce((acc, d) => acc + d.altitude, 0);
  return sum / chartData.value.length;
});

async function loadChartData() {
  loading.value = true;
  
  const q = query(
    collection(db, 'iss_location'),
    orderBy('createdAt', 'asc'),
    limit(props.dataLimit)
  );
  
  const snapshot = await getDocs(q);
  chartData.value = [];
  
  snapshot.forEach(doc => {
    const data = doc.data();
    chartData.value.push({
      time: data.createdAt ? new Date(data.createdAt * 1000) : new Date(data.timestamp * 1000),
      altitude: data.altitude
    });
  });
  
  loading.value = false;
}

function setupRealTimeUpdates() {
  const q = query(
    collection(db, 'iss_location'),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  
  unsubscribe = onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const newData = snapshot.docs[0].data();
      
      chartData.value.push({
        time: newData.createdAt ? new Date(newData.createdAt * 1000) : new Date(newData.timestamp * 1000),
        altitude: newData.altitude
      });
      
      if (chartData.value.length > props.dataLimit) {
        chartData.value.shift();
      }
      
      updateChart();
    }
  });
}

function createChart() {
  const ctx = document.getElementById('altitudeChart');
  if (!ctx || chartData.value.length === 0) return;
  
  if (altitudeChart) altitudeChart.destroy();
  
  altitudeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.value.map(d => d.time.toLocaleTimeString()),
      datasets: [{
        label: 'Altitude',
        data: chartData.value.map(d => d.altitude),
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: '#60a5fa',
        pointBorderColor: '#1e293b',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          padding: 10,
          displayColors: false,
          callbacks: {
            label: (context) => `${context.parsed.y.toFixed(2)} km`
          }
        }
      },
      scales: {
        x: {
          display: true,
          ticks: {
            maxTicksLimit: 6,
            color: '#64748b',
            font: { size: 10 }
          },
          grid: { display: false }
        },
        y: {
          display: true,
          ticks: {
            color: '#64748b',
            font: { size: 10 },
            callback: (value) => value.toFixed(0) + ' km'
          },
          grid: { color: 'rgba(100, 116, 139, 0.1)' }
        }
      }
    }
  });
}

function updateChart() {
  if (!altitudeChart) return;
  
  altitudeChart.data.labels = chartData.value.map(d => d.time.toLocaleTimeString());
  altitudeChart.data.datasets[0].data = chartData.value.map(d => d.altitude);
  altitudeChart.update('active');
}

onMounted(async () => {
  await loadChartData();
  setTimeout(() => {
    createChart();
    setupRealTimeUpdates();
  }, 100);
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
  if (altitudeChart) altitudeChart.destroy();
});
</script>

<style scoped>
.altitude-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow: hidden;  /* ✅ Added */
}

.loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.9rem;
}

.chart-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.75rem;  /* ✅ Reduced from 1rem */
  overflow: hidden;  /* ✅ Added */
}

.chart-wrapper {
  flex: 1;
  min-height: 0;
  max-height: calc(100% - 90px);  /* ✅ Reserve space for stats */
  position: relative;
  overflow: hidden;  /* ✅ Added */
}

#altitudeChart {
  width: 100% !important;
  height: 100% !important;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;  /* ✅ Reduced from 0.75rem */
  margin-top: 0.75rem;  /* ✅ Reduced from 1rem */
  padding-top: 0.75rem;  /* ✅ Reduced from 1rem */
  border-top: 1px solid rgba(99, 102, 241, 0.15);
  flex-shrink: 0;  /* ✅ Prevent stats from shrinking */
  height: 70px;  /* ✅ Fixed height for stats */
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;  /* ✅ Reduced from 0.25rem */
  padding: 0.4rem;  /* ✅ Reduced from 0.5rem */
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 6px;
}

.stat .label {
  font-size: 0.65rem;  /* ✅ Reduced from 0.7rem */
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
}

.stat .value {
  font-size: 0.95rem;  /* ✅ Reduced from 1rem */
  color: #60a5fa;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.stat .value::after {
  content: ' km';
  font-size: 0.65rem;  /* ✅ Reduced from 0.7rem */
  color: #64748b;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4rem;
    height: auto;  /* ✅ Auto height on mobile */
  }
  
  .stat {
    padding: 0.3rem;
  }
  
  .stat .value {
    font-size: 0.85rem;
  }
}
</style>