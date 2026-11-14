# E-mergency App — Final Video Presentation & Walkthrough Script
**Course:** Mobile Application Technology — Final Case Study  
**Project:** E-mergency App (`com.emergency.app`)  
**Target Duration:** 8 to 12 Minutes (approx. 2.5 minutes per speaker)  
**Speakers:**
1. **Jose (Jose A. Olinares III)** — Introduction, Problem & Proposed Architecture (~2.5 mins)
2. **Maricar (Maricar F. Gregorio)** — Citizen UI Live Demo & Core SOS Features (~2.5 mins)
3. **Ana Leah (Ana Leah D. Marcelo)** — Admin Portal, Real-Time Sync & Code Deep Dive (~2.5 mins)
4. **Beatriz (Beatriz D. Villamia)** — Testing, Limitations, Future Roadmap & AI Disclosure (~2.5 mins)

---

## Visual & Recording Setup Checklist Before Starting
- [ ] Screen 1 / Phone: Running Citizen view (`http://localhost:4200` or installed Android APK).
- [ ] Screen 2 / Window: Running Admin Dashboard (`http://localhost:4200/admin/dashboard`).
- [ ] VS Code / Editor: Tabs open for `emergency-store.service.ts`, `location.service.ts`, and `admin-auth.guard.ts`.
- [ ] Microphone check and presentation slides/app ready.

---

```
TIMELINE OVERVIEW (Total: ~10:30)
├── 00:00 - 02:30 | Part 1: Intro, Problem & Solution ........ Jose
├── 02:30 - 05:15 | Part 2: Citizen SOS Live Demonstration ... Maricar
├── 05:15 - 08:00 | Part 3: Admin Portal & Code Deep Dive .... Ana Leah
└── 08:00 - 10:30 | Part 4: Testing, Limitations & AI ........ Beatriz
```

---

## PART 1: Introduction, Problem Statement & Solution
**Speaker:** Jose  
**Estimated Time:** 00:00 – 02:30 (2.5 mins)  
**On Screen:** Title slide showing project title *"E-mergency App"*, team member names, and mobile app logo, then transitioning to mobile app preview.

### Script:
> **[JOSE]**:  
> "Good day, professor and fellow students. Welcome to our Final Case Study presentation for Mobile Application Technology.  
> 
> My name is **Jose Olinares III**, and together with my team members **Maricar Gregorio**, **Ana Leah Marcelo**, and **Beatriz Villamia**, we are proud to present **E-mergency App** — an electronic emergency reporting and tactical dispatch system built with Ionic, Angular, Capacitor, and Supabase.
> 
> ### The Problem:
> In life-threatening emergencies — whether it's a car accident, a sudden cardiac arrest, or a home fire — every single second counts. However, traditional emergency reporting in the Philippines faces critical points of friction:
> 1. First, **Panic and Disorientation**: Callers often struggle to convey their exact street address, coordinates, or landmarks over a voice call.
> 2. Second, **Account Barriers**: Many modern apps force users to create accounts, verify SMS OTPs, or remember passwords before asking for help — which is completely impractical during an active crisis.
> 3. Third, **Lack of Visual Scene Evidence**: Responders arrive blind without knowing scene severity, road blockages, or patient conditions.
> 
> ### Our Proposed Solution:
> To eliminate these bottlenecks, we designed **E-mergency App** around a **Zero-Barrier Philosophy**:
> * **Instant Citizen Access:** Zero login, zero sign-up. The moment a citizen opens the app, high-precision GPS is automatically acquired.
> * **Multi-Modal Dispatch:** With a single tap, the app captures GPS coordinates, reverse-geocoded address, emergency classification, and real-time photo evidence.
> * **Tactile & Audio Feedback:** iPhone-style countdown beeps keep the caller informed while providing a 5-second cancel guard against accidental pocket presses.
> * **Direct 911 Telephony:** Direct integration with the native device phone dialer for immediate voice contact with 911 or local emergency hotlines like the Philippine Red Cross (143) and PNP (117).
> * **Guarded Cloud Dispatcher Portal:** While citizens see a simplified, focused interface, emergency dispatchers authenticate into a secure portal powered by Supabase Realtime and Leaflet mapping.
> 
> Now, I will turn the floor over to **Maricar**, who will demonstrate the citizen interface and emergency triggering live in action."

---

## PART 2: Citizen Application Live Walkthrough
**Speaker:** Maricar  
**Estimated Time:** 02:30 – 05:15 (2.5 mins)  
**On Screen:** Live phone recording or browser window demonstrating the app in mobile viewport.

