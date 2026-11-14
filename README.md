# E-mergency App (Electronic Emergency)

> **Mobile Application Technology — Final Case Study**  
> **Package ID:** `com.emergency.app`  
> **Tech Stack:** Ionic 9 · Angular 22 · Capacitor 8 · Leaflet · Supabase Realtime  

### 👥 Authors & Presentation Roles
* **Jose A. Olinares III** — Project Lead & System Architecture (*Presentation Part 1: Intro & Problem Statement*)
* **Maricar F. Gregorio** — Citizen Experience & Dispatch Flow (*Presentation Part 2: Citizen SOS Live Walkthrough*)
* **Ana Leah D. Marcelo** — Admin Portal & Cloud Integration (*Presentation Part 3: Dispatcher Portal & Real-Time Sync*)
* **Beatriz D. Villamia** — Quality Assurance, Testing & Evaluation (*Presentation Part 4: Testing, Limitations & AI Disclosure*)

---

## 🚨 Overview
**E-mergency App** is a zero-barrier, geolocation-assisted emergency reporting and tactical dispatch system built with Ionic, Angular standalone components, Capacitor, and Supabase. 

It eliminates traditional emergency reporting bottlenecks — panic, account creation friction, lack of coordinates, and responder blindness — by providing instant high-precision GPS positioning, scene photo intelligence, synthesized iPhone-style countdown audio, direct 911 telephony, and a secured cloud dispatcher monitor with real-time multi-device sync.

```
[ Citizen Phone A ]                             [ Admin Phone B / PC ]
   (Presses SOS)                                 (Dispatcher Monitor)
        │                                                 ▲
        ▼                                                 │
 1. GPS + Photo Captured                                 │
 2. Direct 911 Dialer opens                               │
 3. Dispatches payload ───────────────────────────┐       │
                                                  ▼       │ Real-time
                                        [ Supabase Cloud DB ] 
                                        Table: `emergencies`
                                        RLS: Anon INSERT / Admin READ
                                                  │
                                                  ▼
                                        Push alert & pin to
                                        Admin Leaflet Map!
```

---

## ✨ Core Features

### 1. Citizen Interface (Clean 2-Tab Navigation)
* **Zero-Barrier Emergency Access (`/tabs/sos`):** Opens immediately to emergency controls with no sign-up or login required.
* **Live GPS & Interactive Leaflet Map:** Auto-acquires device GPS via `@capacitor/geolocation` and reverse-geocodes street addresses via OpenStreetMap Nominatim.
* **Proactive Permission Notice:** Upfront diagnostic card detecting device Location Services (GPS hardware toggle) and Notifications permissions.
* **Scene Photo Evidence:** Native camera snapshot or gallery upload via `@capacitor/camera` with automatic client-side JPEG compression (max 800px) to conserve mobile data.
* **Instant 911 Call Button:** Direct 1-tap phone dialer bypass (`tel:911`) for immediate voice communication without waiting for countdowns.
* **Acoustic & Haptic Accidental Guard:** 5-second countdown with synthesized iPhone-style warning beeps (via Web Audio API) and haptic pulses, paired with a prominent **CANCEL SOS** button.
* **Emergency Hotlines Directory (`/tabs/settings`):** 1-tap direct dials for National Emergency (`911`), Philippine Red Cross (`143`), PNP (`117`), and Bureau of Fire Protection (`(02) 8426-0219`).

### 2. Guarded Dispatcher & Admin Portal (`/admin`)
* **Separated Administrative Access:** Administrative monitoring is removed from the public citizen tabs and guarded by Angular's functional `adminAuthGuard`.
* **Preset Evaluator Authentication (`/admin/login`):**
  * **Email/Username:** `admin@emergency.ph` (also accepts `admin`)
  * **Password:** `Emergency2026!` (also accepts `admin123`)
  * **1-Tap Quick Fill Button:** Populates evaluator credentials instantly on mobile screens.
* **Real-Time Cross-Device Synchronization:** Powered by **Supabase Realtime** (`postgres_changes` WebSockets). When a citizen dispatches an alert on Phone A, Phone B (Admin) chimes, plots the victim on the Leaflet map, and renders the scene photo in real time without refreshing.
* **Incident Lifecycle Management:** Filter and manage alerts through **Active**, **Acknowledged**, and **Resolved** states with resolution timestamps.

### 3. Demo Safety & Audio Synthesis
* **Safe Test Mode (ON by Default):** Intercepts real-world 911 dialing during testing and recordings while running 100% of GPS acquisition, audio feedback, photo uploads, and cloud dispatching.
* **Procedural Web Audio API:** Synthesizes dual-frequency square-wave audio ramps locally — 100% offline with zero external audio file dependencies.

---

## 🛠️ Prerequisites
* **Node.js** (v20+ recommended) & **pnpm** (v10+ / v11+)
* **Google Chrome** or modern Chromium browser (for desktop testing)
* **Android Studio** & Android SDK (for building the Android APK)

---

## 🚀 Quick Start & Commands

### 1. Install Dependencies
```powershell
pnpm install
```

