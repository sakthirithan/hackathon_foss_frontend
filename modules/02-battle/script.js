/* ==========================================================================
   MODULE 02 — BATTLE LOGIC ENGINE (EXTREME CINEMATIC COMBAT UPGRADE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Shared State Contract
  const kuralQuest = {
    get state() {
      return JSON.parse(localStorage.getItem('kuralQuest.state')) || {
        currentModule: 'battle',
        currentStage: 2,
        score: 0,
        soundEnabled: true,
        battleCompleted: false
      };
    },
    saveState(newState) {
      const updated = { ...this.state, ...newState };
      localStorage.setItem('kuralQuest.state', JSON.stringify(updated));
      return updated;
    }
  };

  const currentState = kuralQuest.state;
  document.getElementById('score-display').textContent = currentState.score;

  // Sound Engine with Web Audio Synthesizer Fallback
  let audioCtx = null;
  function playSound(type) {
    if (!currentState.soundEnabled) return;
    try {
      let fileName = 'sword-hit.wav';
      if (type === 'click') fileName = 'click.wav';
      if (type === 'correct') fileName = 'correct.wav';
      if (type === 'victory') fileName = 'victory.wav';

      const audio = new Audio(`../../assets/audio/combat/${fileName}`);
      audio.volume = 0.45;
      audio.play().catch(() => playSynthSound(type));
    } catch(e) {
      playSynthSound(type);
    }
  }

  function playSynthSound(type) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'clash' || type === 'attack') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else if (type === 'heartbeat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(70, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === 'correct' || type === 'victory') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch(e) {}
  }

  // Camera & Visual FX Helpers
  const shakeWrapper = document.getElementById('shake-wrapper');
  function screenShake(intensity = 8, duration = 350) {
    shakeWrapper.classList.add('shaking');
    setTimeout(() => shakeWrapper.classList.remove('shaking'), duration);
  }

  const lowHpVignette = document.getElementById('low-hp-vignette');
  function checkLowHpVignette(playerHp) {
    if (playerHp <= 25) {
      lowHpVignette.classList.add('active');
      playSynthSound('heartbeat');
    } else {
      lowHpVignette.classList.remove('active');
    }
  }

  // Combo System
  let comboCount = 0;
  let comboTimer = null;
  const comboHud = document.getElementById('combo-hud');
  const comboCountEl = document.getElementById('combo-count');

  function registerComboHit() {
    comboCount++;
    comboCountEl.textContent = comboCount;
    comboHud.classList.remove('hidden');

    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
      comboCount = 0;
      comboHud.classList.add('hidden');
    }, 2200);
  }

  function updateScore(amount) {
    const multiplier = comboCount > 1 ? 1 + Math.min(comboCount * 0.2, 1.5) : 1;
    const finalAmount = Math.round(amount * multiplier);

    currentState.score += finalAmount;
    document.getElementById('score-display').textContent = currentState.score;

    const floatEl = document.createElement('div');
    floatEl.className = 'floating-score-item';
    floatEl.textContent = `+${finalAmount}${comboCount > 1 ? ` (x${multiplier.toFixed(1)})` : ''}`;
    document.getElementById('floating-score-container').appendChild(floatEl);
    setTimeout(() => floatEl.remove(), 1300);

    kuralQuest.saveState({ score: currentState.score });
  }

  function updateProgressBar(percentage, stageLabel) {
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    if (stageLabel) document.getElementById('level-badge').textContent = stageLabel;
  }

  function triggerPerfectBlockAlert() {
    const alertEl = document.getElementById('perfect-block-alert');
    alertEl.classList.remove('hidden');
    setTimeout(() => alertEl.classList.add('hidden'), 1000);
  }

  // Sound Toggle Handler
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  soundBtn.addEventListener('click', () => {
    currentState.soundEnabled = !currentState.soundEnabled;
    soundIcon.textContent = currentState.soundEnabled ? '🔊' : '🔇';
    kuralQuest.saveState({ soundEnabled: currentState.soundEnabled });
  });

  // ==========================================================================
  // ENEMY & ALLY CONFIGURATION SYSTEM
  // ==========================================================================
  const enemyTypes = {
    basic: { name: '⚔️ எளிய எதிரி', hp: 100, damage: 15, speed: 1.0, filter: 'none' },
    heavy: { name: '🔨 கனமான வீரன்', hp: 160, damage: 28, speed: 0.75, filter: 'hue-rotate(-30deg) brightness(0.8)' },
    assassin: { name: '🗡️ விரைவு தாக்குபவன்', hp: 80, damage: 20, speed: 1.5, filter: 'hue-rotate(120deg) brightness(1.2)' },
    shield: { name: '🛡️ கேடயக் காவலாளி', hp: 140, damage: 12, speed: 0.85, filter: 'sepia(0.6) hue-rotate(80deg)' },
    boss: { name: '🔥 பய அரக்கன் (Boss)', hp: 250, damage: 35, speed: 0.9, filter: 'drop-shadow(0 0 25px #FF1744)' }
  };

  let currentEnemyKey = 'basic';
  let duelPlayerHp = 100;
  let duelEnemyHp = enemyTypes.basic.hp;
  let enemyAttackTimer = null;
  let isEnemyTelegraphed = false;
  let perfectBlockWindow = false;

  const warriorHpBar1 = document.getElementById('warrior-hp-1');
  const enemyHpBar1 = document.getElementById('enemy-hp-1');
  const enemyNameLabel = document.getElementById('enemy-name-label');
  const enemyTypeBadge = document.getElementById('enemy-type-badge');
  const enemySprite1 = document.getElementById('enemy-sprite-1');
  const animWarrior1 = document.getElementById('anim-warrior-1');
  const animEnemy1 = document.getElementById('anim-enemy-1');
  const animClash1 = document.getElementById('anim-clash-1');
  const impactFlash1 = document.getElementById('impact-flash-1');
  const enemyWarning1 = document.getElementById('enemy-warning-1');
  const cmdCounter1 = document.getElementById('cmd-counter-1');
  const gotoFallBtn = document.getElementById('goto-fall-btn');

  function setEnemyType(typeKey) {
    currentEnemyKey = typeKey;
    const config = enemyTypes[typeKey];
    duelEnemyHp = config.hp;
    enemyNameLabel.textContent = `${config.name} HP`;
    enemyTypeBadge.textContent = config.name;
    enemySprite1.style.filter = config.filter;
    enemyHpBar1.style.width = '100%';
  }

  // Automated Telegraphed Enemy Attack Scheduler
  function scheduleEnemyAttack() {
    if (duelEnemyHp <= 0 || duelPlayerHp <= 0) return;

    const interval = Math.max(2200, 3800 / enemyTypes[currentEnemyKey].speed);
    enemyAttackTimer = setTimeout(() => {
      if (duelEnemyHp <= 0 || duelPlayerHp <= 0) return;

      // Telegraph warning
      isEnemyTelegraphed = true;
      perfectBlockWindow = true;
      enemyWarning1.classList.remove('hidden');

      setTimeout(() => {
        perfectBlockWindow = false;
      }, 400);

      // Execute attack if player didn't perfect block
      setTimeout(() => {
        enemyWarning1.classList.add('hidden');
        if (isEnemyTelegraphed && duelEnemyHp > 0) {
          executeEnemyAttack();
        }
        isEnemyTelegraphed = false;
        scheduleEnemyAttack();
      }, 700);

    }, interval);
  }

  function executeEnemyAttack() {
    playSound('clash');
    screenShake(10, 350);
    animEnemy1.style.transform = 'translateX(-70px)';

    const damage = enemyTypes[currentEnemyKey].damage;
    duelPlayerHp = Math.max(0, duelPlayerHp - damage);
    warriorHpBar1.style.width = `${duelPlayerHp}%`;
    checkLowHpVignette(duelPlayerHp);

    setTimeout(() => {
      animEnemy1.style.transform = 'translateX(0)';

      if (duelPlayerHp <= 25) {
        document.getElementById('sub-text-1').textContent = '⚠️ வீரன் பலத்த காயமடைந்தான்! எழும் நேரமிது!';
        gotoFallBtn.classList.remove('hidden');
        clearTimeout(enemyAttackTimer);
      }
    }, 400);
  }

  // Player Attack Action
  document.getElementById('cmd-attack-1').addEventListener('click', () => {
    playSound('clash');
    screenShake(6, 250);
    registerComboHit();

    animWarrior1.style.transform = 'translateX(55px)';
    animEnemy1.style.transform = 'translateX(-40px)';
    animClash1.classList.add('active');
    impactFlash1.classList.add('active');

    const damage = 40 + Math.min(comboCount * 5, 25);
    duelEnemyHp = Math.max(0, duelEnemyHp - damage);
    enemyHpBar1.style.width = `${(duelEnemyHp / enemyTypes[currentEnemyKey].hp) * 100}%`;

    setTimeout(() => {
      impactFlash1.classList.remove('active');
      animClash1.classList.remove('active');
      animWarrior1.style.transform = 'translateX(0)';
      animEnemy1.style.transform = 'translateX(0)';

      if (duelEnemyHp <= 0) {
        animEnemy1.style.opacity = '0.3';
        animEnemy1.style.transform = 'translateX(-90px) rotate(-20deg)';
        playSound('correct');
        updateScore(75);

        // Switch to Heavy Enemy if basic defeated
        if (currentEnemyKey === 'basic') {
          setTimeout(() => {
            setEnemyType('heavy');
            animEnemy1.style.opacity = '1';
            animEnemy1.style.transform = 'translateX(0)';
            document.getElementById('sub-text-1').textContent = '🔨 அடுத்த பலமான எதிரி முன்னேறுகிறான்! கவனமாக போரிடு!';
          }, 1000);
        } else {
          document.getElementById('sub-text-1').textContent = '💥 எதிரிப்படை வீழ்ந்தது! சவாலைத் தொடர்க!';
          document.getElementById('cmd-attack-1').classList.add('hidden');
          document.getElementById('cmd-block-1').classList.add('hidden');
          gotoFallBtn.classList.remove('hidden');
          clearTimeout(enemyAttackTimer);
        }
      } else {
        updateScore(25);
        // Show counter attack window if enemy was recovering
        if (Math.random() > 0.6) {
          cmdCounter1.classList.remove('hidden');
          setTimeout(() => cmdCounter1.classList.add('hidden'), 1200);
        }
      }
    }, 450);
  });

  // Player Block Action (With Perfect Block Support)
  document.getElementById('cmd-block-1').addEventListener('click', () => {
    playSound('click');
    animWarrior1.style.transform = 'scale(1.12)';

    if (perfectBlockWindow) {
      // Perfect Block Triggered!
      isEnemyTelegraphed = false;
      perfectBlockWindow = false;
      enemyWarning1.classList.add('hidden');
      playSound('victory');
      triggerPerfectBlockAlert();
      screenShake(5, 200);
      updateScore(60);

      // Restore +10 HP on Perfect Block
      duelPlayerHp = Math.min(100, duelPlayerHp + 10);
      warriorHpBar1.style.width = `${duelPlayerHp}%`;
      checkLowHpVignette(duelPlayerHp);

      animEnemy1.style.transform = 'translateX(40px)';
      setTimeout(() => animEnemy1.style.transform = 'translateX(0)', 300);
    } else {
      updateScore(15);
    }

    setTimeout(() => animWarrior1.style.transform = 'scale(1)', 300);
    if (duelEnemyHp <= 40 || duelPlayerHp <= 30) {
      gotoFallBtn.classList.remove('hidden');
    }
  });

  // Player Counter Attack Action
  cmdCounter1.addEventListener('click', () => {
    playSound('clash');
    screenShake(9, 300);
    registerComboHit();
    cmdCounter1.classList.add('hidden');

    animWarrior1.style.transform = 'translateX(70px) scale(1.1)';
    animEnemy1.style.transform = 'translateX(-80px)';
    animClash1.classList.add('active');

    duelEnemyHp = Math.max(0, duelEnemyHp - 65);
    enemyHpBar1.style.width = `${(duelEnemyHp / enemyTypes[currentEnemyKey].hp) * 100}%`;

    setTimeout(() => {
      animClash1.classList.remove('active');
      animWarrior1.style.transform = 'translateX(0) scale(1)';
      animEnemy1.style.transform = 'translateX(0)';
      updateScore(80);
      playSound('correct');
    }, 400);
  });

  // Navigation to Scene 02 (Fall & Rise)
  gotoFallBtn.addEventListener('click', () => {
    playSound('click');
    clearTimeout(enemyAttackTimer);
    document.getElementById('scene-duel').classList.add('hidden');
    const sceneFallRise = document.getElementById('scene-fall-rise');
    sceneFallRise.classList.remove('hidden');
    updateProgressBar(35, 'அழிவின்றி');
    triggerFallSequence();
  });

  // Start initial enemy attack loop
  scheduleEnemyAttack();

  // ==========================================================================
  // SCENE 02 & 03: FALL & RISE SEQUENCE ("அழிவின்றி")
  // ==========================================================================
  const risingWarriorImg = document.getElementById('rising-warrior-img');
  const poseText = document.getElementById('pose-text');
  const wordReveal1 = document.getElementById('word-reveal-1');
  const subText2 = document.getElementById('sub-text-2');
  const cmdRiseUp = document.getElementById('cmd-rise-up');
  const gotoCourageBtn = document.getElementById('goto-courage-btn');
  const heroAuraGlow = document.getElementById('hero-aura-glow');

  function triggerFallSequence() {
    risingWarriorImg.className = 'warrior-render-img warrior-side-fell';
    poseText.textContent = '💥 "காயமடைந்த வீரன் கீழே விழுந்தான்..."';
  }

  cmdRiseUp.addEventListener('click', () => {
    playSound('clash');
    cmdRiseUp.classList.add('hidden');

    // Multi-stage cinematic rise
    poseText.textContent = '✋ "கை நிலத்தைத் தொடுகிறது..."';
    setTimeout(() => {
      risingWarriorImg.className = 'warrior-render-img warrior-side-kneel';
      poseText.textContent = '🧎 "மெதுவாக முழங்காலிட்டு எழுகிறான்..."';
      screenShake(4, 200);
    }, 700);

    setTimeout(() => {
      risingWarriorImg.className = 'warrior-render-img warrior-side-stood';
      heroAuraGlow.classList.add('active');
      poseText.textContent = '💪 "கோடாரியை ஏந்தி உறுதியுடன் நிமிர்ந்து நிற்கிறான்!"';
      wordReveal1.classList.remove('hidden');
      subText2.textContent = 'அழிவின்றி — எளிதில் அழியாமல், துன்பம் வந்தாலும் உறுதியோடு மீண்டும் எழுவது!';
      playSound('victory');
      updateScore(100);
      gotoCourageBtn.classList.remove('hidden');
    }, 1600);
  });

  // Navigation to Scene 04 (Courage)
  gotoCourageBtn.addEventListener('click', () => {
    playSound('click');
    document.getElementById('scene-fall-rise').classList.add('hidden');
    document.getElementById('scene-courage').classList.remove('hidden');
    updateProgressBar(50, 'அறைபோகா');
  });

  // ==========================================================================
  // SCENE 04: "அறைபோகா" (Stand Firm Against Enemy Army)
  // ==========================================================================
  const cmdCourageStand = document.getElementById('cmd-courage-stand');
  const gotoAlliesBtn = document.getElementById('goto-allies-btn');

  cmdCourageStand.addEventListener('click', () => {
    playSound('clash');
    screenShake(10, 350);
    updateScore(80);
    document.getElementById('sub-text-3').textContent = '🔥 அறைபோகா — பகைவர் படை எவ்வளவு பெரியதாயினும் பயந்து ஓடாத வீரம்!';
    cmdCourageStand.classList.add('hidden');
    gotoAlliesBtn.classList.remove('hidden');
  });

  gotoAlliesBtn.addEventListener('click', () => {
    playSound('click');
    document.getElementById('scene-courage').classList.add('hidden');
    document.getElementById('scene-allies').classList.remove('hidden');
    updateProgressBar(65, 'வழிவந்த');
  });

  // ==========================================================================
  // SCENE 05: "வழிவந்த" (Allies Arrive & Battle Line)
  // ==========================================================================
  const cmdCallAllies = document.getElementById('cmd-call-allies');
  const gotoArmyBtn = document.getElementById('goto-army-btn');

  cmdCallAllies.addEventListener('click', () => {
    playSound('correct');
    document.getElementById('ally-unit-2').classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('ally-unit-3').classList.remove('hidden');
      playSound('victory');
      updateScore(120);
      document.getElementById('sub-text-4').textContent = '👥 வழிவந்த — பாரம்பரிய மரபுவழி வந்த தோழர்கள் ஒன்றாக திரண்டனர்!';
      cmdCallAllies.classList.add('hidden');
      gotoArmyBtn.classList.remove('hidden');
    }, 600);
  });

  gotoArmyBtn.addEventListener('click', () => {
    playSound('click');
    document.getElementById('scene-allies').classList.add('hidden');
    document.getElementById('scene-army').classList.remove('hidden');
    updateProgressBar(80, 'வன்கணதுவே படை');
  });

  // ==========================================================================
  // SCENE 06: "படை" (Full Army Formation & Squad Combat)
  // ==========================================================================
  const cmdSquadAttack = document.getElementById('cmd-squad-attack');
  const gotoBossBtn = document.getElementById('goto-boss-btn');

  cmdSquadAttack.addEventListener('click', () => {
    playSound('clash');
    screenShake(12, 450);
    updateScore(160);
    document.getElementById('sub-text-5').textContent = '🛡️ படை — துணிவுடன் ஒன்றாக இணைந்து நிற்கும் பெரும் வீரப்படை!';
    cmdSquadAttack.classList.add('hidden');
    gotoBossBtn.classList.remove('hidden');
  });

  gotoBossBtn.addEventListener('click', () => {
    playSound('click');
    document.getElementById('scene-army').classList.add('hidden');
    document.getElementById('scene-boss').classList.remove('hidden');
    updateProgressBar(90, 'இறுதி அரக்கன்');
  });

  // ==========================================================================
  // SCENE 07: GIANT BOSS BATTLE LOGIC WITH RAGE PHASES & RECOVERY
  // ==========================================================================
  let bossHp = 250;
  let bossMaxHp = 250;
  let bossWarriorHp = 100;
  let bossPhase = 1;

  const bossEnemyHpBar = document.getElementById('boss-enemy-hp');
  const bossWarriorHpBar = document.getElementById('boss-warrior-hp');
  const bossUnit = document.getElementById('boss-unit');
  const bossHeroSquad = document.getElementById('boss-hero-squad');
  const bossClashSymbol = document.getElementById('boss-clash-symbol');
  const bossImpactFlash = document.getElementById('boss-impact-flash');
  const bossSpriteImg = document.getElementById('boss-sprite-img');

  const cmdBossAttack = document.getElementById('cmd-boss-attack');
  const cmdBossBlock = document.getElementById('cmd-boss-block');
  const cmdBossRise = document.getElementById('cmd-boss-rise');
  const gotoWisdomModuleBtn = document.getElementById('goto-wisdom-module-btn');

  cmdBossAttack.addEventListener('click', () => {
    playSound('clash');
    screenShake(10, 350);
    registerComboHit();

    bossHeroSquad.style.transform = 'translateX(45px)';
    bossUnit.style.transform = 'translateX(-45px)';
    bossClashSymbol.classList.add('active');
    bossImpactFlash.classList.add('active');

    if (bossPhase === 1) {
      bossHp = Math.max(120, bossHp - 45);
      bossEnemyHpBar.style.width = `${(bossHp / bossMaxHp) * 100}%`;

      setTimeout(() => {
        bossImpactFlash.classList.remove('active');
        bossClashSymbol.classList.remove('active');
        bossHeroSquad.style.transform = 'translateX(0)';
        bossUnit.style.transform = 'translateX(0)';
        updateScore(60);

        if (bossHp <= 120) {
          triggerBossSlamPhase();
        }
      }, 400);
    } else if (bossPhase === 3) {
      // Phase 3 Ultimate Team Combo Strike
      bossHp = 0;
      bossEnemyHpBar.style.width = `0%`;
      setTimeout(() => {
        bossImpactFlash.classList.remove('active');
        bossClashSymbol.classList.remove('active');
        triggerBossDefeat();
      }, 400);
    }
  });

  cmdBossBlock.addEventListener('click', () => {
    playSound('click');
    bossHeroSquad.style.transform = 'scale(1.1)';
    setTimeout(() => bossHeroSquad.style.transform = 'scale(1)', 300);
    updateScore(25);
  });

  function triggerBossSlamPhase() {
    bossPhase = 2;
    screenShake(14, 550);
    playSound('clash');
    bossWarriorHp = 25;
    bossWarriorHpBar.style.width = `25%`;
    checkLowHpVignette(25);

    // Boss Rage Visual
    bossSpriteImg.style.filter = 'drop-shadow(0 0 35px #FF1744) brightness(1.2) scale(1.1)';

    document.getElementById('sub-text-boss').textContent = '💥 அரக்கன் கடுமையாகத் தாக்கினான்! வீரன் முழங்காலிட்டான்! எழும் நேரமிது!';
    bossHeroSquad.style.transform = 'translateY(25px) rotate(-15deg)';

    cmdBossAttack.classList.add('hidden');
    cmdBossBlock.classList.add('hidden');
    cmdBossRise.classList.remove('hidden');
  }

  cmdBossRise.addEventListener('click', () => {
    playSound('victory');
    bossPhase = 3;
    screenShake(8, 300);
    updateScore(120);

    bossWarriorHp = 100;
    bossWarriorHpBar.style.width = `100%`;
    checkLowHpVignette(100);

    bossHeroSquad.style.transform = 'translateY(0) rotate(0deg) scale(1.1)';
    document.getElementById('sub-text-boss').textContent = '🔥 வீரன் மீண்டும் எழுந்தான்! படையுடன் இணைந்து அரக்கனை வீழ்த்து!';
    cmdBossRise.classList.add('hidden');
    cmdBossAttack.classList.remove('hidden');
    cmdBossAttack.textContent = '⚔️ இறுதி கூட்டுத் தாக்குதல்!';
  });

  function triggerBossDefeat() {
    playSound('victory');
    screenShake(16, 700);
    updateScore(250);

    bossSpriteImg.style.opacity = '0.15';
    bossSpriteImg.style.transform = 'translateY(60px) rotate(-25deg) scale(0.75)';

    document.getElementById('sub-text-boss').textContent = '🏆 பய அரக்கன் வீழ்ந்தான்! போர் வெற்றியில் முடிந்தது!';
    cmdBossAttack.classList.add('hidden');
    cmdBossBlock.classList.add('hidden');
    gotoWisdomModuleBtn.classList.remove('hidden');

    updateProgressBar(100, 'வெற்றி!');
  }

  // Navigation to Module 03 Wisdom
  gotoWisdomModuleBtn.addEventListener('click', () => {
    playSound('click');
    kuralQuest.saveState({
      currentModule: 'wisdom',
      currentStage: 7,
      battleCompleted: true
    });
    window.location.href = '../03-wisdom/index.html';
  });

  // ==========================================================================
  // CANVAS PARTICLE ENGINE (Ember Particles)
  // ==========================================================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height + height;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.8 + 0.2;
      this.color = Math.random() > 0.4 ? '#D77A27' : '#B84320';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity -= 0.002;
      if (this.y < -10 || this.opacity <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particleCount = window.innerWidth < 480 ? 20 : 35;
  const particles = Array.from({ length: particleCount }, () => new Particle());

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

});
