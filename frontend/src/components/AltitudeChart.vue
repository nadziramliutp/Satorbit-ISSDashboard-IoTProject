<template>
  <VaCard class="altitude-chart-card">
    <VaCardTitle class="card-title-wrapper">
      <h1 class="card-title">
        📈 Altitude Changes Over Time
      </h1>
      <span class="data-points">{{ dataPoints }} data points</span>
    </VaCardTitle>
    
    <VaCardContent>
      <div v-if="loading" class="loading">
        Loading chart data...
      </div>
      
      <div v-else class="chart-container">
        <canvas id="altitudeChart"></canvas>
      </div>
      
      <div class="chart-stats">
        <div class="stat-item">
          <span class="stat-label">Max:</span>
          <span class="stat-value">{{ maxAlt.toFixed(2) }} km</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Min:</span>
          <span class="stat-value">{{ minAlt.toFixed(2) }} km</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Range:</span>
          <span class="stat-value">{{ altRange.toFixed(2) }} km</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Avg:</span>
          <span class="stat-value">{{ avgAlt.toFixed(2) }} km</span>
        </div>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const loading = ref(true);
const chartData = ref([]);
let altitudeChart = null;

// Props - make it flexible
const props = defineProps({
  dataLimit: {
    type: Number,
    default: 50  // Show last 50 points by default
  }
});

// Computed stats
const dataPoints = computed(() => chartData.value.length);

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

// Load data
async function loadChartData() {
  loading.value = true;
  
  const q = query(
    collection(db, 'iss_location'),
    orderBy('createdAt', 'asc'),  // Oldest first for chronological chart
    limit(props.dataLimit)
  );
  
  const snapshot = await getDocs(q);
  chartData.value = [];
  
  snapshot.forEach(doc => {
    const data = doc.data();
    chartData.value.push({
      time: data.createdAt ? new Date(data.createdAt * 1000) : new Date(data.timestamp * 1000),
      altitude: data.altitude,
      latitude: data.latitude,
      longitude: data.longitude
    });
  });
  
  loading.value = false;
  
  console.log(`📈 Loaded ${chartData.value.length} points for chart`);
}

// Create chart
function createChart() {
  const ctx = document.getElementById('altitudeChart');
  
  if (!ctx || chartData.value.length === 0) return;
  
  // Prepare data
  const labels = chartData.value.map(d => d.time.toLocaleTimeString());
  const altitudes = chartData.value.map(d => d.altitude);
  
  // Destroy existing chart if any
  if (altitudeChart) {
    altitudeChart.destroy();
  }
  
  // Create new chart
  altitudeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Altitude (km)',
        data: altitudes,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 8,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `Altitude: ${context.parsed.y.toFixed(2)} km`;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          ticks: {
            maxTicksLimit: 6,
            color: '#6b7280',
            font: {
              size: 10
            }
          },
          grid: {
            display: false,
          }
        },
        y: {
          display: true,
          ticks: {
            color: '#6b7280',
            font: {
              size: 10
            },
            callback: function(value) {
              return value.toFixed(0) + 'km';
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });
}

onMounted(async () => {
  await loadChartData();
  
  setTimeout(() => {
    createChart();
  }, 100);
});
</script>
<style scoped>
.altitude-chart-card {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  min-height: 0;
}

.card-title-wrapper {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.5rem 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.card-title {
  margin: 0;
  font-size: 0.85rem;
  color: #1e293b;
  font-weight: 600;
}

.data-points {
  font-size: 0.7rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.loading {
  text-align: center;
  padding: 1rem;
  color: #64748b;
  font-size: 0.8rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  padding: 0.5rem;
  flex: 1;
  height: 200px;
  min-height: 120px;
  position: relative;
}

#altitudeChart {
  width: 100% !important;
  height: 100% !important;
}

.chart-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 0.9rem;
  color: #3b82f6;
  font-weight: 600;
}

@media (max-width: 768px) {
  .card-title-wrapper {
    padding: 0.4rem 0.5rem;
  }
  
  .chart-container {
    padding: 0.3rem;
    height: 100px;
    min-height: 100px;
  }
  
  .chart-stats {
    padding: 0.6rem;
    gap: 0.4rem;
  }
  
  .stat-item {
    padding: 2rem 0;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .stat-value {
    font-size: 0.85rem;
  }
}
</style>