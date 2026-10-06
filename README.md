# ⚔️ KURAL QUEST (குறள் வீரப் பயணம்)

> **An Interactive Cinematic Thirukkural Learning Experience for Children**

[![Language](https://img.shields.io/badge/Language-Tamil%20%2F%20English-gold)](#)
[![Stack](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange)](#)
[![Audio](https://img.shields.io/badge/Audio-HTML5%20%2B%20Web%20Audio%20API-brightgreen)](#)
[![License](https://img.shields.io/badge/License-MIT-blue)](#)

---

## 📌 Overview

**KURAL QUEST (குறள் வீரப் பயணம்)** is an interactive, AAA-styled cinematic web application designed to teach classic **Thirukkural** literature to children through visual storytelling, action, emotional resonance, and gamified interactions.

Rather than relying on long textual paragraphs or rote memorization, **KURAL QUEST** bridges the gap between ancient wisdom and young learners by connecting **on-screen actions directly to visual meaning**. Children experience the concepts of courage, perseverance, unity, and resilience firsthand before learning the sacred words of Tamil literature.

---

## 📜 The Thirukkural Core

The application is built around **Thirukkural 762** from the chapter **படைமாட்சி (Excellence of the Army)**:

> **அழிவின்றி அறைபோகா தாகி**  
> **வழிவந்த வன்க ணதுவே படை.**

### 💡 Core Concepts Taught
- **அழிவின்றி (Invincibility & Perseverance)**: Falling down in battle or life is not defeat; standing back up with unyielding determination is true invincibility (*"விழுந்தாலும் அழியாமல் மீண்டும் எழுவது"*).
- **அறைபோகா (Courage & Steadiest Stance)**: Standing brave against adversity and enemy forces without fleeing in fear (*"பகைவர் சூழ்ந்தாலும் பயந்து பின்வாங்காத துணிவு"*).
- **வழிவந்த (Heritage & Team Unity)**: Standing together alongside trusted comrades who share a common lineage and purpose (*"மரபுவழி வந்த தோழர்கள் ஒன்றாக திரளுதல்"*).
- **படை (Strength of a United Force)**: A brave, united collective standing firmly together as an unstoppable force (*"துணிவுடன் ஒன்றாக நிற்கும் பெரும் வீரப்படை"*).

---

## 🎓 Educational Approach

Traditional learning often asks children to memorize text before understanding its real-life context. **KURAL QUEST** flips this model:

```text
       ACTION
         ↓
     EXPERIENCE
         ↓
   VISUAL MEANING
         ↓
  KURAL WORD REVEAL
         ↓
 INTERACTIVE QUIZ
         ↓
   REINFORCEMENT
```

1. **ACTION**: The warrior fights, takes hits, and falls on the battlefield.
2. **EXPERIENCE**: The child feels the defeat, then helps the warrior push up and stand back up.
3. **VISUAL MEANING**: The child observes the warrior breathing heavily, gripping his weapon, and standing firm.
4. **KURAL WORD REVEAL**: The word **"அழிவின்றி"** is revealed in glowing bronze/gold typography embedded in the environment.
5. **INTERACTIVE QUIZ**: A simple single-question challenge (*"வீரன் விழுந்தபோது என்ன செய்தான்?"*) checks understanding.
6. **REINFORCEMENT**: Positive feedback (`"சரியான பதில்! அதுதான் — அழிவின்றி."`), floating score rewards (`+100`), and progress bar updates lock in the learning moment.

---

## 🏛️ System & Module Architecture

The application is structured into three progressive modules managed by a lightweight, state-aware root router:

```text
KURAL-QUEST/
│
├── index.html                    # Root Router (reads kuralQuest.state & redirects)
├── script.js                     # Root Engine fallback
├── style.css                     # Root Styles
├── guide.md                      # Project Guidelines
│
├── assets/
│   ├── audio/                    # Game SFX & Ambience (Root & Subfolders)
│   │   ├── ambience/             # ambient-temple.wav
│   │   ├── combat/               # battle.wav, sword-hit.wav
│   │   ├── ui/                   # click.wav, correct.wav, wrong.wav
│   │   └── victory/              # victory.wav
│   │
│   └── images/                   # Visual Sprites & Backgrounds
│       ├── characters/           # Warrior poses (front, side, battle, back, allies)
│       ├── enemies/              # Enemy warrior sprites (basic, boss, shield, spear, elite)
│       ├── environments/         # High-res backgrounds (temple_bg.png, battlefield_bg.jpg, etc.)
│       ├── weapons/              # Weapon renders (weapon_axe.png)
│       └── effects/              # Visual FX assets
│
└── modules/
    ├── 01-journey/               # Module 01: The Journey Begins
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    │
    ├── 02-battle/                # Module 02: Battle & "அழிவின்றி" Learning
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    │
    └── 03-wisdom/                # Module 03: Real-World Wisdom & Rank Evaluation
        ├── index.html
        ├── script.js
        └── style.css
```

---

## 🎮 Detailed Module Breakdown

### 🧭 Module 01 — Journey (`modules/01-journey/`)
- **Purpose**: Establishes the hero's journey, setting a AAA mythological atmosphere.
- **Key Features**:
  - **2.5D Parallax Backgrounds**: Layers moving backgrounds (`temple_bg.png`, `mountain_snow_bg.jpg`, `battlefield_bg.jpg`) with pointer-based interactive parallax.
  - **Particle Engine**: Multi-category 2D Canvas particles rendering rising embers, ashes, and moving atmospheric fog.
  - **Lightning Flash System**: Random environmental lightning flashes during storm scenes.
  - **Interactive Story Choices**: Branching choices (*"⚔️ முன்னேறு"* vs *"🛡️ பின்வாங்கு"*).
  - **Clash Transition**: Combat entrance sequence with weapon sparks, camera shake, and white impact flashes.

---

### ⚔️ Module 02 — Battle & "அழிவின்றி" Learning (`modules/02-battle/`)
- **Purpose**: The core educational module connecting physical action to the Thirukkural word **"அழிவின்றி"**.
- **Key Features**:
  - **Warrior Combat Duel**: Telegraphed enemy attack system, HP bars (`warrior-hp`, `enemy-hp`), and tactical player actions (`⚔️ தாக்கு!`, `🛡️ காப்பாற்று!`).
  - **Cinematic Fall & Rise Sequence**:
    - Warrior takes damage and falls (`warrior-side-fell`).
    - Player clicks *"🔥 தளராதே! எழ முயல்"*.
    - Warrior touches the ground, kneels (`warrior-side-kneel`), and pushes himself up (`warrior-side-stood`).
    - Realistic heavy breathing animation (`.heavy-breathing`), hero aura glow (`#hero-aura-glow`), and smooth transform camera zoom (`transform: scale(1.15) translateY(-8px)`).
  - **Sequential Story Typography**: Phrase-by-phrase blur-to-clear text reveal:
    1. *"விழுந்தான்..."*
    2. *"ஆனால்..."*
    3. *"மீண்டும் எழுந்தான்."*
  - **Golden Kural Reveal**: Dramatic reveal of **"அழிவின்றி"** in glowing bronze/gold text (`kuralBronzeGlow`).
  - **Child-Friendly Explanation & Memory Replay**:
    - Explanation: *"அழிவின்றி"* → *"அழியாமல் இருப்பது."* → *"விழுந்தாலும்..."* → *"மீண்டும் எழுவது!"*
    - Translucent memory replay overlay (`#memory-replay-overlay`) briefly shows the fall-to-rise visual hint.
  - **Interactive Learning Quiz**:
    - Question: *"வீரன் விழுந்தபோது என்ன செய்தான்?"*
    - Options: `A. ஓடிவிட்டான்` | `B. மீண்டும் எழுந்தான்` (Correct) | `C. ஆயுதத்தை விட்டுவிட்டான்`
    - **Correct (B)**: Gold glow state (`.correct-state`), success chime, floating `+100` score notification, feedback message (*"✨ சரியான பதில்! அதுதான் — அழிவின்றி."*), and progress bar update (`75%`).
    - **Incorrect (A/C)**: Encouraging hint (*"மீண்டும் யோசிப்போம்..."*) with visual memory replay without penalty.
  - **Next Stage Button**: Unlocks **"அடுத்த கட்டத்திற்கு →"** button transitioning cleanly to Module 03.

---

### 🌟 Module 03 — Wisdom & Real-Life Application (`modules/03-wisdom/`)
- **Purpose**: Connects the Thirukkural concepts to children's daily lives and evaluates overall mastery.
- **Key Features**:
  - **Cinematic Scroll Experience**: Progressive scrolling scenes covering all four concepts (**அழிவின்றி**, **அறைபோகா**, **வழிவந்த**, **படை**).
  - **Real-Life Relatable Examples**:
    - 📚 **படிப்பு (Education)**: Trying again after difficult exams.
    - 🤝 **குழுப்பணி (Teamwork)**: Collaborating with friends.
    - 🏆 **விளையாட்டு (Sports)**: Rising up after losing a game.
  - **Final Interactive Challenge**: Helping a fallen comrade on the battlefield.
  - **Dynamic Rank Evaluation System**: Calculates final title based on total score:
    - `< 300`: புதிய வீரன் (New Warrior)
    - `300 - 549`: வீரன் (Warrior)
    - `550 - 749`: தலைவன் (Leader)
    - `750 - 899`: குறள் காவலன் (Kural Guardian)
    - `900+`: ஞான வீரன் (Wisdom Warrior)
  - **Completion Screen**: Victory screen with score summary, rank display, restart button, and review mode.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Language** | HTML5, Vanilla CSS3, JavaScript (ES6+) |
| **Frameworks** | None (100% Native Vanilla Web Stack) |
| **Typography** | Google Fonts (`Catamaran`, `Mukta Malar` with Tamil Unicode) |
| **Animation** | CSS3 Keyframes, Hardware-Accelerated Transforms, Canvas 2D Engine |
| **Audio Engine** | HTML5 Audio (`.wav`) + Web Audio API Synthesizer Fallback |
| **Storage & State** | Browser `localStorage` (`kuralQuest.state`) |
| **Layout & UI** | CSS Grid, Flexbox, Glassmorphism, CSS Variables |

---

## 🔊 Audio System Architecture

**KURAL QUEST** features a dual-layer audio architecture that guarantees sound playback across all devices and browser security policies:

1. **HTML5 Audio Layer**:
   - Resolves `.wav` audio files from both module subfolders (`ui/`, `combat/`, `victory/`, `ambience/`) and root fallback directories (`assets/audio/`).
   - Sound Assets: `click.wav`, `sword-hit.wav`, `correct.wav`, `wrong.wav`, `victory.wav`, `battle.wav`, `ambient-temple.wav`.
2. **Web Audio API Synthesizer Fallback**:
   - If audio files fail to load or are blocked by browser autoplay restrictions, custom Web Audio API Oscillators (`sawtooth`, `triangle`, `sine`) generate real-time synthesized sound effects for clashes, clicks, rewards, and fanfares.
3. **Autoplay Policy Compliance**:
   - User gesture listeners (`click`, `keydown`, `touchstart`) automatically unlock and resume `AudioContext` on initial interaction.
4. **Mute Control Synchronization**:
   - Navigation header mute button (`🔊` / `🔇`) persists state in `kuralQuest.state.soundEnabled`.

---

## 💾 State Persistence Contract

Progress and user choices persist across modules via `localStorage` under the key **`kuralQuest.state`**:

```json
{
  "currentModule": "battle",
  "currentStage": 2,
  "score": 250,
  "soundEnabled": true,
  "battleStarted": true,
  "battleCompleted": true,
  "wisdomCompleted": false,
  "unlockedWord": "அழிவின்றி"
}
```

---

## 🎨 Visual Design System & Palette

The design reflects an ancient South Indian mythological AAA game interface:

```css
:root {
  --bg-dark: #080808;        /* Deep Obsidian Background */
  --bg-card: #111111;        /* Translucent Dark Surface */
  --bg-stone: #1A1512;       /* Ancient Stone Frame */
  --stone-border: #30251D;    /* Carved Stone Border */
  --brown-accent: #5A3A25;   /* Earthy Bronze Accent */
  --red-deep: #8B2E1E;       /* Deep Crimson War Red */
  --red-bright: #B84320;     /* Flame Red */
  --orange-ember: #D77A27;   /* Glowing Ember Orange */
  --gold-accent: #D6B36A;    /* Muted Gold Accent */
  --gold-bright: #F1D7A0;    /* Celestial Gold Text */
  --green-bright: #4CAF50;   /* Success Green */
}
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari). No `npm` or backend server required.

### Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sakthirithan/hackathon_foss_frontend.git
   cd hackathon_foss_frontend
   ```

2. **Serve the project**:
   - **Using Python**:
     ```bash
     python -m http.server 8080
     ```
   - **Using Node `npx`**:
     ```bash
     npx serve .
     ```
   - **Using VS Code**: Open with the **Live Server** extension.

3. **Open in Browser**:
   Navigate to `http://localhost:8080` (or `index.html`).

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
