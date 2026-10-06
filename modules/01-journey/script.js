/* ==========================================================================
   MODULE 01 — JOURNEY LOGIC & ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Shared State Contract
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

  // 2. Audio Engine with Web Audio Synthesizer Fallback
  class SoundEngine {
    constructor() {
      this.ctx = null;
    }

    initWebAudio() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
    }

    playSound(type) {
      if (!kuralQuest.state.soundEnabled) return;

      // HTML Audio Attempt
      let audioFile = type === 'clash' ? 'sword-hit.wav' : (type === 'victory' ? 'victory.wav' : 'click.wav');
      let audio = new Audio(`../../assets/audio/ui/${audioFile}`);
      audio.volume = 0.5;

      audio.play().catch(() => {
        // Fallback to Web Audio Synthesizer
        this.synthSound(type);
      });
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
          osc.start(now);
          osc.stop(now + 0.15);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        }
      } catch (e) {}
    }
  }

  const soundEngine = new SoundEngine();

  // Sound Toggle Button
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const active = !kuralQuest.state.soundEnabled;
      kuralQuest.saveState({ soundEnabled: active });
      soundIcon.textContent = active ? '🔊' : '🔇';
      if (active) soundEngine.playSound('click');
    });
  }

  // 3. Scene Controller System
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
      } else if (sceneId === 'scene-04') {
        this.runScene4Combat();
      }
    },

    runScene4Combat() {
      const warrior = document.getElementById('scene4-hero');
      const enemy = document.getElementById('scene4-enemy');
      const spark = document.getElementById('clash-spark');
      const flash = document.getElementById('impact-flash');

      setTimeout(() => {
        if (warrior) warrior.style.transform = 'translateX(60px)';
        if (enemy) enemy.style.transform = 'translateX(-60px)';
        soundEngine.playSound('clash');

        setTimeout(() => {
          if (spark) spark.classList.add('active');
          if (flash) {
            flash.classList.add('flash');
            setTimeout(() => flash.classList.remove('flash'), 150);
          }
        }, 300);
      }, 500);
    }
  };

  // 4. Button Interactions for Module 01
  const btnStart = document.getElementById('btn-scene1-start');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      soundEngine.playSound('click');
      SceneManager.goTo('scene-02');
    });
  }

  const btnAdvance = document.getElementById('btn-scene2-advance');
  if (btnAdvance) {
    btnAdvance.addEventListener('click', () => {
      soundEngine.playSound('click');
      SceneManager.goTo('scene-03');
    });
  }

  const btnFight = document.getElementById('btn-scene3-fight');
  if (btnFight) {
    btnFight.addEventListener('click', () => {
      soundEngine.playSound('clash');
      SceneManager.goTo('scene-04');
    });
  }

  const btnRetreat = document.getElementById('btn-scene3-retreat');
  const subText3 = document.getElementById('scene3-sub-text');
  if (btnRetreat) {
    btnRetreat.addEventListener('click', () => {
      soundEngine.playSound('click');
      const heroBox = document.getElementById('scene3-warrior-box');
      if (heroBox) heroBox.style.transform = 'translateX(-40px)';
      if (subText3) {
        subText3.textContent = '⚠️ பயம் வெற்றியைத் தராது. மீண்டும் முன்னேறு!';
        subText3.style.color = '#B84320';
      }
      setTimeout(() => {
        if (heroBox) heroBox.style.transform = 'none';
      }, 600);
    });
  }

  const btnEnterBattle = document.getElementById('btn-scene4-enter-battle');
  if (btnEnterBattle) {
    btnEnterBattle.addEventListener('click', () => {
      soundEngine.playSound('clash');
      kuralQuest.saveState({ currentModule: 'battle', currentStage: 2, currentScene: 5 });
      window.location.href = '../02-battle/index.html';
    });
  }

  // 5. Fire Ember Particle Engine
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    class EmberParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height + height;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 1.5 + 0.4;
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

    const particles = Array.from({ length: 30 }, () => new EmberParticle());
    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }
});
