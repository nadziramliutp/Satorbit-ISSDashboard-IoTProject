<script setup>
import { ref, onMounted } from 'vue'
import CurrentPosition from '../components/CurrentPosition.vue'
import DataTable from '../components/DataTable.vue'
import Map from '../components/Map.vue'
import Altitude from '@/components/AltitudeChart.vue'
</script>

<template>
  <div class="dashboard-container">
    <!-- 🌙 MODERN DARK HEADER -->
    <header class="header">
      <div class="header-content">
        <div class="header-main">
          <div class="title-section">
            <div class="title-wrapper">
              <span class="satellite-icon">🛰️</span>
              <h1 class="project-title">ISS Tracker</h1>
              <span class="live-badge">
                <span class="live-dot"></span>
                LIVE
              </span>
            </div>
            <div class="title-underline"></div>
          </div>
          <div class="header-details">
            <div class="detail-item">
              <span class="detail-icon">📚</span>
              <div class="detail-content">
                <span class="detail-label">Course</span>
                <span class="detail-value">TFB 2093 – Internet of Things</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📅</span>
              <div class="detail-content">
                <span class="detail-label">Semester</span>
                <span class="detail-value">September 2025</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon">👨‍🏫</span>
              <div class="detail-content">
                <span class="detail-label">Lecturer</span>
                <span class="detail-value">Dr. Ooi Boon Yaik</span>
              </div>
            </div>
          </div>
        </div>
        <div class="group-section">
          <div class="group-members">
            <div class="members-header">
              <span class="team-icon">👥</span>
              <span class="members-label">Project Team</span>
            </div>
            <div class="members-list">
              <span class="member-name">NADZIRA RAMLI</span>
              <span class="member-id">22010431</span>
              <span class="member-name">JASHBINDAR SINGH</span>
              <span class="member-id">22010432</span>
              <span class="member-name">NURHUMAIRA</span>
              <span class="member-id">22010433</span>
              <span class="member-name">ETHAN LEE</span>
              <span class="member-id">22010434</span>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <main class="dashboard">
      <!-- Real-time Data -->
      <div class="section real-time-data">
        <div class="section-badge green">Real-Time</div>
        <CurrentPosition />
      </div>
      
      <!-- Map Visualization -->
      <div class="section visualization">
        <div class="section-badge blue">Live Tracking</div>
        <Map />
      </div>
      
      <!-- Data Table -->
      <div class="section historical-data">
        <div class="section-badge orange">Telemetry</div>
        <DataTable />
      </div>
      
      <!-- Altitude Chart -->
      <div class="section analytics">
        <div class="section-badge purple">Analytics</div>
        <Altitude />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 🌙 DARK THEME BASE */
.dashboard-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #0a0e1a;
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
}

/* 🎨 MODERN HEADER */
.header {
  flex-shrink: 0;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #1a1f35 0%, #0f1419 100%);
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    #6366f1 20%, 
    #8b5cf6 50%, 
    #6366f1 80%, 
    transparent 100%
  );
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1700px;
  margin: 0 auto;
  width: 100%;
  gap: 2rem;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

/* 🛰️ TITLE SECTION */
.title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.satellite-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.project-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.title-underline {
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, transparent);
  border-radius: 2px;
}

/* 📋 HEADER DETAILS */
.header-details {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.detail-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e5e7eb;
}

/* 👥 GROUP SECTION */
.group-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.group-members {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(139, 92, 246, 0.08);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(10px);
  min-width: 280px;
}

.members-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.team-icon {
  font-size: 1.2rem;
}

.members-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.members-list {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  align-items: center;
}

.member-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e5e7eb;
}

.member-id {
  font-size: 0.8rem;
  font-weight: 500;
  color: #9ca3af;
  padding: 0.25rem 0.5rem;
  background: rgba(190, 18, 60, 0.08);
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

/* 📊 DASHBOARD GRID */
.dashboard {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  max-width: 1700px;
  margin: 0 auto;
  overflow: hidden;
  height: calc(100vh - 160px);
  width: 100%;
}

/* 🎴 SECTION CARDS */
.section {
  display: flex;
  flex-direction: column;
  background: #151824;
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.15);
  padding: 0;
  overflow: hidden;
  min-height: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: all 0.3s ease;
}

.section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.section:hover::before {
  opacity: 1;
}

/* 🏷️ SECTION BADGES */
.section-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.section-badge.green {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.section-badge.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.section-badge.orange {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.section-badge.purple {
  background: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

/* 🎯 GRID PLACEMENT */
.real-time-data {
  grid-column: 1;
  grid-row: 1;
}

.real-time-data::before {
  background: linear-gradient(90deg, #10b981, transparent);
}

.visualization {
  grid-column: 2;
  grid-row: 1;
}

.visualization::before {
  background: linear-gradient(90deg, #3b82f6, transparent);
}

.historical-data {
  grid-column: 1;
  grid-row: 2;
}

.historical-data::before {
  background: linear-gradient(90deg, #f59e0b, transparent);
}

.analytics {
  grid-column: 2;
  grid-row: 2;
}

.analytics::before {
  background: linear-gradient(90deg, #8b5cf6, transparent);
}

/* 📱 RESPONSIVE DESIGN */
@media (max-width: 1024px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    gap: 0.75rem;
    padding: 0.75rem;
    height: calc(100vh - 180px);
  }
  
  .real-time-data,
  .visualization,
  .historical-data,
  .analytics {
    grid-column: 1;
  }
  
  .real-time-data { grid-row: 1; }
  .visualization { grid-row: 2; }
  .historical-data { grid-row: 3; }
  .analytics { grid-row: 4; }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .group-section {
    align-items: flex-start;
    width: 100%;
  }
  
  .group-members {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }
  
  .project-title {
    font-size: 1.5rem;
  }
  
  .header-details {
    gap: 1rem;
  }
  
  .section-badge {
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.65rem;
    padding: 0.3rem 0.6rem;
  }
}

@media (max-height: 700px) {
  .header {
    padding: 0.75rem 1rem;
  }
  
  .project-title {
    font-size: 1.35rem;
  }
  
  .dashboard {
    height: calc(100vh - 120px);
    gap: 0.75rem;
    padding: 0.75rem;
  }
}

/* 🎨 SCROLLBAR STYLING */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0a0e1a;
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}
</style>