### Script:
> **[MARICAR]**:  
> "Thank you, Jose! I will now walk you through the citizen experience on the mobile application.
> 
> *[Show Bottom Navigation Bar]*  
> Notice our clean, user-focused navigation bar. We have intentionally separated administrative controls away from everyday citizens, giving them only two clean tabs: **SOS** and **Settings & Hotlines**.
> 
> *[Point to Permission Notice & Live Map]*  
> When the user opens the SOS screen, the app immediately checks device permissions. If Location Services or Notifications are disabled, an upfront status card prompts the user to enable them. Below this, our interactive Leaflet map accurately pinpoints the user's current GPS coordinates and street address.
> 
> *[Select Emergency Category & Add Photo]*  
> Step 1 allows the victim or bystander to categorize the crisis: **Medical, Fire, Accident, Security, or General**. They can also type an optional note, such as 'Second floor near stairs.'  
> Furthermore, using Capacitor Camera, the citizen can tap **'Take Photo'** or **'Choose Photo'** to attach real-time photo evidence of the scene, automatically compressed on-device to conserve emergency mobile data.
> 
> *[Demonstrate Direct 911 Call]*  
> If the situation requires immediate voice response without waiting, the citizen can tap the **'Instant Phone Call — 911'** button. This directly triggers the native device phone dialer with 911 pre-filled.
> 
> *[Demonstrate 5-Second SOS Guard & iPhone Countdown Audio]*  
> Now, let's trigger the primary **SOS Dispatch**:  
> *[Press SOS button]*  
> Notice the 5-second countdown timer. You can hear the escalating iPhone-style acoustic beeps synthesized through the Web Audio API, accompanied by haptic vibration pulses. If this was pressed accidentally, the large white **'CANCEL SOS'** button aborts the call immediately without false alarms.
> 
> *[Let countdown reach 0]*  
> Once the timer concludes, the emergency alert is dispatched: coordinates, photo, and details are logged, the device phone dialer opens, and the alert is broadcasted instantly to emergency services.
> 
> *[Show Settings & Directory Tab]*  
> Finally, in the **Settings tab**, users can toggle Safe Test Mode, adjust the countdown length, view our team credits, and access our **Emergency Hotlines Directory** for one-tap calls to 911, Philippine Red Cross 143, and the PNP.
> 
> Next, **Ana Leah** will show you what happens on the Dispatcher's end and walk through our key code architecture."

---

## PART 3: Admin Dispatcher Portal, Real-Time Sync & Code Architecture
**Speaker:** Ana Leah  
**Estimated Time:** 05:15 – 08:00 (2.5 mins)  
**On Screen:** Switch to Admin Login (`/admin/login`), log in to Admin Dashboard, show live Leaflet incident pin, then switch to VS Code to highlight key code snippets.

### Script:
> **[ANA LEAH]**:  
> "Thank you, Maricar! Now let's view the other half of our system: the **Emergency Dispatcher & Admin Portal**.
> 
> *[Show Admin Login & Quick Fill]*  
> From the Settings tab, authorized personnel can access the **Dispatcher Portal**. Because this is protected by Angular's functional `adminAuthGuard`, unauthorized citizens cannot stumble upon incident logs. For evaluation convenience, we built a **'Quick Fill Preset Credentials'** button that automatically fills our preset credentials: `admin@emergency.ph` and `Emergency2026!`.
> 
> *[Log in to Admin Dashboard]*  
> Once logged in, the dispatcher sees the Incident Monitor. Because we integrated **Supabase Realtime**, every time Maricar dispatched an alert on the citizen phone, our dashboard received an instant PostgreSQL change broadcast.  
> As you can see, the new alert appears immediately at the top of the feed, complete with the caller's timestamp, address, high-resolution Leaflet map pin, and the attached scene photograph. The dispatcher can filter by **Active, Acknowledged, or Resolved**, and update the ticket status in real time.
> 
> *[Switch to VS Code — Highlight 3 Code Snippets]*  
> Let's briefly look at the code that powers this:
> 
> 1. **Hybrid Store & Realtime Sync (`src/app/services/emergency-store.service.ts`):**  
> We implemented a dual-mode hybrid architecture. On startup, it reads instant local records from `@capacitor/preferences`. Then, it queries Supabase cloud DB and establishes a live subscription via `supabase.channel('public:emergencies').on('postgres_changes', ...)` so multiple physical devices synchronize without manual reloading.
> 
> 2. **Hardware Geolocation & Permission Handling (`src/app/services/location.service.ts`):**  
> We use `@capacitor/geolocation` with custom error preservation and native status checks (`OS-PLUG-GLOC-0007`), ensuring the app gracefully handles GPS hardware disablement and informs the user.
> 
> 3. **iPhone Acoustic Feedback (`src/app/services/sound-feedback.service.ts`):**  
> Rather than relying on external MP3 audio files that could fail to load offline, we programmatically synthesize dual-frequency warning square-waves and decay envelopes directly using the browser's native `AudioContext`.
> 
> Now, **Beatriz** will conclude with our testing, limitations, and AI disclosure."

