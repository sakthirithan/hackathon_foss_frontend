# MODULE 01 — JOURNEY (`01-journey`)

## Purpose
**Introduce the world, warrior, and problem.**

The user should think:
> "Who is this warrior? Where is he going? What challenge is waiting?"

This module should feel like the opening chapter of a game.

---

## Scenes Breakdown

### Scene 01 — World Awakening
**Scene:**
Dark screen. Wind. Thunder.
Slowly reveal:
- Mountains
- Ancient temple
- Ruins
- Fire
- Smoke
- Distant battlefield

Then reveal the warrior silhouette (`assets/images/characters/warrior_front.png`).

**Text:**
- `ஒரு வீரனின் பயணம்.`
- `ஒரு குறளின் உண்மை.`

**Interaction:**
- `⚔️ பயணத்தைத் தொடங்கு`

**Animation:**
```text
black screen ➔ environment fade-in ➔ fire appears ➔ smoke moves ➔ camera moves forward ➔ warrior silhouette appears
```

---

### Scene 02 — தனியாக
**Environment:**
Mountain valley. Ancient road. Fog. Ruins.

**Character:**
Warrior walking alone.

**Animation:**
```text
warrior idle ➔ looks toward mountain ➔ grips weapon ➔ starts walking ➔ camera follows
```

**Text:**
- `தனியாகப் பயணம் தொடங்குகிறது.`

**Interaction:**
- `⚔️ முன்னேறு`

---

### Scene 03 — முதல் சவால்
Warrior reaches a ruined battlefield.

**Environment:**
- Broken shields
- Weapons
- Fire & smoke
- Ruined structures
- Distant soldiers

Enemy appears (`assets/images/enemies/enemy_warrior.png`).

**Animation:**
```text
warrior walking ➔ stops ➔ looks toward enemy ➔ enemy emerges from smoke
```

**Text:**
- `முதல் சவால்.`
- `பின்வாங்குவாயா?`

**Choices:**
- `⚔️ முன்னேறு`
- `↩️ பின்வாங்கு`

---

### Scene 04 — First Combat Introduction (Transition into Module 02)
Warrior vs first enemy. Keep battle short.

**Sequence:**
```text
enemy approaches ➔ weapon raised ➔ warrior prepares ➔ attack ➔ block ➔ impact
```

Freeze briefly.

**Transition Message:**
- `போர் தொடங்கியது.` ➔ Navigate to `MODULE 02 BATTLE` (`../02-battle/index.html`).

---

## Module 01 Responsibilities
- [x] World Awakening
- [x] Story Introduction
- [x] Warrior Introduction
- [x] Kural Introduction
- [x] First Enemy Encounter
- [x] First Combat Setup
- [x] Player Entry & State Initialization
