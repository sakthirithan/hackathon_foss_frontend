/* ==========================================================================
   THIRUKKURAL WARRIOR QUEST — SCROLLABLE CINEMATIC GAME ENGINE (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // GAME STATE & STORAGE
  // ==========================================================================
  const gameState = {
    score: 0,
    level: 1,
    currentStage: 1,
    totalStages: 12,
    soundEnabled: true,
    bossTimer: null,
    bossTimeLeft: 10,
    bossHits: 0,
    totalBossTarget: 4
  };

  const STORAGE_KEY_SCORE = 'ta_kural_warrior_score';
  const STORAGE_KEY_STAGE = 'ta_kural_warrior_stage';

  // ==========================================================================
  // AUDIO ENGINE (LOCAL WAV FILES + SYNTH FALLBACK)
  // ==========================================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
  }

  function playSynthSound(type) {
    initAudio();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } 
    else if (type === 'clash') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } 
    else if (type === 'correct') {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.3, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } 
    else if (type === 'wrong') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } 
    else if (type === 'victory') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.15);
        gain.gain.setValueAtTime(0.4, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.6);
      });
    }
  }

  function playSound(type) {
    if (!gameState.soundEnabled) return;

    let fileName = '';
    if (type === 'click') fileName = 'click.wav';
    else if (type === 'clash') fileName = 'sword-hit.wav';
    else if (type === 'correct') fileName = 'correct.wav';
    else if (type === 'wrong') fileName = 'wrong.wav';
    else if (type === 'victory') fileName = 'victory.wav';
    else if (type === 'battle') fileName = 'battle.wav';
    else if (type === 'ambient') fileName = 'ambient-temple.wav';

    if (fileName) {
      const audio = new Audio(`assets/audio/${fileName}`);
      audio.volume = 0.4;
      audio.play().catch(() => playSynthSound(type));
    } else {
      playSynthSound(type);
    }
  }

  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');

  soundBtn.addEventListener('click', () => {
    gameState.soundEnabled = !gameState.soundEnabled;
    if (gameState.soundEnabled) {
      soundIcon.textContent = '🔊';
      playSound('click');
    } else {
      soundIcon.textContent = '🔇';
    }
  });

  // ==========================================================================
  // SCORE & PROGRESS MANAGEMENT WITH FLOATING SCORE (MINIMAL HUD)
  // ==========================================================================
  const scoreDisplay = document.getElementById('score-display');
  const progressBar = document.getElementById('progress-bar');
  const levelBadge = document.getElementById('level-badge');
  const floatingScoreContainer = document.getElementById('floating-score-container');

  function updateScore(amount) {
    gameState.score = Math.max(0, gameState.score + amount);
    scoreDisplay.textContent = gameState.score;

    // Show minimal floating score text briefly (+100)
    if (amount !== 0) {
      const floatEl = document.createElement('div');
      floatEl.className = 'floating-score-item';
      floatEl.textContent = amount > 0 ? `+${amount}` : `${amount}`;
      floatEl.style.color = amount > 0 ? '#F1D7A0' : '#FF5252';
      floatingScoreContainer.appendChild(floatEl);
      setTimeout(() => floatEl.remove(), 1200);
    }

    saveProgress();
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY_SCORE, gameState.score.toString());
      localStorage.setItem(STORAGE_KEY_STAGE, gameState.currentStage.toString());
    } catch (e) {}
  }

  function loadProgress() {
    try {
      const savedScore = localStorage.getItem(STORAGE_KEY_SCORE);
      if (savedScore !== null) {
        gameState.score = parseInt(savedScore, 10) || 0;
        scoreDisplay.textContent = gameState.score;
      }
    } catch (e) {}
  }

  // ==========================================================================
  // NATURAL SCROLLING & INTERSECTION OBSERVER
  // ==========================================================================
  function scrollToScene(stageNum) {
    const target = document.getElementById(`stage-${stageNum}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const sceneSections = document.querySelectorAll('.story-scene-section');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const stageNum = parseInt(id.replace('stage-', ''), 10);
        if (stageNum) {
          gameState.currentStage = stageNum;
          gameState.level = stageNum;

          const progressPercent = (stageNum / gameState.totalStages) * 100;
          progressBar.style.width = `${progressPercent}%`;
          levelBadge.textContent = `பயணம் ${stageNum.toString().padStart(2, '0')} / ${gameState.totalStages}`;

          const bgType = entry.target.getAttribute('data-bg') || 'temple';
          document.body.className = `bg-${bgType}`;

          if (stageNum === 11) {
            initBossStage();
          } else if (stageNum === 12) {
            renderVictoryScreen();
            playSound('victory');
            triggerConfetti();
          }

          saveProgress();
        }
      }
    });
  }, observerOptions);

  sceneSections.forEach(sec => sceneObserver.observe(sec));

  function triggerScreenShake() {
    const appWrapper = document.getElementById('app-wrapper');
    appWrapper.classList.remove('shake-screen');
    void appWrapper.offsetWidth;
    appWrapper.classList.add('shake-screen');
  }

  function triggerImpactFlash() {
    const flash = document.getElementById('impact-flash');
    if (!flash) return;
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 180);
  }

  // ==========================================================================
  // SCENE NAVIGATION & BATTLE LOGIC
  // ==========================================================================
  document.getElementById('start-journey-btn').addEventListener('click', () => {
    playSound('clash');
    scrollToScene(2);
  });

  // Scene 2 Battle Actions
  const animWarrior = document.getElementById('anim-warrior');
  const animEnemy = document.getElementById('anim-enemy');
  const animClash = document.getElementById('anim-clash');
  const gotoChap3Btn = document.getElementById('goto-chap3-btn');

  document.getElementById('cmd-attack').addEventListener('click', () => {
    playSound('clash');
    triggerScreenShake();
    triggerImpactFlash();

    animWarrior.style.transform = 'translateX(60px)';
    animEnemy.style.transform = 'translateX(-60px)';
    animClash.classList.add('active');

    setTimeout(() => {
      animEnemy.style.opacity = '0.3';
      animEnemy.style.transform = 'translateX(-100px) rotate(-15deg)';
      playSound('correct');
      updateScore(50);
      gotoChap3Btn.classList.remove('hidden');
    }, 600);
  });

  document.getElementById('cmd-block').addEventListener('click', () => {
    playSound('clash');
    animWarrior.style.transform = 'scale(1.15)';
    setTimeout(() => animWarrior.style.transform = 'scale(1)', 400);
    gotoChap3Btn.classList.remove('hidden');
  });

  gotoChap3Btn.addEventListener('click', () => {
    playSound('click');
    scrollToScene(3);
  });

  // Scene 3 -> 4 (Wounded -> Rising Up)
  document.getElementById('goto-chap4-btn').addEventListener('click', () => {
    playSound('clash');
    triggerScreenShake();
    updateScore(100);
    scrollToScene(4);
  });

  // Scene 4 -> 5
  document.getElementById('goto-chap5-btn').addEventListener('click', () => {
    playSound('click');
    scrollToScene(5);
  });

  // Scene 5 -> 6
  document.getElementById('goto-chap6-btn').addEventListener('click', () => {
    playSound('click');
    scrollToScene(6);
  });

  // Scene 6 -> 7
  document.getElementById('goto-chap7-btn').addEventListener('click', () => {
    playSound('click');
    scrollToScene(7);
  });

  // Scene 7 -> 8
  document.getElementById('goto-chap8-btn').addEventListener('click', () => {
    playSound('click');
    scrollToScene(8);
  });

  // Scene 8 -> 9
  document.getElementById('goto-chap9-btn').addEventListener('click', () => {
    playSound('click');
    scrollToScene(9);
  });

  // Idea cards click
  ['idea-1', 'idea-2', 'idea-3', 'idea-4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        playSound('correct');
        el.style.borderColor = '#F1D7A0';
        setTimeout(() => el.style.borderColor = '', 800);
      });
    }
  });

  // ==========================================================================
  // SCENE 9: CHALLENGE 1 (MULTIPLE CHOICE)
  // ==========================================================================
  const ch1Options = document.querySelectorAll('#challenge1-options .option-btn');
  const ch1Feedback = document.getElementById('challenge1-feedback');

  ch1Options.forEach(opt => {
    opt.addEventListener('click', () => {
      const isCorrect = opt.getAttribute('data-correct') === 'true';
      if (isCorrect) {
        opt.classList.add('correct-select');
        playSound('correct');
        updateScore(100);
        setTimeout(() => ch1Feedback.classList.remove('hidden'), 400);
      } else {
        opt.classList.add('wrong-select');
        playSound('wrong');
        triggerScreenShake();
        updateScore(-25);
      }
    });
  });

  document.getElementById('goto-chap10-btn').addEventListener('click', () => {
    playSound('click');
    scrollToScene(10);
  });

  // ==========================================================================
  // SCENE 10: CHALLENGE 2 (BUILD YOUR TEAM)
  // ==========================================================================
  const qualityChips = document.querySelectorAll('.quality-chip');
  const formationSlots = [
    document.getElementById('slot-1'),
    document.getElementById('slot-2'),
    document.getElementById('slot-3'),
    document.getElementById('slot-4')
  ];
  const warriorsVisualRow = document.getElementById('formation-warriors-visual');
  const ch2Feedback = document.getElementById('challenge2-feedback');

  let selectedGoodCount = 0;

  qualityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const isGood = chip.getAttribute('data-good') === 'true';
      const name = chip.getAttribute('data-name');

      if (isGood) {
        if (selectedGoodCount < 4 && !chip.classList.contains('selected-correct')) {
          chip.classList.add('selected-correct');
          playSound('correct');

          formationSlots[selectedGoodCount].textContent = name;
          formationSlots[selectedGoodCount].style.borderColor = '#81C784';

          const warriorIcon = document.createElement('span');
          warriorIcon.className = 'warrior-mini-icon';
          warriorIcon.textContent = '🛡️';
          warriorsVisualRow.appendChild(warriorIcon);

          selectedGoodCount++;

          if (selectedGoodCount === 4) {
            updateScore(150);
            setTimeout(() => {
              ch2Feedback.classList.remove('hidden');
              playSound('victory');
            }, 600);
          }
        }
      } else {
        chip.classList.add('selected-wrong');
        playSound('wrong');
        triggerScreenShake();
        updateScore(-25);
        setTimeout(() => chip.classList.remove('selected-wrong'), 400);
      }
    });
  });

  document.getElementById('goto-chap11-btn').addEventListener('click', () => {
    playSound('click');
    scrollToScene(11);
  });

  // ==========================================================================
  // SCENE 11: FINAL BOSS BATTLE (10S TIMER)
  // ==========================================================================
  const timerDisplay = document.getElementById('boss-timer');
  const bossOptBtns = document.querySelectorAll('.boss-opt-btn');

  function initBossStage() {
    clearInterval(gameState.bossTimer);
    gameState.bossTimeLeft = 10;
    gameState.bossHits = 0;
    timerDisplay.textContent = gameState.bossTimeLeft;

    bossOptBtns.forEach(btn => {
      btn.classList.remove('hit-good', 'hit-bad');
    });

    gameState.bossTimer = setInterval(() => {
      gameState.bossTimeLeft--;
      timerDisplay.textContent = gameState.bossTimeLeft;

      if (gameState.bossTimeLeft <= 0) {
        clearInterval(gameState.bossTimer);
        playSound('wrong');
        gameState.bossTimeLeft = 10;
        timerDisplay.textContent = '10';
        initBossStage();
      }
    }, 1000);
  }

  bossOptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';
      if (isCorrect && !btn.classList.contains('hit-good')) {
        btn.classList.add('hit-good');
        playSound('clash');
        triggerImpactFlash();
        gameState.bossHits++;

        if (gameState.bossHits === gameState.totalBossTarget) {
          clearInterval(gameState.bossTimer);
          updateScore(300);
          setTimeout(() => {
            scrollToScene(12);
          }, 600);
        }
      } else if (!isCorrect) {
        btn.classList.add('hit-bad');
        playSound('wrong');
        triggerScreenShake();
        updateScore(-25);
        setTimeout(() => btn.classList.remove('hit-bad'), 400);
      }
    });
  });

  // ==========================================================================
  // SCENE 12: VICTORY & RANK CALCULATION
  // ==========================================================================
  function renderVictoryScreen() {
    const finalScoreVal = document.getElementById('final-score-val');
    const finalRankTitle = document.getElementById('final-rank-title');

    finalScoreVal.textContent = gameState.score;

    let rank = 'புதிய வீரன்';
    if (gameState.score >= 900) {
      rank = 'ஞான வீரன்';
    } else if (gameState.score >= 750) {
      rank = 'குறள் காவலன்';
    } else if (gameState.score >= 550) {
      rank = 'தலைவன்';
    } else if (gameState.score >= 300) {
      rank = 'வீரன்';
    }

    finalRankTitle.textContent = rank;
  }

  document.getElementById('replay-game-btn').addEventListener('click', () => {
    playSound('click');
    scrollToScene(1);
  });

  document.getElementById('reset-progress-btn').addEventListener('click', () => {
    playSound('click');
    gameState.score = 0;
    scoreDisplay.textContent = '0';
    try {
      localStorage.removeItem(STORAGE_KEY_SCORE);
      localStorage.removeItem(STORAGE_KEY_STAGE);
    } catch(e) {}
    scrollToScene(1);
  });

  // ==========================================================================
  // CANVAS PARTICLE SYSTEM (EMBERS & CONFETTI)
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
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height + height;
      this.size = Math.random() * 3.5 + 1;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.8 + 0.2;
      this.color = Math.random() > 0.4 ? '#D77A27' : '#B84320';
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity -= 0.002;

      if (this.y < -10 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: 45 }, () => new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  function triggerConfetti() {
    for (let i = 0; i < 35; i++) {
      const p = new Particle();
      p.y = Math.random() * (height / 2);
      p.color = '#F1D7A0';
      p.size = Math.random() * 5 + 2;
      particles.push(p);
    }
  }

  loadProgress();
});
