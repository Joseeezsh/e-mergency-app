# Canva AI Presentation Deck Blueprint (100% Mapped to Script)

> **Based directly on:** `docs/PRESENTATION_WALKTHROUGH_SCRIPT.md`  
> **Course:** Mobile Application Technology — Final Case Study  
> **Project:** E-mergency App (`com.emergency.app`)  
> **Presenters:** Jose A. Olinares III · Maricar F. Gregorio · Ana Leah D. Marcelo · Beatriz D. Villamia  

---

## 🚀 How to Generate This in Canva with 100% Accuracy

### ⭐️ Recommended Method: Canva Docs ➡️ "Convert to Presentation" (Zero AI Errors)
1. Go to [canva.com](https://canva.com) and click **"Docs"** (or create a blank Canva Doc).
2. Copy and paste the entire **Section 2 ("Exact Slide-by-Slide Content")** below into your Canva Doc.
3. Click the **"Convert"** button at the top right of the Canva Doc ➡️ Click **"Get Started"**.
4. Choose your favorite dark tech presentation theme (Deep Navy / Red accent).
5. Canva will instantly generate all 12 slides with the exact headings, speaker badges, bullet points, and frame layouts!

---

## 1. Quick Master Prompt for Canva Magic Design
*(If using Canva's presentation prompt bar instead of Docs):*

```text
Create a 12-slide technology pitch deck for "E-mergency App: Electronic Emergency Reporting & Real-Time Tactical Dispatch System". 
Theme: Emergency response, civic tech, high-contrast dark UI. 
Colors: Dark Navy (#0F172A), Emergency Red (#DC2626), Electric Blue (#2563EB), White text (#FFFFFF). 
Include rounded card containers and dedicated picture/video/code placeholder frames on every slide. 
The presentation follows an exact 4-part case study script:
Part 1 (Jose): Problem of 911 friction & zero-barrier solution.
Part 2 (Maricar): Citizen app walkthrough, photo capture, direct 911 call, and 5s audio countdown.
Part 3 (Ana Leah): Guarded Dispatcher Portal, live Supabase real-time sync, and core code architecture.
Part 4 (Beatriz): Safe Test Mode, Android testing, limitations, SMS mesh roadmap, and academic AI disclosure.
```

---

## 2. Exact Slide-by-Slide Content & Media Inserters

Copy everything below into a **Canva Doc** and click **Convert ➡️ Presentation**:

---

# Slide 1: E-mergency App (Electronic Emergency)
## Speaker: Jose A. Olinares III | Overview & Architecture Lead

* **Course:** Mobile Application Technology — Final Case Study
* **Application ID:** `com.emergency.app`
* **Technology Stack:** Ionic 9 + Angular 22 + Capacitor 8 + Leaflet + Supabase Realtime
* **Project Team:**
  * **Jose A. Olinares III** (Lead & System Architecture)
  * **Maricar F. Gregorio** (Citizen Experience & Dispatch Flow)
  * **Ana Leah D. Marcelo** (Admin Portal & Cloud Integration)
  * **Beatriz D. Villamia** (Quality Assurance, Testing & Evaluation)

> **[FRAME: App Hero Emblem / Phone Mockup]**  
> *Insert: Official E-mergency App glowing emblem badge or 3D phone mockup showing the home screen.*

---

# Slide 2: The Critical Problem in 911 Reporting
## Speaker: Jose A. Olinares III | Part 1: Problem Statement

* **Every Second Counts:** Traditional voice-based 911 reporting suffers from critical points of human friction during life-threatening crises.
* **1. Panic & Disorientation:** Callers in shock struggle to articulate exact street numbers, building floors, or coordinates.
* **2. Account Sign-Up Friction:** Most reporting apps force users to register, confirm emails, or verify SMS OTPs before dispatching aid — completely unviable during cardiac arrest or fire.
* **3. Responder Blindness:** First responders arrive on-site with zero visual intelligence regarding road accessibility, fire intensity, or trauma severity.

> **[FRAME: Problem Comparison Infographic]**  
> *Insert: Infographic comparing "Traditional 911 Voice Delay (3–5 minutes)" vs. "E-mergency Instant Geolocation (1-Tap in 5 Seconds)".*

---

# Slide 3: The Proposed Solution: Zero-Barrier Philosophy
## Speaker: Jose A. Olinares III | Part 1: System Overview

* **Zero-Barrier Access:** No sign-up, no login required. Instant access to emergency controls upon opening.
* **Multi-Modal Dispatch:** Simultaneously captures high-accuracy GPS coordinates, reverse-geocoded street address, emergency category, and live photo evidence.
* **Audio-Tactile Protection:** Synthesized iPhone-style countdown beeps with a 5-second accidental cancel guard.
* **Direct 911 Telephony:** Built-in direct dialer bypass for immediate voice connection.
* **Guarded Cloud Dispatcher Portal:** Separate administrative command center powered by Supabase Realtime.

> **[FRAME: Architecture Flowchart Diagram]**  
> *Insert: Flowchart: [Citizen Phone] ➔ (GPS + Photo) ➔ [Supabase Cloud DB] ➔ [Admin Real-Time Leaflet Map].*

---

# Slide 4: Citizen Interface & Live Geolocation
## Speaker: Maricar F. Gregorio | Part 2: Citizen Walkthrough

* **Clean 2-Tab Navigation:** Public users only see citizen features: **SOS** and **Settings & Hotlines** (Admin controls removed from public view).
* **Upfront Permission Diagnostic Card:** Proactive status banner detecting Device GPS hardware, Location permission, and Notifications.
* **Live Interactive Leaflet Map:** Accurately pinpoints the user's position with pulsing marker, meter accuracy radius, and street address.
* **Zero Latency:** Coordinates initialize immediately upon app launch.

> **[FRAME: Video / Mobile Screen Recording (9:16 Phone)]**  
> *Insert: Video recording of app opening, permission chips turning green, and Leaflet map centering on location.*

---

# Slide 5: Multi-Modal Reporting & Instant 911 Calling
## Speaker: Maricar F. Gregorio | Part 2: Citizen Walkthrough

* **5 Emergency Categories:** Quick chips for *Medical, Fire, Accident, Security, and General* + optional landmark notes.
* **Real-Time Scene Photo Capture:**
  * Integrated `@capacitor/camera` allows instant snapshot or gallery upload.
  * Automatic on-device JPEG compression (max 800px) to conserve emergency mobile data.
* **Instant Phone Call — 911 Button:** Direct 1-tap dialer bypass (`tel:911`) for immediate voice contact without waiting for timer.
* **Emergency Hotlines Directory:** Quick-dial buttons for Philippine Red Cross (`143`), PNP (`117`), and Fire (`(02) 8426-0219`).

> **[FRAME: Dual Mobile Screenshot Mockups]**  
> *Insert: Left: Photo capture preview card with thumbnail. Right: Emergency Hotlines directory in Settings tab.*

---

# Slide 6: Audio-Tactile Feedback & Accidental Cancel Guard
## Speaker: Maricar F. Gregorio | Part 2: Citizen Walkthrough

* **Synthesized Web Audio API Sound:**
  * Procedurally generated dual-frequency square-wave beeps mimicking iPhone emergency beeps.
  * 100% offline — zero dependency on external audio files that could fail during network drops.
* **5-Second Accidental Cancel Guard:**
  * Giant high-contrast **CANCEL SOS** button to immediately abort accidental pocket presses.
* **Synchronized Haptics:** Tactile vibration pulses accompany each countdown second.
* **Post-Countdown Dispatch:** Automatically logs alert, notifies dispatchers, and opens native 911 dialer.

> **[FRAME: Video Clip (16:9 Player Frame)]**  
> *Insert: Short video clip of the red countdown card ticking down 5... 4... 3... 2... 1... with audible countdown beeps.*

---

# Slide 7: Guarded Dispatcher & Admin Portal
## Speaker: Ana Leah D. Marcelo | Part 3: Dispatcher Portal

* **Secured Route Gateway:** Administrative dashboard (`/admin/dashboard`) is protected by Angular's functional `adminAuthGuard`.
* **Preset Evaluator Authentication (`/admin/login`):**
  * Built-in credentials for evaluation: `admin@emergency.ph` / `Emergency2026!`.
  * **"Quick Fill (Evaluator Mode)" Button:** 1-tap autofill button eliminating mobile keyboard typing friction.
* **Session Persistence:** Session stored in `@capacitor/preferences` with a prominent **Exit / Logout** button.

> **[FRAME: Laptop / Phone Screenshot Frame]**  
> *Insert: Screenshot of `/admin/login` showing the orange Evaluator Quick-Fill card and Dispatcher sign-in form.*

---

# Slide 8: Real-Time Cross-Device Synchronization
## Speaker: Ana Leah D. Marcelo | Part 3: Dispatcher Portal

* **The Multi-Device Challenge:** Solves the multi-phone barrier — caller and dispatcher operate on completely separate devices.
* **Powered by Supabase Realtime:**
  * Phone A (Citizen) triggers SOS ➔ Row inserted into Supabase PostgreSQL `emergencies` table.
  * Phone B / PC (Dispatcher) receives instant `postgres_changes` WebSocket broadcast.
* **Tactical Leaflet Incident Inspector:**
  * Pinpoints caller coordinates, accuracy radius, caller notes, and timestamp.
  * Inspectable high-resolution scene photo evidence.
* **Incident Lifecycle:** Live status toggle between *Active*, *Acknowledged*, and *Resolved*.

> **[FRAME: Multi-Device Demonstration Video (16:9)]**  
> *Insert: Video showing Phone A pressing SOS and Laptop Admin Dashboard instantly chiming with a new Leaflet map pin!*

---

# Slide 9: Core Software Architecture & Code Highlights
## Speaker: Ana Leah D. Marcelo | Part 3: Code Deep Dive

* **1. `EmergencyStoreService` (Hybrid Sync):**
  * Instant local storage persistence via `@capacitor/preferences` + Supabase Realtime subscription.
* **2. `LocationService` (Hardware Geolocation):**
  * GPS error preservation and native status checks (`OS-PLUG-GLOC-0007`) handling turned-off GPS toggles.
* **3. `SoundFeedbackService` (Web Audio API):**
  * Synthesizes audio warning tones dynamically using `AudioContext.createOscillator()`.

> **[FRAME: Dark VS Code IDE Frame]**  
> *Insert: Code snippet screenshot highlighting `supabase.subscribeToLiveAlerts()` and Web Audio oscillator frequency code.*

---

# Slide 10: Testing, Verification & Safe Test Mode
## Speaker: Beatriz D. Villamia | Part 4: Testing & Verification

* **Safe Test Mode (ON by Default):**
  * Built-in toggle in Settings intercepts real 911 calls while allowing 100% of GPS acquisition, audio feedback, photo uploads, and Supabase cloud dispatching.
* **Cross-Platform Physical Testing:**
  * Tested on desktop Google Chrome browser and physical Android devices via Android Studio.
  * Verified camera permissions, GPS prompts, and WebSocket session stability.
* **74 App Icon Varieties:** Full Android mipmap and splash screens generated using `@capacitor/assets`.

> **[FRAME: Physical Device Testing Photo]**  
> *Insert: Photo of physical Android smartphone running E-mergency App alongside Android Studio device logs.*

---

# Slide 11: Real-World Limitations & Future Roadmap
## Speaker: Beatriz D. Villamia | Part 4: Limitations & Future Vision

* **Current Real-World Limitations:**
  * **GPS Satellite Line-of-Sight:** GPS accuracy degrades inside reinforced concrete basements or underground structures.
  * **Cellular Data Dependency:** Photo transmission and cloud sync require active 4G/5G or Wi-Fi data connectivity.
* **Engineering Future Roadmap:**
  * **Offline SMS Mesh Fallback:** Automatically compress coordinates and distress category into a fallback SMS when mobile data is unavailable.
  * **Two-Way WebRTC Audio:** Direct push-to-talk voice channel between dispatcher and caller inside the app.
  * **FCM Native Push Broadcasts:** Geofenced push alerts notifying nearby certified community first responders.

> **[FRAME: 3-Card Roadmap Infographic]**  
> *Insert: 3 Visual Roadmap Cards: [Offline SMS Mesh] ➔ [Two-Way Voice Channel] ➔ [Community First Responder Push].*

---

# Slide 12: Academic AI Disclosure & Conclusion
## Speaker: Beatriz D. Villamia | Part 4: AI Disclosure & Wrap-Up

* **Academic AI Usage Disclosure:**
  * In compliance with academic integrity guidelines, we disclose the use of **Google DeepMind Antigravity / Gemini** as an AI pair-programmer.
  * AI assisted in boilerplate scaffolding, Web Audio frequency calculations, asset mipmaps generation, and documentation drafting.
  * All architectural decisions, requirement validations, code reviews, and device testing were driven, evaluated, and verified by the student team.
* **Final Conclusion:**
  * E-mergency App proves that eliminating account friction and combining GPS, photo intelligence, and real-time cloud dispatching saves critical minutes when lives are on the line.

> **[FRAME: Team Credits & Q&A Card]**  
> *Insert: "Thank You! Questions & Answers" card featuring group member names and app icon.*
