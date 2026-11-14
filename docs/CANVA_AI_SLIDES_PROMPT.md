# Canva AI Master Prompt & Slide Blueprint: E-mergency App

This document provides:
1. **The Canva AI Master Prompt** (copy-paste directly into Canva Magic Design / Presentations).
2. **Detailed Slide-by-Slide Blueprint (12 Slides)** with exact speaker tags, bullet points, and **Pre-Defined Media & Code Inserters** (frames for video clips, phone mockups, and code screenshots).
3. **Canva Visual Styling & Asset Guide** (colors, typography, and layout rules).

---

## 1. Master Prompt for Canva AI (Magic Design / Text-to-Deck)

> **Copy and paste the prompt below into Canva (Home ➡️ "Magic Design for Presentations" or Canva Docs ➡️ "Convert to Presentation"):**

```text
Create a modern, high-tech, and professional 12-slide technology case study presentation for a mobile application called "E-mergency App: Electronic Emergency Reporting & Real-Time Tactical Dispatch System". 

Design Theme & Aesthetics:
- Theme: Emergency Response, Modern Civic Tech, Clean Mobile App Showcase.
- Color Palette: Deep Slate Navy (#0F172A) background, Vibrant Emergency Crimson (#DC2626) accents, Electric Cyan/Blue (#2563EB and #38BDF8) highlights, and Crisp White (#FFFFFF) text.
- Typography: Bold modern sans-serif headings (Montserrat or Inter Bold) with clean legible body text (Roboto or Open Sans).
- Layout: 16:9 widescreen presentation with generous whitespace, rounded card containers, badge tags, and dedicated rectangular media frames/placeholders on every slide for video screen recordings, mobile UI mockups, and code snippets.

The presentation covers 4 key areas divided among 4 presenters:
1. Problem Statement & Zero-Barrier Solution (Jose)
2. Citizen SOS Mobile Application Walkthrough with Photo & Sound Feedback (Maricar)
3. Guarded Dispatcher Admin Portal, Leaflet Mapping & Supabase Real-Time Architecture (Ana Leah)
4. Safe Test Verification, Limitations, Future Roadmap & Academic AI Disclosure (Beatriz)
```

---

## 2. Slide-by-Slide Content & Pre-Defined Media Inserters

