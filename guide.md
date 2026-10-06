# ⚔️ Thirukkural Warrior Quest — Developer & AI Agent Guide

## 📌 Architecture Overview

This project is structured into **3 page modules with strict ownership**, built with **HTML5, CSS3, Vanilla JavaScript, and 100% Tamil UI**:

```text
thirukkural-warrior-quest/
│
├── index.html                    ← Entry / Router
├── guide.md                      ← ⭐ Team + AI developer rules
│
├── modules/
│   ├── 01-journey/               ← Module 01: Journey (Landing, Kural Intro, Discovery)
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   │
│   ├── 02-battle/                ← Module 02: Battle (Combats, Fall → Rise, Team Builder)
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   │
│   └── 03-wisdom/                ← Module 03: Wisdom (Real Life, Boss Fight, Victory, Rank)
│       ├── index.html
│       ├── style.css
│       └── script.js
│
├── assets/
│   ├── images/
│   │   ├── characters/
│   │   ├── enemies/
│   │   ├── environments/
│   │   ├── effects/
│   │   └── ui/
│   │
│   └── audio/
│       ├── ambience/
│       ├── combat/
│       ├── ui/
│       └── victory/
│
└── docs/
    ├── ui-rules.md
    ├── git-workflow.md
    └── module-map.md
```

---

## 🔒 Module Ownership & Boundaries

- **Module 01 (`modules/01-journey/`)**: Owns Landing, Cinematic Intro, Warrior Introduction, Kural Reveal, Initial Environment, Start Journey.
- **Module 02 (`modules/02-battle/`)**: Owns Enemy Encounters, Combat Actions (`⚔️ தாக்கு`, `🛡️ காப்பாற்று`), Falling & Rising (`🔥 எழு`), Squad Joining, Army Formation.
- **Module 03 (`modules/03-wisdom/`)**: Owns 4 Core Rules, Real Life Challenge, Final Boss Fight (10s Timer), Wisdom Summary, Rank Calculation (`ஞான வீரன்`), Replay.

---

## 💾 Shared State Contract

State is managed globally via `localStorage` under `kuralQuest.state`:

```javascript
// Shared State Contract
const kuralQuest = {
  get state() {
    return JSON.parse(localStorage.getItem('kuralQuest.state')) || {
      currentModule: 'journey',
      currentStage: 1,
      score: 0,
      soundEnabled: true,
      battleCompleted: false,
      teamQualities: []
    };
  },
  saveState(newState) {
    const updated = { ...this.state, ...newState };
    localStorage.setItem('kuralQuest.state', JSON.stringify(updated));
    return updated;
  }
};
```

---

## 🎨 UI & Design Rules

1. **100% Tamil Language**: NO English visible anywhere in the UI.
2. **Color Palette**: Dark stone `#080808`, `#1A1512`, Burnt Orange `#D77A27`, Fire Red `#B84320`, Gold `#D6B36A`, `#F1D7A0`.
3. **Flicker-Free Buttons**: Use `transform: scale(1.03);` on hover with smooth transitions. Avoid modifying `top`, `left`, `margin`, or layout dimensions.
4. **Natural Scrolling**: HTML and Body MUST allow smooth vertical scrolling (`overflow-y: auto; overflow-x: hidden;`).

---

## 🌿 Git Branching & Commit Conventions

### Branch Names:
- `feature/journey-xxx`
- `feature/battle-xxx`
- `feature/wisdom-xxx`

### Commit Message Format:
- `feat(journey): add cinematic intro`
- `feat(battle): add warrior fall and rise sequence`
- `feat(wisdom): add final challenge`
- `fix(battle): prevent hover flicker`
- `style(wisdom): refine victory screen`
