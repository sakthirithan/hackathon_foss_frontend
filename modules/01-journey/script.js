/* ==========================================================================
   MODULE 01 — JOURNEY LOGIC & ADVANCED CINEMATIC ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Shared Game State Contract
  const kuralQuest = {
    get state() {
      try {
        return JSON.parse(localStorage.getItem('kuralQuest.state')) || this.defaultState;
      } catch (e) {
        return this.defaultState;
      }
    },
    defaultState: {
      currentModule: 'journey',
      currentScene: 1,
      score: 0,
      soundEnabled: true,
      battleStarted: false,
      battleCompleted: false,
      wisdomCompleted: false
    },
    saveState(newState) {
      try {
        const updated = { ...this.state, ...newState };
        localStorage.setItem('kuralQuest.state', JSON.stringify(updated));
        return updated;
      } catch (e) {
        return newState;
      }
    }
  };

  const currentState = kuralQuest.state;
  const scoreDisplay = document.getElementById('score-display');
  if (scoreDisplay) scoreDisplay.textContent = currentState.score;

  // 2. Audio Manager with Web Audio Synthesizer Fallback
  class SoundManager {
    constructor() { this.ctx = null; }

    initWebAudio() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
    }

    playSound(type) {
      if (!kuralQuest.state.soundEnabled) return;

      let fileMap = {
        clash: 'sword-hit.wav',
        victory: 'victory.wav',
        click: 'click.wav'
      };

      let audioFile = fileMap[type] || 'click.wav';
      let audio = new Audio(`../../assets/audio/ui/${audioFile}`);
      audio.volume = 0.5;

      audio.play().catch(() => this.synthSound(type));
    }

    synthSound(type) {
      try {
        this.initWebAudio();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        if (type === 'clash') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.start(now); osc.stop(now + 0.15);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now); osc.stop(now + 0.1);
        }
      } catch (e) {}
    }
  }

  const soundManager = new SoundManager();

  // Sound Toggle Handler
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const active = !kuralQuest.state.soundEnabled;
      kuralQuest.saveState({ soundEnabled: active });
      if (soundIcon) soundIcon.textContent = active ? '🔊' : '🔇';
      if (active) soundManager.playSound('click');
    });
  }

  // 3. Camera Controller
  const CameraController = {
    shake() {
      const stage = document.getElementById('viewport-stage');
      if (stage) {
        stage.classList.add('camera-shake');
        setTimeout(() => stage.classList.remove('camera-shake'), 350);
      }
    }
  };

  // 4. Reusable Character Controller
  const CharacterController = {
    setCharacterPose(heroImgId, pose) {
      const img = document.getElementById(heroImgId);
      if (!img) return;

      const poseMap = {
        idle: '../../assets/images/characters/warrior_front.png',
        walk: '../../assets/images/characters/warrior_side.png',
        ready: '../../assets/images/characters/warrior_battle.png',
        attack: '../../assets/images/characters/warrior_battle.png'
      };

      if (poseMap[pose]) img.src = poseMap[pose];
    }
  };

  // 5. Environmental Lightning Flash Engine
  function triggerLightningFlash() {
    const lightningLayer = document.getElementById('lightning-flash');
    if (!lightningLayer) return;

    lightningLayer.classList.add('lightning');
    setTimeout(() => {
      lightningLayer.classList.remove('lightning');
      setTimeout(() => {
        lightningLayer.classList.add('lightning');
        setTimeout(() => lightningLayer.classList.remove('lightning'), 60);
      }, 100);
    }, 80);
  }

  setInterval(() => {
    if (SceneManager.currentSceneId === 'scene-01' || SceneManager.currentSceneId === 'scene-03') {
      if (Math.random() > 0.65) triggerLightningFlash();
    }
  }, 12000);

  // 6. Interactive Parallax Pointer Effect
  window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 15;

    const bgLayer = document.querySelector('.active-scene .parallax-bg-layer');
    if (bgLayer) {
      bgLayer.style.transform = `scale(1.05) translate(${mouseX * 0.4}px, ${mouseY * 0.4}px)`;
    }

    const heroContainer = document.querySelector('.active-scene .stage-hero-container');
    if (heroContainer) {
      heroContainer.style.transform = `translate(${mouseX * 0.8}px, ${mouseY * 0.8}px)`;
    }
  });

  // 7. Scene Manager
  const SceneManager = {
    scenes: ['scene-01', 'scene-02', 'scene-03', 'scene-04'],
    currentSceneId: 'scene-01',

    goTo(targetSceneId) {
      this.scenes.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (id === targetSceneId) {
            el.classList.remove('hidden-scene');
            el.classList.add('active-scene');
          } else {
            el.classList.remove('active-scene');
            el.classList.add('hidden-scene');
          }
        }
      });

      this.currentSceneId = targetSceneId;
      let sceneNum = parseInt(targetSceneId.replace('scene-0', ''));
      kuralQuest.saveState({ currentScene: sceneNum });

      const progressBar = document.getElementById('hud-progress-bar');
      if (progressBar) progressBar.style.width = `${sceneNum * 25}%`;

      this.onSceneEnter(targetSceneId);
    },

    onSceneEnter(sceneId) {
      if (sceneId === 'scene-01') {
        setTimeout(() => {
          const txt2 = document.getElementById('scene1-text-2');
          if (txt2) txt2.classList.remove('hidden');
        }, 1200);
      } else if (sceneId === 'scene-02') {
        this.runFootstepDustPuff();
      } else if (sceneId === 'scene-04') {
        this.runScene4CombatSequence();
      }
    },

    runFootstepDustPuff() {
      const dust = document.getElementById('footstep-dust');
      if (dust) {
        dust.classList.add('puff');
        setTimeout(() => dust.classList.remove('puff'), 600);
      }
    },

    runScene4CombatSequence() {
      const warrior = document.getElementById('scene4-hero');
      const enemy = document.getElementById('scene4-enemy');
      const spark = document.getElementById('clash-spark');
      const flash = document.getElementById('impact-flash');
      const statusTitle = document.getElementById('scene4-status-title');
      const statusSub = document.getElementById('scene4-status-sub');

      setTimeout(() => {
        if (warrior) warrior.style.transform = 'translateX(60px)';
        if (enemy) enemy.style.transform = 'translateX(-60px)';
        soundManager.playSound('clash');

        setTimeout(() => {
          if (spark) spark.classList.add('active');
          CameraController.shake();
          if (flash) {
            flash.classList.add('flash');
            setTimeout(() => flash.classList.remove('flash'), 150);
          }

          setTimeout(() => {
            if (warrior) warrior.style.transform = 'translateX(10px)';
            if (enemy) enemy.style.transform = 'translateX(-10px)';
            if (statusTitle) statusTitle.textContent = 'போர் இப்போதுதான் தொடங்குகிறது.';
            if (statusSub) statusSub.textContent = 'தயாரா?';
          }, 400);
        }, 300);
      }, 500);
    }
  };

  // 8. Scene Interactions
  const btnStart = document.getElementById('btn-scene1-start');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      soundManager.playSound('click');
      SceneManager.goTo('scene-02');
    });
  }

  const btnAdvance = document.getElementById('btn-scene2-advance');
  if (btnAdvance) {
    btnAdvance.addEventListener('click', () => {
      soundManager.playSound('click');
      SceneManager.goTo('scene-03');
    });
  }

  const btnFight = document.getElementById('btn-scene3-fight');
  if (btnFight) {
    btnFight.addEventListener('click', () => {
      soundManager.playSound('clash');
      SceneManager.goTo('scene-04');
    });
  }

  const btnRetreat = document.getElementById('btn-scene3-retreat');
  const btnRetry = document.getElementById('btn-scene3-retry');
  const scene3Heading = document.getElementById('scene3-heading');
  const scene3SubText = document.getElementById('scene3-sub-text');
  const scene3Actions = document.getElementById('scene3-actions');
  const scene3RetryActions = document.getElementById('scene3-retry-actions');
  const heroBox3 = document.getElementById('scene3-warrior-box');
  const scene3Bg = document.getElementById('scene3-bg');

  if (btnRetreat) {
    btnRetreat.addEventListener('click', () => {
      soundManager.playSound('click');
      if (heroBox3) heroBox3.style.transform = 'translateX(-60px)';
      if (scene3Bg) scene3Bg.style.filter = 'brightness(0.2) contrast(1.2)';

      if (scene3Heading) scene3Heading.textContent = 'பயம் வெற்றியைத் தராது.';
      if (scene3SubText) {
        scene3SubText.textContent = 'மீண்டும் முயற்சி செய்.';
        scene3SubText.style.color = '#F1D7A0';
      }

      if (scene3Actions) scene3Actions.classList.add('hidden');
      if (scene3RetryActions) scene3RetryActions.classList.remove('hidden');
    });
  }

  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      soundManager.playSound('clash');
      if (heroBox3) heroBox3.style.transform = 'none';
      if (scene3Bg) scene3Bg.style.filter = 'brightness(0.4) contrast(1.1)';

      if (scene3Heading) scene3Heading.textContent = 'முதல் சவால்.';
      if (scene3SubText) scene3SubText.textContent = 'முன்னால் எதிரி நிற்கிறான்.';

      if (scene3RetryActions) scene3RetryActions.classList.add('hidden');
      if (scene3Actions) scene3Actions.classList.remove('hidden');

      SceneManager.goTo('scene-04');
    });
  }

  const btnEnterBattle = document.getElementById('btn-scene4-enter-battle');
  if (btnEnterBattle) {
    btnEnterBattle.addEventListener('click', () => {
      soundManager.playSound('clash');
      kuralQuest.saveState({
        currentModule: 'battle',
        currentScene: 5,
        battleStarted: true
      });
      window.location.href = '../02-battle/index.html';
    });
  }

  // 9. Multi-Category Canvas 2D Particle Engine
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    class Particle {
      constructor(type) {
        this.type = type; // 'ember', 'ash', 'fog'
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height + height;

        if (this.type === 'fog') {
          this.size = Math.random() * 40 + 20;
          this.speedY = Math.random() * 0.5 + 0.1;
          this.speedX = (Math.random() - 0.5) * 0.4;
          this.opacity = Math.random() * 0.15 + 0.05;
          this.color = '#D6B36A';
        } else if (this.type === 'ash') {
          this.size = Math.random() * 2 + 0.5;
          this.speedY = Math.random() * 1.0 + 0.2;
          this.speedX = (Math.random() - 0.5) * 1.2;
          this.opacity = Math.random() * 0.5 + 0.2;
          this.color = '#A0A0A0';
        } else {
          // Ember
          this.size = Math.random() * 3 + 1;
          this.speedY = Math.random() * 1.6 + 0.4;
          this.speedX = (Math.random() - 0.5) * 0.8;
          this.opacity = Math.random() * 0.8 + 0.2;
          this.color = Math.random() > 0.4 ? '#D77A27' : '#B84320';
        }
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.opacity -= 0.0015;
        if (this.y < -30 || this.opacity <= 0) this.reset();
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

    const embers = Array.from({ length: 30 }, () => new Particle('ember'));
    const ashes = Array.from({ length: 15 }, () => new Particle('ash'));
    const fogs = Array.from({ length: 8 }, () => new Particle('fog'));
    const allParticles = [...embers, ...ashes, ...fogs];

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      allParticles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }
});
