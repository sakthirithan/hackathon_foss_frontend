/* ==========================================================================
   MODULE 03 — WISDOM LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const kuralQuest = {
    get state() {
      return JSON.parse(localStorage.getItem('kuralQuest.state')) || {
        currentModule: 'wisdom',
        currentStage: 7,
        score: 450,
        soundEnabled: true
      };
    },
    saveState(newState) {
      const updated = { ...this.state, ...newState };
      localStorage.setItem('kuralQuest.state', JSON.stringify(updated));
      return updated;
    }
  };

  let currentState = kuralQuest.state;
  const scoreDisplay = document.getElementById('score-display');
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');

  scoreDisplay.textContent = currentState.score;

  // Home Button Handler
  const homeBtn = document.getElementById('home-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      playSound('click');
      kuralQuest.saveState({ currentModule: 'journey', currentStage: 1, score: 0 });
      window.location.href = '../../index.html?reset=true';
    });
  }

  function playSound(type) {
    if (!currentState.soundEnabled) return;
    let fileName = 'click.wav';
    let folder = 'ui';
    if (type === 'victory') { fileName = 'victory.wav'; folder = 'victory'; }
    if (type === 'correct') { fileName = 'correct.wav'; folder = 'ui'; }
    if (type === 'wrong') { fileName = 'wrong.wav'; folder = 'ui'; }

    const audio = new Audio(`../../assets/audio/${folder}/${fileName}`);
    audio.volume = 0.5;
    audio.play().catch(() => { });
  }

  soundBtn.addEventListener('click', () => {
    currentState.soundEnabled = !currentState.soundEnabled;
    soundIcon.textContent = currentState.soundEnabled ? '🔊' : '🔇';
    kuralQuest.saveState({ soundEnabled: currentState.soundEnabled });
  });

  function updateScore(amount) {
    currentState.score += amount;
    scoreDisplay.textContent = currentState.score;
    kuralQuest.saveState({ score: currentState.score });

    const floatEl = document.createElement('div');
    floatEl.className = 'floating-score-item';
    floatEl.textContent = `+${amount}`;
    document.getElementById('floating-score-container').appendChild(floatEl);
    setTimeout(() => floatEl.remove(), 1200);
  }

  // --- Scroll & Intersection Observer ---
  const scenes = document.querySelectorAll('.cinematic-scene');
  const progressBar = document.getElementById('progress-bar');

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Update Progress Bar based on scene index
        const index = parseInt(entry.target.getAttribute('data-index') || '0');
        const totalScenes = scenes.length;
        const progress = ((index + 1) / totalScenes) * 100;
        progressBar.style.width = `${progress}%`;
      }
    });
  }, { threshold: 0.35 });

  scenes.forEach(scene => sceneObserver.observe(scene));

  // --- Particle Engine ---
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
      this.size = Math.random() * 2 + 0.5;
      this.speedY = Math.random() * 1 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = '#F1D7A0';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity -= 0.001;
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

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!isReducedMotion) {
    const particles = Array.from({ length: 30 }, () => new Particle());
    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // --- Scene 21 Challenge Logic ---
  const choiceBtns = document.querySelectorAll('.choice-btn');
  const feedbackMsg = document.getElementById('challenge-feedback');
  const friendImg = document.getElementById('challenge-friend');
  const scene22 = document.getElementById('scene-22');
  const scene23 = document.getElementById('scene-23');
  const finalScoreDisplay = document.getElementById('final-score-display');

  let challengeCompleted = false;

  choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (challengeCompleted) return;

      const isCorrect = btn.getAttribute('data-correct') === 'true';

      if (isCorrect) {
        playSound('correct');
        btn.classList.add('correct');
        feedbackMsg.textContent = "சரியான முடிவு! ஒன்றாக நில்.";
        feedbackMsg.className = 'feedback-msg feedback-success';
        challengeCompleted = true;

        friendImg.classList.add('rescued');
        updateScore(100);

        setTimeout(() => {
          playSound('victory');
          scene22.classList.remove('hidden');
          scene23.classList.remove('hidden');
          scene22.scrollIntoView({ behavior: 'smooth' });
          finalScoreDisplay.textContent = currentState.score;
        }, 2000);

      } else {
        playSound('wrong');
        btn.classList.add('wrong');
        feedbackMsg.textContent = "மீண்டும் சிந்தி.";
        feedbackMsg.className = 'feedback-msg feedback-error';
        setTimeout(() => {
          btn.classList.remove('wrong');
          feedbackMsg.textContent = "";
        }, 1500);
      }
    });
  });

  // --- Final Actions ---
  document.getElementById('btn-restart').addEventListener('click', () => {
    playSound('click');
    kuralQuest.saveState({ currentModule: 'journey', currentStage: 1, score: 0 });
    window.location.href = '../01-journey/index.html'; // Assuming this is how restart works
  });

  document.getElementById('btn-review').addEventListener('click', () => {
    playSound('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
