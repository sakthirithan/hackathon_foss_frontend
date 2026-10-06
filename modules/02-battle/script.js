/* ==========================================================================
   MODULE 02 — BATTLE LOGIC ENGINE (CINEMATIC WARRIOR QUEST)
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
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else if (type === 'correct' || type === 'victory') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch(e) {}
  }

  // 2. Helper Functions
  const shakeWrapper = document.getElementById('shake-wrapper');
  function screenShake(intensity = 6, duration = 350) {
    shakeWrapper.classList.add('shaking');
    setTimeout(() => shakeWrapper.classList.remove('shaking'), duration);
  }

  function updateScore(amount) {
    currentState.score += amount;
    document.getElementById('score-display').textContent = currentState.score;

    const floatEl = document.createElement('div');
    floatEl.className = 'floating-score-item';
    floatEl.textContent = `+${amount}`;
    document.getElementById('floating-score-container').appendChild(floatEl);
    setTimeout(() => floatEl.remove(), 1300);

    kuralQuest.saveState({ score: currentState.score });
  }

  function updateProgressBar(percentage, stageLabel) {
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    if (stageLabel) document.getElementById('level-badge').textContent = stageLabel;
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
  // SCENE 01: FIRST DUEL LOGIC
  // ==========================================================================
  let duelEnemyHp = 100;
  const animWarrior1 = document.getElementById('anim-warrior-1');
  const animEnemy1 = document.getElementById('anim-enemy-1');
  const animClash1 = document.getElementById('anim-clash-1');
  const impactFlash1 = document.getElementById('impact-flash-1');
  const enemyHpBar1 = document.getElementById('enemy-hp-1');
  const gotoFallBtn = document.getElementById('goto-fall-btn');

  document.getElementById('cmd-attack-1').addEventListener('click', () => {
    playSound('clash');
    screenShake(6, 250);
    animWarrior1.style.transform = 'translateX(50px)';
    animEnemy1.style.transform = 'translateX(-50px)';
    animClash1.classList.add('active');
    impactFlash1.classList.add('active');

    duelEnemyHp = Math.max(0, duelEnemyHp - 50);
    enemyHpBar1.style.width = `${duelEnemyHp}%`;

    setTimeout(() => {
      impactFlash1.classList.remove('active');
      animClash1.classList.remove('active');
      animWarrior1.style.transform = 'translateX(0)';
      animEnemy1.style.transform = 'translateX(0)';

      if (duelEnemyHp <= 0) {
        animEnemy1.style.opacity = '0.3';
        animEnemy1.style.transform = 'translateX(-80px) rotate(-15deg)';
        playSound('correct');
        updateScore(50);
        document.getElementById('sub-text-1').textContent = '💥 எதிரி வீழ்ந்தான்! ஆனால் பெரிய சவால் காத்திருக்கிறது!';
        document.getElementById('cmd-attack-1').classList.add('hidden');
        document.getElementById('cmd-block-1').classList.add('hidden');
        gotoFallBtn.classList.remove('hidden');
      } else {
        updateScore(25);
      }
    }, 450);
  });

  document.getElementById('cmd-block-1').addEventListener('click', () => {
    playSound('click');
    animWarrior1.style.transform = 'scale(1.1)';
    setTimeout(() => animWarrior1.style.transform = 'scale(1)', 300);
    updateScore(15);
    if (duelEnemyHp <= 50) {
      gotoFallBtn.classList.remove('hidden');
    }
  });

  // Navigation to Scene 02 (Fall & Rise)
  gotoFallBtn.addEventListener('click', () => {
    playSound('click');
    document.getElementById('scene-duel').classList.add('hidden');
    const sceneFallRise = document.getElementById('scene-fall-rise');
    sceneFallRise.classList.remove('hidden');
    updateProgressBar(35, 'அழிவின்றி');
    triggerFallSequence();
  });

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
  // SCENE 04: "அறைபோகா" (Courage Stand Against Army Horizon)
  // ==========================================================================
  const cmdCourageStand = document.getElementById('cmd-courage-stand');
  const gotoAlliesBtn = document.getElementById('goto-allies-btn');

  cmdCourageStand.addEventListener('click', () => {
    playSound('clash');
    screenShake(8, 300);
    updateScore(75);
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
  // SCENE 05: "வழிவந்த" (Allies Join & Battle Line)
  // ==========================================================================
  const cmdCallAllies = document.getElementById('cmd-call-allies');
  const gotoArmyBtn = document.getElementById('goto-army-btn');

  cmdCallAllies.addEventListener('click', () => {
    playSound('correct');
    document.getElementById('ally-unit-2').classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('ally-unit-3').classList.remove('hidden');
      playSound('victory');
      updateScore(100);
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
    screenShake(10, 400);
    updateScore(150);
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
  // SCENE 07: GIANT BOSS BATTLE LOGIC
  // ==========================================================================
  let bossHp = 100;
  let bossWarriorHp = 100;
  let bossPhase = 1;

  const bossEnemyHpBar = document.getElementById('boss-enemy-hp');
  const bossWarriorHpBar = document.getElementById('boss-warrior-hp');
  const bossUnit = document.getElementById('boss-unit');
  const bossHeroSquad = document.getElementById('boss-hero-squad');
  const bossClashSymbol = document.getElementById('boss-clash-symbol');
  const bossImpactFlash = document.getElementById('boss-impact-flash');

  const cmdBossAttack = document.getElementById('cmd-boss-attack');
  const cmdBossBlock = document.getElementById('cmd-boss-block');
  const cmdBossRise = document.getElementById('cmd-boss-rise');
  const gotoWisdomModuleBtn = document.getElementById('goto-wisdom-module-btn');

  cmdBossAttack.addEventListener('click', () => {
    playSound('clash');
    screenShake(8, 300);
    bossHeroSquad.style.transform = 'translateX(40px)';
    bossUnit.style.transform = 'translateX(-40px)';
    bossClashSymbol.classList.add('active');
    bossImpactFlash.classList.add('active');

    if (bossPhase === 1) {
      bossHp = Math.max(50, bossHp - 25);
      bossEnemyHpBar.style.width = `${bossHp}%`;

      setTimeout(() => {
        bossImpactFlash.classList.remove('active');
        bossClashSymbol.classList.remove('active');
        bossHeroSquad.style.transform = 'translateX(0)';
        bossUnit.style.transform = 'translateX(0)';
        updateScore(50);

        if (bossHp <= 50) {
          // Boss Counter Slam (Phase 2)
          triggerBossSlamPhase();
        }
      }, 400);
    } else if (bossPhase === 3) {
      // Phase 3 Ultimate Team Attack
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
    bossHeroSquad.style.transform = 'scale(1.08)';
    setTimeout(() => bossHeroSquad.style.transform = 'scale(1)', 300);
    updateScore(20);
  });

  function triggerBossSlamPhase() {
    bossPhase = 2;
    screenShake(12, 500);
    playSound('clash');
    bossWarriorHp = 30;
    bossWarriorHpBar.style.width = `30%`;

    document.getElementById('sub-text-boss').textContent = '💥 அரக்கன் கடுமையாகத் தாக்கினான்! வீரன் முழங்காலிட்டான்! எழும் நேரமிது!';
    bossHeroSquad.style.transform = 'translateY(25px) rotate(-15deg)';

    cmdBossAttack.classList.add('hidden');
    cmdBossBlock.classList.add('hidden');
    cmdBossRise.classList.remove('hidden');
  }

  cmdBossRise.addEventListener('click', () => {
    playSound('victory');
    bossPhase = 3;
    screenShake(6, 250);
    updateScore(100);

    bossWarriorHp = 100;
    bossWarriorHpBar.style.width = `100%`;
    bossHeroSquad.style.transform = 'translateY(0) rotate(0deg) scale(1.1)';

    document.getElementById('sub-text-boss').textContent = '🔥 வீரன் மீண்டும் எழுந்தான்! படையுடன் இணைந்து அரக்கனை வீழ்த்து!';
    cmdBossRise.classList.add('hidden');
    cmdBossAttack.classList.remove('hidden');
    cmdBossAttack.textContent = '⚔️ இறுதி கூட்டுத் தாக்குதல்!';
  });

  function triggerBossDefeat() {
    playSound('victory');
    screenShake(14, 600);
    updateScore(200);

    const bossSpriteImg = document.getElementById('boss-sprite-img');
    bossSpriteImg.style.opacity = '0.2';
    bossSpriteImg.style.transform = 'translateY(50px) rotate(-20deg) scale(0.8)';

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
