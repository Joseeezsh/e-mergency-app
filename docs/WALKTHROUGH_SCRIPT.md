# E-mergency App — 8–12 Minute Video Walkthrough & Code Script

**Target Duration:** ~10 minutes (within 8–12 min requirement)  
**App:** E-mergency App (`com.emergency.app`)  
**Presenters:** Gregorio, Maricar F. · Marcelo, Ana Leah D. · Olinares III, Jose A. · Villamia, Beatriz D.

> **Pre-Recording Checklist:**  
> - Confirm **Safe Test Mode** is **ON** in the **Settings** tab (yellow `SAFE TEST` badge visible in the SOS header).  
> - Ensure device/emulator GPS is enabled (or set a mock location in Android Emulator Extended Controls).  
> - Clear old test alerts in **Settings** before starting if you want a clean Admin Monitor demo.

---

## Segment 1: Introduction & Problem Statement (0:00 – 1:30)
**Suggested Speaker:** Gregorio, Maricar F.

- **Show:** Title slide / README or open app landing immediately on the **SOS** screen.
- **Talking Points:**
  - Introduce the project: **E-mergency App (Electronic Emergency)**, built with **Ionic 9**, **Angular 22**, **Capacitor 8**, and **Leaflet**.
  - Explain the core problem: during medical, fire, security, or traffic emergencies, callers often panic, lose time navigating login/registration screens, or struggle to describe their exact street address to responders.
  - Explain our key UX decision: **Zero login or account barrier**. The app opens directly on the **SOS** tab, automatically acquires GPS coordinates, renders an interactive map, and reverse-geocodes the street address immediately.

---

## Segment 2: Live App Demo — SOS, Cancel Guard, Output Card, Admin & Settings (1:30 – 5:30)
**Suggested Speaker:** Marcelo, Ana Leah D.

1. **Live Geolocation & Map (1:30 – 2:15):**
   - Point out the `SAFE TEST` badge in the toolbar, the Leaflet map with the pulsing red pin (`.emergency-pin-dot`) and red accuracy radius circle, and the resolved OpenStreetMap street address + coordinates (`lat`, `lng`, `±accuracy m`).
   - Tap **Refresh** to demonstrate live re-acquisition.
2. **Accidental-Press Guard Demo (2:15 – 3:00):**
   - Select **Medical**, type a quick note (e.g., `"Main building 2nd floor"`), and tap **SOS — CALL 911 (5s GUARD)**.
   - Show the live countdown card with haptic tick feedback and tap **CANCEL SOS** before it finishes.
   - Point out the toast confirmation: *"SOS canceled. No alert or call was sent."*
3. **Full Dispatch in Safe Test Mode (3:00 – 4:00):**
   - Switch category to **Fire**, tap **SOS — CALL 911**, and let the countdown reach zero.
   - Show the **local notification** appearing on the device and the **Emergency Output Sent** card showing `911 (BLOCKED - Safe Test Mode)`, address, coordinates, timestamp, **Copy Summary**, and **Open Map**.
4. **Admin Monitor & Settings Demo (4:00 – 5:30):**
   - Point out the red `1` badge on the **Admin** tab and switch to **Admin Monitor**.
   - Show the Leaflet alert inspector map, status filter chips (**All / Active / Ack / Done**), and tap **Acknowledge**, then **Mark Resolved**, noting how the badge updates reactively via Angular Signals.
   - Switch to **Settings & Info**: show **Safe Test Mode**, change **Accidental-Press Countdown** (`3s / 5s / 10s`), show **Clear Local Alert Logs**, and highlight the group member credits.

---

## Segment 3: Technical Architecture & Code Walkthrough (5:30 – 9:30)
**Suggested Speaker:** Olinares III, Jose A.

Briefly show the folder structure (`models/`, `services/`, `components/emergency-map/`, `pages/sos|admin|settings/`) and highlight **3 key code snippets**:

### Snippet 1: Cancelable Countdown & Safe Dispatch (`src/app/pages/sos/sos.page.ts` + `src/app/services/emergency-dispatch.service.ts`)
- **Open:** `src/app/pages/sos/sos.page.ts` (`startSosCountdown`, `cancelSosCountdown`) and `src/app/services/emergency-dispatch.service.ts` (`dispatchEmergency`).
- **Explain:**
  - `startSosCountdown()` reads `countdownSeconds` from reactive Angular Signals (`this.store.settings()`), triggers `Haptics.impact({ style: ImpactStyle.Medium })` every second, and clears the interval cleanly if the user taps **Cancel SOS** or navigates away (`ngOnDestroy`).
  - `dispatchEmergency()` persists the alert locally, schedules a Capacitor `LocalNotifications` alert, and checks `safeTestMode` before opening `tel:911` — ensuring real `911` is never dialed accidentally during testing or demos.

### Snippet 2: `HttpClient` GET Reverse Geocoding with Offline Fallback (`src/app/services/geocoding.service.ts`)
- **Open:** `src/app/services/geocoding.service.ts`.
- **Explain:**
  - Uses Angular's `HttpClient.get<NominatimResponse>(url)` (configured via `provideHttpClient()` in `src/main.ts`) to query OpenStreetMap Nominatim without requiring any API key or secret.
  - Pipes `timeout(6000)`, extracts `display_name`, and uses `catchError` to fall back gracefully to `GPS lat, lng (Address unavailable offline)` if the device has no internet connection.

### Snippet 3: Signal-Based Local Persistence (`src/app/services/emergency-store.service.ts`)
- **Open:** `src/app/services/emergency-store.service.ts`.
- **Explain:**
  - Uses Angular `signal()` and `computed()` (`activeCount`) backed by `@capacitor/preferences` so alerts and settings persist across app restarts without an external database.
  - Explain why this fits single-device demonstration and what a production backend would add next.

---

## Segment 4: Testing, Limitations & Closing (9:30 – 11:00)
**Suggested Speaker:** Villamia, Beatriz D.

- **Show:** Test results (`pnpm run lint`, `pnpm run test:unit`, `pnpm run test:e2e`, `pnpm run build`, and `AndroidManifest.xml` permissions).
- **Talking Points:**
  - Summarize verified behaviors: zero-login launch, GPS permission handling, Nominatim `HttpClient` GET + offline fallback, countdown cancellation, Safe Test Mode blocking `tel:911`, and Admin status transitions.
  - Honestly state the architectural limitation: because `@capacitor/preferences` is local on-device storage, SOS alerts and Admin Monitor run on the same device rather than across separate caller/dispatcher devices.
  - Conclude with the natural future upgrade: connecting `EmergencyStoreService` and `EmergencyDispatchService` to a cloud database + real-time push relay (e.g., Firebase Firestore + FCM) while preserving the zero-account emergency UX.