```
================================================================================
SLIDE 1: Title & Team Introduction
================================================================================
[SPEAKER BADGE]: Jose A. Olinares III
[SLIDE HEADER]: E-mergency App
[SLIDE SUBTITLE]: Electronic Emergency Reporting & Real-Time Tactical Dispatch System
[COURSE TAG]: Mobile Application Technology — Final Case Study

[TEXT CONTENT]:
• Group Members:
  - Jose A. Olinares III (System Architecture & Lead)
  - Maricar F. Gregorio (Citizen Experience & Dispatch Flow)
  - Ana Leah D. Marcelo (Admin Portal & Cloud Integration)
  - Beatriz D. Villamia (Quality Assurance, Testing & Evaluation)
• Technology Stack: Ionic Framework + Angular Standalone + Capacitor + Leaflet + Supabase Realtime

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: APP LOGO / PHONE HERO FRAME]                                │
│ Format: 1:1 Square or Angled Phone Frame (Right side, 40% slide width)       │
│ Content: Drop the official E-mergency App glowing emblem / app logo icon     │
│ Asset to insert: src/assets/icon/favicon.png or app logo badge               │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
================================================================================
SLIDE 2: The Critical Problem in Emergency Response
================================================================================
[SPEAKER BADGE]: Jose A. Olinares III
[SLIDE HEADER]: Why Traditional 911 Reporting Fails
[SLIDE SUBTITLE]: Critical Points of Friction Costing Human Lives

[TEXT CONTENT - 3 KEY PAIN POINTS]:
1. Panic & Disorientation:
   • Victims in trauma cannot describe exact street numbers, building floors, or landmarks over a voice call.
2. The "Account Sign-Up" Barrier:
   • Existing apps require email confirmation, passwords, or SMS OTPs before dispatching aid — unacceptable during a cardiac arrest or home fire.
3. Responder Blindness:
   • First responders arrive with zero visual intelligence on road accessibility, fire severity, or patient trauma.

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: PROBLEM INFOGRAPHIC / SPLIT VISUAL FRAME]                   │
│ Format: 16:9 Horizontal Card or 3 Icon Comparison Cards                      │
│ Content: Graphic comparing "Traditional 911 Call (3–5 min delay)" vs.        │
│          "E-mergency Instant Geolocation (1-tap dispatch in 5s)"             │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
================================================================================
SLIDE 3: The Solution — The Zero-Barrier Philosophy
================================================================================
[SPEAKER BADGE]: Jose A. Olinares III
[SLIDE HEADER]: E-mergency App Architecture
[SLIDE SUBTITLE]: Frictionless Citizen SOS Paired with Tactical Dispatching

[TEXT CONTENT - 4 PILLARS]:
• Zero-Barrier Access: No account, no login required for citizens in distress.
• Multi-Modal Dispatch: High-precision GPS coordinates + street address + scene photo.
• Audio-Tactile Protection: iPhone-style acoustic countdown with 5-second accidental cancel guard.
• Dual-Mode Architecture: Public citizen mobile app + Guarded Dispatcher Portal connected via Supabase Realtime.

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: SYSTEM ARCHITECTURE DIAGRAM FRAME]                          │
│ Format: 16:9 High-Tech Flowchart Diagram (Right 50% of slide)                │
│ Content: Diagram showing:                                                    │
│ [Citizen Phone] ──GPS+Photo──> [Supabase Cloud DB] ──Realtime──> [Admin Map] │
│        │                                                                     │
│        └──tel:911──> [Native Phone Dialer]                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
================================================================================
SLIDE 4: Citizen Experience — Clean Navigation & Live GPS
================================================================================
[SPEAKER BADGE]: Maricar F. Gregorio
[SLIDE HEADER]: Citizen Interface
[SLIDE SUBTITLE]: Clean 2-Tab Navigation & Instant Location Acquisition

[TEXT CONTENT]:
• Clean Citizen View: Admin controls removed from bottom navigation; public users only see "SOS" and "Settings & Hotlines".
• Upfront Permission Guard: Real-time status chips detecting Device GPS Hardware, Location Permissions, and Notifications.
• Live Interactive Leaflet Map: Automatically centers on the citizen's GPS coordinates with reverse-geocoded street address.

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: MOBILE SCREEN RECORDING / MOCKUP FRAME]                     │
│ Format: 9:16 Vertical Phone Mockup Frame (Right side)                        │
│ Content: Short video clip or screenshot of the live SOS Page loading GPS     │
│ Asset to insert: Video of app opening -> Permission chip green -> Map pin    │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
================================================================================
SLIDE 5: Multi-Modal Reporting — Photo Evidence & Direct Calling
================================================================================
[SPEAKER BADGE]: Maricar F. Gregorio
[SLIDE HEADER]: Situational Intelligence
[SLIDE SUBTITLE]: Visual Scene Evidence & Instant Telephony Integration

[TEXT CONTENT]:
• 5 Emergency Classifications: Medical, Fire, Accident, Security, and General.
• Scene Photo Evidence: Integrated Capacitor Camera allows instant snapshot or gallery upload with client-side JPEG compression.
• Instant Phone Call — 911 Button:
  - Direct 1-tap dialer bypass (`tel:911`).
  - No countdown needed when instant voice communication is required.
• Emergency Hotlines Directory: 1-tap direct dials for Philippine Red Cross (143) and PNP (117).

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: DUAL PHONE SCREENSHOTS / VIDEO FRAME]                       │
│ Format: 2 Side-by-Side Mobile Screens (50% slide width)                      │
│ Left Frame: Photo capture preview card with thumbnail & category chips.      │
│ Right Frame: Emergency Hotlines directory in Settings tab.                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
================================================================================
SLIDE 6: iPhone-Style Audio Feedback & Accidental Guard
================================================================================
[SPEAKER BADGE]: Maricar F. Gregorio
[SLIDE HEADER]: Acoustic Feedback & Guarded Dispatch
[SLIDE SUBTITLE]: Preventing Accidental Pocket Dials While Keeping Callers Informed

[TEXT CONTENT]:
• Synthesized Web Audio API:
  - Custom square-wave frequency ramps mimicking iPhone emergency countdown beeps.
  - 100% offline — zero dependency on external audio files that could fail during network drops.
• 5-Second Accidental Cancel Guard:
  - Giant high-contrast "CANCEL SOS" button to immediately abort accidental triggers.
• Coordinated Haptic Pulses: Tactile vibration pulses synchronized with each countdown tick.

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: COUNTDOWN VIDEO CLIP FRAME]                                 │
│ Format: 16:9 Video Player Box with Play Button Overlay                       │
│ Content: 5-second video clip showing the red countdown card counting down    │
│          5... 4... 3... 2... 1... with audible countdown beeps.              │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
================================================================================
SLIDE 7: Dispatcher & Admin Portal — Secure Gateway
================================================================================
[SPEAKER BADGE]: Ana Leah D. Marcelo
[SLIDE HEADER]: Dispatcher & Admin Gateway
[SLIDE SUBTITLE]: Secure Access for Emergency Responders & Evaluators

[TEXT CONTENT]:
• Protected Gateway: Top-level `/admin/dashboard` protected by Angular's functional `adminAuthGuard`.
• Evaluator Quick-Fill Feature:
  - 1-tap button automatically populates preset evaluator credentials:
    `admin@emergency.ph` / `Emergency2026!`.
  - Solves mobile keyboard typing friction during live grading and evaluations.
• Session Security: Session stored securely in `@capacitor/preferences` with an "Exit / Logout" return button.

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: ADMIN LOGIN SCREENSHOT FRAME]                               │
│ Format: 9:16 Vertical Phone Frame or Centered Laptop Frame                   │
│ Content: Screenshot of the Admin Login screen showing the orange preset      │
│          evaluator card and Quick Fill button.                               │
│ Asset to insert: Screenshot of http://localhost:4200/admin/login             │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
================================================================================
SLIDE 8: Real-Time Cross-Device Synchronization
================================================================================
[SPEAKER BADGE]: Ana Leah D. Marcelo
[SLIDE HEADER]: Real-Time Cross-Device Sync
[SLIDE SUBTITLE]: Supabase Cloud Realtime Powering Instant Tactical Response

[TEXT CONTENT]:
• Multi-Device Reality:
  - Phone A (Citizen) triggers SOS ➡️ Alert pushed to Supabase PostgreSQL table.
  - Phone B / Laptop (Dispatcher) receives instant `postgres_changes` websocket push.
• Zero Page Reloads: Incidents dynamically appear at the top of the feed with audio chime.
• Tactical Leaflet Incident Map: Plots victim coordinates, caller note, contact method, and inspectable scene photo.
• Incident Status Lifecycle: Active ➡️ Acknowledged ➡️ Resolved.

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: SPLIT SCREEN MULTI-DEVICE VIDEO FRAME]                      │
│ Format: 16:9 Widescreen Video Frame                                          │
│ Content: Side-by-side video showing Phone A pressing SOS and Laptop Admin    │
│          Dashboard instantly popping up the marker on the Leaflet map!       │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
================================================================================
SLIDE 9: Technical Architecture & Code Deep Dive
================================================================================
[SPEAKER BADGE]: Ana Leah D. Marcelo
[SLIDE HEADER]: Core Code Architecture
[SLIDE SUBTITLE]: Resilient, Offline-First Engineering with Angular Standalone

[TEXT CONTENT - 3 KEY SERVICES]:
1. `EmergencyStoreService` (Hybrid Sync):
   - Local Preferences caching + Supabase Realtime synchronization.
2. `LocationService` (Hardware Geolocation):
   - High-accuracy GPS with native status detection (`OS-PLUG-GLOC-0007`).
3. `SoundFeedbackService` (Web Audio API):
   - Procedural oscillator synthesis for iPhone-style countdown beeps.

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: CODE SNIPPET HIGHLIGHT FRAME]                               │
│ Format: Dark IDE Code Frame (VS Code Style with colored syntax highlighting) │
│ Content: Screenshot showing `supabase.subscribeToLiveAlerts()` and           │
│          `playCountdownTick()` Web Audio oscillator code.                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
================================================================================
SLIDE 10: Testing, Verification & Safe Test Mode
================================================================================
[SPEAKER BADGE]: Beatriz D. Villamia
[SLIDE HEADER]: Testing & Rigorous Verification
[SLIDE SUBTITLE]: Validating Safety, Permissions & Multi-Device Communication

[TEXT CONTENT]:
• Safe Test Mode:
  - Built-in toggle in Settings intercepts real 911 calls while allowing 100% of GPS, photo, and Supabase cloud dispatching to be safely demonstrated.
• Cross-Platform Physical Testing:
  - Tested on Google Chrome web browser and physical Android devices via Android Studio.
  - Verified camera hardware access, GPS permission prompts, and background session persistence.
• 74 App Icon Varieties:
  - Generated full Android mipmap and splash screens using `@capacitor/assets`.

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: TESTING PHOTO / ANDROID STUDIO FRAME]                       │
│ Format: 16:9 Split Frame (Device photo + Safe Test Mode badge)               │
│ Content: Photo of physical Android phone running E-mergency App alongside    │
│          Android Studio device logcat / build output.                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
================================================================================
SLIDE 11: Real-World Limitations & Future Roadmap
================================================================================
[SPEAKER BADGE]: Beatriz D. Villamia
[SLIDE HEADER]: Limitations & Future Enhancements
[SLIDE SUBTITLE]: Engineering for Disaster Resilience & Scalability

[TEXT CONTENT - CURRENT LIMITATIONS]:
• GPS Satellite Line-of-Sight: Satellite signal can degrade inside reinforced concrete basements.
• Cellular Data Dependency: Photo uploads and cloud sync require active data/WiFi.

[TEXT CONTENT - FUTURE ROADMAP]:
• Offline SMS Mesh Fallback: Automatically encode coordinates and distress tokens into an SMS when data fails.
• 2-Way Dispatcher-to-Citizen WebRTC Audio: Live push-to-talk channel.
• FCM Native Push Alerts: Push notifications alerting off-duty community medics nearby.

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: ROADMAP INFOGRAPHIC / ICON MATRIX FRAME]                    │
│ Format: 3 Visual Roadmap Cards with Icons                                    │
│ Icons: [Satellite / SMS Icon] -> [Walkie-Talkie Icon] -> [Medical Cross Icon]│
└──────────────────────────────────────────────────────────────────────────────┘
```

