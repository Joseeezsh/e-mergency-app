# E-mergency App (Electronic Emergency) — Final Case Study Report

**Course:** Mobile Application Technology — Final Case Study  
**App Name / Package ID:** `E-mergency App` / `com.emergency.app`  
**Tech Stack:** Ionic 9 · Angular 22 (Standalone Components) · Capacitor 8 · Leaflet  
**Group Members:** Gregorio, Maricar F. · Marcelo, Ana Leah D. · Olinares III, Jose A. · Villamia, Beatriz D.

---

## 1. Problem Statement & Proposed Solution

### Problem
During sudden medical, fire, vehicular, or personal security emergencies, individuals face two major barriers with traditional incident-reporting applications:
1. **Authentication friction:** Mandatory sign-up or login screens cost critical seconds during emergencies.
2. **Location ambiguity:** Panicked callers often cannot identify or communicate their exact street address or coordinates quickly.
3. **Accidental triggers:** Single-tap SOS buttons without a confirmation guard can cause unintended calls to emergency services (`911`).

### Solution
**E-mergency App** eliminates login barriers by launching directly onto the **SOS** screen, acquiring live GPS coordinates via `@capacitor/geolocation`, rendering the caller's exact location and accuracy circle on an interactive **Leaflet** map, and reverse-geocoding the street address via OpenStreetMap Nominatim (`HttpClient` `GET`). Pressing **SOS — CALL 911** triggers a cancelable countdown guard (`5s` default, configurable to `3s` / `5s` / `10s`) with haptic pulses and a **CANCEL SOS** button. **Safe Test Mode** is enabled by default so testing and video walkthroughs never dial real `911` while still logging alerts, firing local Admin notifications, and displaying the Emergency Output Card.

---

## 2. Core Features

- **User SOS Tab (`/tabs/sos`):**
  - Zero-account immediate access on app launch.
  - Live Leaflet map with pulsing pin (`.emergency-pin-dot`) and GPS accuracy radius circle.
  - Emergency category chips (`Medical`, `Fire`, `Accident`, `Security`, `General`) and optional note input.
  - Cancelable countdown guard with haptic pulses (`@capacitor/haptics`).
  - **Emergency Output Sent** card with **Copy Summary** and **Open Map** actions.
- **Admin Monitor Tab (`/tabs/admin`):**
  - Tab badge showing live count of `Active` alerts via Angular Signals.
  - Status filters (`All`, `Active`, `Ack`, `Done`).
  - Interactive Leaflet inspector map for any selected alert.
  - **Acknowledge** and **Mark Resolved** actions with resolution timestamp.
- **Settings & Info Tab (`/tabs/settings`):**
  - **Safe Test Mode** toggle (ON by default).
  - **Accidental-Press Countdown** selector (`3s`, `5s`, `10s`).
  - **Clear Local Alert Logs** control and group member credits.

---

## 3. Technical Implementation

| File / Module | Responsibility |
| :--- | :--- |
| `src/app/models/emergency.model.ts` | Defines `EmergencyAlert`, `GeoLocationFix`, `AppSettings`, `EmergencyCategory`, and `AlertStatus`. |
| `src/app/services/location.service.ts` | Handles native Capacitor Geolocation permission checks/requests and GPS acquisition. |
| `src/app/services/geocoding.service.ts` | Executes Angular `HttpClient` `GET` to OpenStreetMap Nominatim with 6s timeout and offline fallback. |
| `src/app/services/emergency-store.service.ts` | Persists alerts and settings in `@capacitor/preferences` and exposes Angular Signals (`alerts`, `settings`, `activeCount`). |
| `src/app/services/emergency-dispatch.service.ts` | Orchestrates Haptics, local persistence, `@capacitor/local-notifications`, and Safe Test Mode / `tel:911` handoff. |
| `src/app/components/emergency-map/emergency-map.component.ts` | Shared Leaflet map component used by both SOS and Admin Inspector views. |
| `android/app/src/main/AndroidManifest.xml` | Declares `INTERNET`, `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`, `POST_NOTIFICATIONS`, and `VIBRATE`. |

---

## 4. Testing, Limitations & Future Improvements

| Verification Item | Command / Method | Result |
| :--- | :--- | :--- |
| TypeScript & Production Build | `pnpm exec tsc --noEmit -p tsconfig.app.json` & `pnpm run build` | Passed |
| Lint & Formatting | `pnpm run lint` (ESLint `--max-warnings 0`, E2E `tsc`, Prettier) | Passed |
| Unit Tests | `pnpm run test:unit` (Vitest, 8 spec files, 14 tests) | Passed |
| End-to-End Mobile Chrome | `e2e/app.spec.ts` (Playwright Pixel 7 profile, system Chrome) | Passed (1/1 full workflow) |
| Capacitor Android Sync | `pnpm exec cap sync android` | Passed (4 Capacitor plugins synced) |
| Android Device / APK | Android Studio APK build & physical device run | Pending final on-device run |

> **Single-Device Limitation & Future Improvement:**  
> Because the prototype uses `@capacitor/preferences` (on-device local storage) with no external database or secret credentials, the SOS caller and Admin Monitor operate on the same device. For production multi-device dispatch, `EmergencyStoreService` and `EmergencyDispatchService` can be connected to a cloud backend (such as Firebase Firestore + Firebase Cloud Messaging) while retaining the zero-login caller experience.

---

## 5. AI Usage Disclosure

AI coding assistance was used to help scaffold Ionic/Angular standalone components, Leaflet integration, Vitest/Playwright test suites, lint fixes, and case study documentation drafts. All design decisions, safety guards, code verification, and testing outputs were reviewed and validated by the group members.
