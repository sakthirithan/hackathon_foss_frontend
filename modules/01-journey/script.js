/* ==========================================================================
   MODULE 01 — JOURNEY LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Global State Contract helper
  const kuralQuest = {
    get state() {
      return JSON.parse(localStorage.getItem('kuralQuest.state')) || {
        currentModule: 'journey',
        currentStage: 1,
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

  // Sound Engine
  function playSound(type) {
    if (!currentState.soundEnabled) return;
    let fileName = type === 'clash' ? 'sword-hit.wav' : 'click.wav';
    const audio = new Audio(`../../assets/audio/ui/${fileName}`);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }

  document.getElementById('start-journey-btn').addEventListener('click', () => {
    playSound('clash');
    // Save state contract & transition to Module 02 Battle
    kuralQuest.saveState({ currentModule: 'battle', currentStage: 2 });
    window.location.href = '../02-battle/index.html';
  });

  // Particle Engine
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

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

  const particles = Array.from({ length: 35 }, () => new Particle());
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
});
