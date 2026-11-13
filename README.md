# E-mergency App (Electronic Emergency)

Mobile Application Technology — Final Case Study  
**Group Members:** Gregorio, Maricar F. · Marcelo, Ana Leah D. · Olinares III, Jose A. · Villamia, Beatriz D.

## Overview
**E-mergency App** is a focused Ionic + Angular + Capacitor mobile application designed for rapid geolocation-assisted emergency reporting without requiring a user account or login.

- **Zero-Account Emergency Access:** Opens directly onto the **SOS** tab with live GPS acquisition and a **Leaflet** map.
- **Accidental-Press Countdown Guard:** Pressing **SOS — Call 911** starts a cancelable countdown (default `5s`) with haptic pulses before dispatching.
- **Safe Test Mode (ON by default):** Blocks accidental real `911` phone calls during testing and walkthrough recording while still logging the alert, firing an Admin local notification, and generating the Emergency Output Card.
- **HttpClient GET + Local Storage:** Reverse-geocodes coordinates via OpenStreetMap Nominatim (`HttpClient` `GET`) and persists alerts/settings locally via `@capacitor/preferences` (no external database or private API keys required).
- **Admin Monitor Tab:** Displays incoming SOS notifications/alerts, renders the caller's exact GPS pin on Leaflet, and lets Admin mark alerts as **Acknowledged** or **Resolved**.

## Prerequisites
- Node.js & `pnpm`
- Ionic CLI (`@ionic/cli`)
- Android Studio / Android SDK (for building the Android `.apk`)

## Setup & Commands
```bash
pnpm install
pnpm run start       # Preview in browser
pnpm run build       # Build production web bundle into www/
pnpm exec cap sync android
pnpm exec cap open android
```

In Android Studio, use **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate the installable Android `.apk`.

## Demo / Testing Notes
1. Grant Location and Notification permissions when prompted.
2. Keep **Safe Test Mode** enabled in **Settings** while testing or recording so real `911` is never dialed.
3. Test cancelling during the 5-second countdown, then let a countdown complete to verify the Emergency Output Card and the **Admin** tab alert inspector.