---

## PART 4: Testing, Limitations, Future Roadmap & AI Disclosure
**Speaker:** Beatriz  
**Estimated Time:** 08:00 – 10:30 (2.5 mins)  
**On Screen:** Switch to testing slides/demo, then limitations summary, then AI disclosure statement and final thank-you slide.

### Script:
> **[BEATRIZ]**:  
> "Thank you, Ana Leah! To wrap up our presentation, let's discuss our testing process, current limitations, future enhancements, and disclosure of tools.
> 
> ### Basic Testing & Verification:
> To verify our application reliably without triggering real-world 911 calls, we engineered a **Safe Test Mode** toggle directly in our settings:
> * In **Safe Test Mode**, GPS acquisition, audio feedback, photo capture, and Supabase cloud dispatch operate at 100% fidelity, but actual telephony dialing is safely intercepted with a test banner.
> * We conducted cross-platform manual testing across **desktop Google Chrome** and **physical Android devices** using Android Studio and Capacitor Android sync, validating that camera permissions, GPS coordinates, and real-time database subscriptions operate seamlessly across separate devices.
> 
> ### Limitations & Future Improvements:
> While E-mergency App is fully functional, we identified key areas for future deployment:
> 1. **Hardware & Signal Dependency:** High-precision GPS requires line-of-sight to satellites, which can degrade inside deep basements or thick concrete buildings.
> 2. **Offline SMS Mesh Fallback:** In rural areas where mobile cellular data is unavailable, a great future improvement would be an automated SMS fallback that encodes GPS coordinates into an emergency text message.
> 3. **Two-Way Dispatcher Chat:** Adding live WebSockets or WebRTC two-way audio between caller and dispatcher.
> 
> ### Disclosure of AI Assistance:
> In compliance with academic integrity guidelines, we transparently disclose our use of AI assistance:
> * We utilized **Google DeepMind Antigravity / Gemini** as an AI pair-programmer throughout this project.
> * AI was utilized to assist in boilerplate architectural scaffolding, synthesizing the Web Audio API sound frequencies, setting up Capacitor assets for 74 app icon mipmap variants, and refining technical documentation.
> * All design decisions, requirement validations, code reviews, and device testing were driven, evaluated, and verified by our team.
> 
> ### Conclusion:
> In conclusion, **E-mergency App** demonstrates how modern web and hybrid mobile technologies can eliminate life-threatening delays in emergency reporting through zero-barrier design, instant geolocation, photo intelligence, and real-time cloud dispatching.
> 
> On behalf of Jose, Maricar, Ana Leah, and myself, thank you very much for your time and attention!"

---

## Quick Reference Cards for Each Member

### 👤 Jose's Cue Card
* **Focus:** Hook, Problem (panic, account walls, lack of photos), Solution (zero-barrier, GPS, photo, 911 call, cloud dispatch).
* **Keywords:** Zero-barrier philosophy, no login required, high-precision GPS, Capacitor, Supabase.
* **Handoff:** *"Now, I will turn the floor over to Maricar, who will demonstrate the citizen interface..."*

### 👤 Maricar's Cue Card
* **Focus:** Citizen App Demo (2 tabs, permission check, Leaflet GPS, categories, photo capture, direct 911 call button, 5-sec countdown with audio beeps and cancel guard, Settings directory).
* **Keywords:** Direct 911 dialer, Web Audio countdown, photo attachment, accidental press protection.
* **Handoff:** *"Next, Ana Leah will show you what happens on the Dispatcher's end..."*

### 👤 Ana Leah's Cue Card
* **Focus:** Admin Portal (route guard, evaluator 1-tap quick fill, Supabase Realtime live sync across devices, Leaflet map pin, photo inspector, code highlights: `EmergencyStoreService`, `LocationService`, `SoundFeedbackService`).
* **Keywords:** Protected route, Supabase Realtime, postgres_changes, Web Audio API synthesis.
* **Handoff:** *"Now, Beatriz will conclude with our testing, limitations, and AI disclosure."*

### 👤 Beatriz's Cue Card
* **Focus:** Safe Test Mode vs Live Mode, cross-platform Android testing, limitations (basement GPS, cellular data), future improvements (SMS fallback, 2-way chat), transparent AI disclosure (Antigravity/Gemini), closing.
* **Keywords:** Academic disclosure, Safe Test Mode, Android Studio, hybrid architecture.
* **Handoff:** *"Thank you very much for your time and attention!"*