```
================================================================================
SLIDE 12: Disclosure of AI Assistance & Conclusion
================================================================================
[SPEAKER BADGE]: Beatriz D. Villamia
[SLIDE HEADER]: AI Disclosure & Conclusion
[SLIDE SUBTITLE]: Academic Integrity & Final Project Summary

[TEXT CONTENT - AI DISCLOSURE STATEMENT]:
• Transparent Tool Disclosure:
  - Assisted by Google DeepMind Antigravity / Gemini as an AI pair-programmer.
  - AI assisted with boilerplate architecture scaffolding, Web Audio frequency synthesis, asset automation, and documentation drafting.
  - All architecture decisions, requirement validation, code reviews, and device testing were driven and verified by the student team.

[TEXT CONTENT - CLOSING SUMMARY]:
• E-mergency App proves that eliminating account friction and combining GPS, photo intelligence, and real-time cloud dispatching saves vital minutes when lives are on the line.

┌──────────────────────────────────────────────────────────────────────────────┐
│ [MEDIA INSERTER: FINAL TEAM CREDITS & THANK YOU CARD]                        │
│ Format: Centered Thank You Card with App Badge and University Logo           │
│ Content: "Thank You! Q&A Session" with group member names.                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. How to Use This in Canva (Step-by-Step)

1. **Step 1: Generate Deck with Canva AI**
   - Go to [canva.com](https://canva.com).
   - In the search bar or Docs, select **"Presentations (16:9)"**.
   - Paste the **Section 1 Master Prompt** into Canva Magic Design to generate a tech presentation layout.
2. **Step 2: Copy-Paste the Slide Content**
   - Replace each slide's headline, subtitle, and bullet points using **Section 2**.
3. **Step 3: Drop In Your Media via Canva "Frames"**
   - On each slide, Canva has a **"Frames"** element (Search *Elements ➡️ Frames* for "Phone", "Laptop", or rounded rectangles).
   - Drag and drop your screenshots, videos, or code images directly into the designated **`[MEDIA INSERTER]`** containers!

