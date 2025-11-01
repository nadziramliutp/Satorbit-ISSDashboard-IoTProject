# TFB2093 - Internet of Things: 2nd Year 2nd Semester

## ISS Tracker Dashboard - Real-Time Telemetry Monitoring System

This is a real-time IoT dashboard built with **Vue.js** and **Node.js** that tracks the International Space Station (ISS) position, collecting telemetry data every 60 seconds and visualizing it on an interactive dashboard with live updates.

🎥 **[Click here for demo on Youtube](#)** *(Add your video link)*

---

## 👥 Group Members

| Name | Student ID |
|------|------------|
| NADZIRA BINTI RAMLI | 22010431 |
| JASHBINDAR SINGH | 2200XXX |
| NURHUMAIRA NOORHIDAYAT | 22010451 |
| ETHAN LEE | 2201XXXX |

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
