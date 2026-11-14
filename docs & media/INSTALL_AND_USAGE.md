# E-mergency App — Android APK Build, Install & Usage Guide

**Course:** Mobile Application Technology — Final Case Study  
**App Name / Package ID:** `E-mergency App` / `com.emergency.app`  
**Group Members:** Gregorio, Maricar F. · Marcelo, Ana Leah D. · Olinares III, Jose A. · Villamia, Beatriz D.

---

## 1. Building the Installable Android `.apk`

### Prerequisites
- Node.js (LTS) & `pnpm`
- Android Studio with Android SDK Platform & Build-Tools installed

### Build Steps
1. Install dependencies (if moving or cloning fresh):
   ```powershell
   pnpm install
   ```
2. Build the production Angular/Ionic web bundle into `www/`:
   ```powershell
   pnpm run build
   ```
3. Sync web assets and Capacitor plugins into `android/`:
   ```powershell
   pnpm exec cap sync android
   ```
4. Open the Android project in Android Studio:
   ```powershell
   pnpm exec cap open android
   ```
5. Wait for Gradle sync to finish in Android Studio, then select:
   **Build > Build Bundle(s) / APK(s) > Build APK(s)**
6. When the build completes, click **locate** in Android Studio's notification banner (or open `android/app/build/outputs/apk/debug/app-debug.apk`).

---

## 2. Installing the `.apk` on an Android Device

1. Copy `app-debug.apk` to your Android phone (via USB, Google Drive, or ADB: `adb install android/app/build/outputs/apk/debug/app-debug.apk`).
2. Tap the `.apk` file on your Android device. If prompted, enable **Install unknown apps** for your file manager/browser.
3. Open **E-mergency App** from your home screen or app drawer.
4. When prompted on first use, tap **Allow** for:
   - **Location (`ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`)** — required to acquire your GPS coordinates and pin your location on the map.
   - **Notifications (`POST_NOTIFICATIONS`)** — required for the Admin Monitor local notification alert on Android 13+.

---

## 3. Usage Guide

### A. Sending an Emergency Alert (SOS Tab — Default Screen)
1. **No Login Required:** The app opens directly onto the **SOS** tab so anyone can report an emergency immediately.
2. **Wait for GPS Fix:** The app automatically requests your GPS location, displays a pulsing red pin with an accuracy radius on the Leaflet map, and resolves the street address via OpenStreetMap Nominatim (`Refresh` updates the fix anytime).
3. **Select Category & Optional Note:** Tap one of **Medical**, **Fire**, **Accident**, **Security**, or **General**, and optionally enter a short landmark/floor note.
4. **Press `SOS — CALL 911`:**
   - A cancelable countdown starts (`5s` default; configurable to `3s`, `5s`, or `10s` in **Settings**) with haptic pulses every second.
   - Tap **CANCEL SOS** before zero to abort without logging or dialing.
   - Once the countdown reaches zero:
     - The alert is saved locally (`@capacitor/preferences`).
     - A local Admin notification fires.
     - An **Emergency Output Sent** card appears with **Copy Summary** and **Open Map** buttons.
     - **Safe Test Mode (ON by default)** blocks dialing real `911`.

### B. Reviewing & Managing Alerts (Admin Tab)
1. Tap the **Admin** tab (shows a red badge count of `Active` alerts).
2. Filter alerts by **All**, **Active**, **Ack** (`Acknowledged`), or **Done** (`Resolved`).
3. Tap any alert card to inspect its GPS pin, street address, coordinates, call mode, and caller note on the Leaflet map.
4. Tap **Acknowledge** or **Mark Resolved** to update its status.

### C. Configuring Safety & Demo Controls (Settings Tab)
- **Safe Test Mode:** Keep **ON** during classroom testing and video recording so real `911` is never dialed. Toggle **OFF** only if intentionally testing live `tel:911` dialer launch.
- **Accidental-Press Countdown:** Choose `3 seconds`, `5 seconds`, or `10 seconds`.
- **Clear Local Alert Logs:** Removes stored test alerts from device storage.