### 2. Run Local Development Server
```powershell
pnpm start
# App opens at http://localhost:4200
```
* **Citizen View:** `http://localhost:4200/tabs/sos` (Press `F12` ➡️ Toggle Device Toolbar for mobile view).
* **Dispatcher Portal:** `http://localhost:4200/admin/login` (Use the orange Quick Fill button).

### 3. Build & Sync for Android
```powershell
pnpm run build
pnpm exec cap sync android
pnpm exec cap open android
```
In Android Studio:
1. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Locate the `.apk` in `android/app/build/outputs/apk/debug/app-debug.apk` and install it on your physical Android device.

---

## ☁️ Supabase Cloud Database Setup
The app connects to Supabase via `@supabase/supabase-js` configured in `src/environments/environment.ts`.

To initialize the backend table in your Supabase SQL Editor:
```sql
create table public.emergencies (
  id text primary key,
  category text not null,
  note text,
  lat double precision not null,
  lng double precision not null,
  accuracy double precision,
  address text,
  status text default 'Active',
  call_mode text,
  dialed_number text,
  photo_data_url text,
  created_at timestamptz default now()
);

alter table public.emergencies enable row level security;
create policy "Allow insert" on public.emergencies for insert with check (true);
create policy "Allow select" on public.emergencies for select using (true);
create policy "Allow update" on public.emergencies for update using (true);
alter publication supabase_realtime add table public.emergencies;
```

---

## 📁 Project Architecture & Key Files

```
e-mergency-app/
├── android/                             # Native Android Studio project
├── docs/                                # Case study submission documents
│   ├── E-mergency_App_Case_Study_Report.pdf  # Final compiled 3-page Case Study PDF
│   ├── CASE_STUDY_REPORT.html          # Printable case study HTML
│   ├── CASE_STUDY_REPORT.md            # Markdown case study report
│   ├── PRESENTATION_WALKTHROUGH_SCRIPT.md # 8-12 min video recording script (4 parts)
│   ├── CANVA_AI_SLIDES_PROMPT.md       # Canva AI prompt & 12-slide media blueprint
│   └── INSTALL_AND_USAGE.md            # Detailed installation and test run manual
├── src/
│   ├── app/
│   │   ├── components/emergency-map/   # Reusable Leaflet map component
│   │   ├── guards/admin-auth.guard.ts  # Route guard protecting Admin dashboard
│   │   ├── models/emergency.model.ts   # Strongly typed interfaces & defaults
│   │   ├── pages/
│   │   │   ├── admin/                  # Dispatcher Incident Monitor & Leaflet inspector
│   │   │   ├── admin-login/            # Dispatcher login with Evaluator Quick-Fill
│   │   │   ├── settings/               # Safe Test Mode, audio toggles, & hotlines
│   │   │   └── sos/                    # Citizen emergency trigger, photo & GPS
│   │   ├── services/
│   │   │   ├── admin-auth.service.ts   # Preset credentials & session persistence
│   │   │   ├── emergency-dispatch.service.ts # Telephony, haptics, & notifications
│   │   │   ├── emergency-store.service.ts    # Hybrid local cache + Supabase sync
│   │   │   ├── geocoding.service.ts    # OpenStreetMap Nominatim reverse-geocoder
│   │   │   ├── location.service.ts     # Precise GPS & hardware status checks
│   │   │   ├── photo-capture.service.ts# Camera capture & Canvas JPEG compression
│   │   │   ├── sound-feedback.service.ts # Web Audio API iPhone-style audio beeps
│   │   │   └── supabase.service.ts     # Supabase Realtime client wrapper
│   │   ├── tabs/                       # Citizen 2-tab bottom navigation bar
│   │   └── app.routes.ts               # Top-level standalone routes
│   └── environments/                   # Supabase URL & publishable keys
```

---

## 🧪 Demonstration & Testing Walkthrough
1. **Permission Check:** On launch, grant Location and Notification permissions when prompted.
2. **Safe Test Mode:** Keep **Safe Test Mode** enabled in **Settings** during testing so real emergency hotlines are never dialed.
3. **Cancel Guard:** Tap **SOS**, observe the 5-second countdown with iPhone audio beeps, and tap **CANCEL SOS** to test accidental press abort.
4. **Photo & Dispatch:** Attach a photo, select an emergency category (*Medical, Fire, etc.*), let the countdown reach zero, and observe the emergency output card.
5. **Cross-Device Monitor:** Open the Dispatcher Portal on a computer (`/admin/dashboard`), and see the new incident pin and photo appear live via Supabase.
6. **Hotline Call:** In Settings, test calling the Philippine Red Cross (`143`) or PNP (`117`) to verify the phone dialer launch.

---

## 📜 Academic AI Usage Disclosure
In compliance with academic integrity guidelines, the team discloses that **Google DeepMind Antigravity / Gemini** was utilized as an AI pair-programmer for scaffolding Ionic standalone page structures, synthesizing Web Audio API mathematical oscillator frequencies, generating 74 Capacitor asset icon mipmaps, and structuring technical documentation drafts. All design decisions, requirement validations, database designs, and device testing were driven, evaluated, and verified by the student authors.
