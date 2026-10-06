# MODULE 02 — BATTLE (`02-battle`)

## Purpose
This is the **main attraction**. The audience spends most of their interactive time here.
This module explains the Thirukkural through **ACTION** rather than text.

---

## Scenes Breakdown

### Scene 05 — First Real Battle
**Environment:**
Full battlefield (`assets/images/environments/battlefield_bg.jpg`).
Warrior on left (`assets/images/characters/warrior_battle.png`).
Enemy on right (`assets/images/enemies/enemy_warrior.png`).

**Sequence:**
```text
enemy approaches ➔ warrior prepares ➔ enemy attacks ➔ warrior blocks ➔ impact ➔ warrior counterattacks ➔ enemy staggers
```

**Player Interaction:**
- `🛡️ காப்பாற்று`
- `⚔️ தாக்கு`

---

### Scene 06 — வீழ்ச்சி (The Fall)
A stronger enemy appears.

**Sequence:**
```text
enemy attack ➔ warrior blocks ➔ impact ➔ warrior stagger ➔ knees bend ➔ weapon drops ➔ warrior falls ➔ dust
```

**Camera & Audio:**
Camera follows warrior down. Battle music stops. Only breathing, wind, fire.

**Text:**
- `விழுந்தான்.`
- `ஆனால்... முடிவடையவில்லை.`

---

### Scene 07 — எழு (The Rise / அழிவின்றி)
**Signature Hackathon Scene.** Warrior lies on the ground.

**Animation:**
```text
finger moves ➔ hand touches ground ➔ head rises ➔ body moves ➔ kneels
```

**Player Interaction:**
- `🔥 எழு`

**Sequence on click:**
Pushes ground ➔ kneeling ➔ stands halfway ➔ reaches weapon (`assets/images/weapons/weapon_axe.png`) ➔ grabs weapon ➔ stands ➔ battle stance.

**Camera & Lighting:**
Low-angle heroic shot. Dark ➔ orange/gold lighting transition.

**Reveal:**
# அழிவின்றி
`விழுந்தாலும் எழு.` (No long paragraph!)

---

### Scene 08 — அறைபோகா (Courage / Stand Firm)
Warrior standing. Huge enemy army appears on horizon.
Warrior takes one step back ➔ stops ➔ turns toward enemy ➔ raises weapon.

**Player Interaction:**
- `🔥 துணிவுடன் நில்`

**Animation:**
```text
foot plants ➔ weapon rises ➔ wind increases ➔ camera rotates ➔ warrior faces army
```

**Reveal:**
# அறைபோகா
`பயந்து பின்வாங்காதே.`

---

### Scene 09 — தனியாகப் போராடு (Overwhelmed)
Warrior fights multiple enemies alone.

**Sequence:**
Enemy 1 attacks ➔ block. Enemy 2 attacks ➔ dodge. Warrior counterattacks. Enemy 3 attacks ➔ warrior overwhelmed.

**Text:**
- `துணிவு மட்டும் போதுமா?` (Prepares player for teamwork)

---

### Scene 10 — ஒரு நண்பன் (An Ally Arrives)
A second warrior arrives.

**Animation:**
Distant silhouette ➔ runs ➔ enters battlefield ➔ lands beside warrior ➔ raises weapon.
Main warrior looks at him ➔ nods.

**Text:**
- `ஒருவன் வந்தான்.`
- `இருவர் ஆனார்கள்.`

---

### Scene 11 — வழிவந்த (Team Unity)
More warriors arrive (Warrior 1 ➔ 2 ➔ 3 ➔ 4). They form a battle line.

**Player Interaction:**
- `🤝 ஒன்றாக நில்`

**Animation:**
All warriors turn ➔ step forward ➔ raise weapons ➔ form battle line.

**Reveal:**
# வழிவந்த
`ஒன்றாகச் சேர்ந்தனர்.`

---

### Scene 12 — Team Battle
Warriors fight together with staggered combat timing.

**Sequence:**
```text
Warrior 1 attacks ➔ Enemy blocks ➔ Warrior 2 attacks ➔ Enemy pushed ➔ Warrior 3 attacks ➔ Enemy falls ➔ Warrior 4 protects Warrior 1
```

**Player Interaction:**
- `⚔️ ஒன்றாகத் தாக்கு`

**Effects:**
Weapon trails, sparks, dust, smoke, impact flash, screen shake, enemy knockback.

**Text:**
- `தனியாக வலிமை.`
- `ஒன்றாக பெரும் வலிமை.`

---

### Scene 13 — படை உருவாகிறது (Army Formation)
Big visual reveal. Camera pulls back from 4 warriors ➔ 10 ➔ 20 ➔ full army with banners and fire.

**Reveal:**
# படை
`துணிவுடன் ஒன்றாக நிற்கும் வலிமை.`

---

### Scene 14 — பெரும் போர்க்களம் (Full-Scale War)
Full-scale battle. Background animated with smoke, flags, warriors. Foreground combat.

---

### Scene 15 — Final Enemy (Boss Intro)
Battle becomes silent. Smoke fills screen. Giant silhouette appears ➔ reveal Boss (`assets/images/enemies/enemy_boss.png`).

**Text:**
- `இறுதி சோதனை.`
- `பயம் முன்னால் நிற்கிறது.`

---

### Scene 16 — Boss Battle
- **Phase 1:** Boss attacks ➔ `🛡️ காப்பாற்று`
- **Phase 2:** Boss attacks ➔ `↔️ விலகு`
- **Phase 3:** Warrior hit ➔ falls to knee ➔ `🔥 எழு` (rises instantly)
- **Phase 4:** Allies join ➔ `🤝 ஒன்றாகத் தாக்கு` (staggered combo attack ➔ Boss falls!)

Save state `battleCompleted = true` and route to Module 03 Wisdom.

---

## Module 02 Responsibilities
- [x] Full Combat Engine & Health HUD
- [x] Interactive Attacks & Blocks
- [x] Warrior Fall & Rise Sequence (`அழிவின்றி`)
- [x] Courage Stand (`அறைபோகா`)
- [x] Ally Arrival & Line Formation (`வழிவந்த`)
- [x] Team Battle & Army Reveal (`படை`)
- [x] Boss Battle with Phase Transitions
