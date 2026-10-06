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

  const currentState = kuralQuest.state;
  document.getElementById('score-display').textContent = currentState.score;

  function playSound(type) {
    if (!currentState.soundEnabled) return;
    let fileName = type === 'victory' ? 'victory.wav' : (type === 'clash' ? 'sword-hit.wav' : 'click.wav');
    const audio = new Audio(`../../assets/audio/victory/${fileName}`);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }

  function updateScore(amount) {
    currentState.score += amount;
    document.getElementById('score-display').textContent = currentState.score;

    const floatEl = document.createElement('div');
    floatEl.className = 'floating-score-item';
    floatEl.textContent = `+${amount}`;
    document.getElementById('floating-score-container').appendChild(floatEl);
    setTimeout(() => floatEl.remove(), 1200);

    kuralQuest.saveState({ score: currentState.score });
  }

  // Boss Trial Timer & Options
  const bossTimer = document.getElementById('boss-timer');
  const bossOptBtns = document.querySelectorAll('.boss-opt-btn');
  const bossBox = document.getElementById('boss-box');
  const victoryBox = document.getElementById('victory-box');
  const finalScoreVal = document.getElementById('final-score-val');
  const finalRankTitle = document.getElementById('final-rank-title');

  let bossHits = 0;
  let timeLeft = 10;
  let timerInterval = null;

  function startBossTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      bossTimer.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timeLeft = 10;
        bossTimer.textContent = '10';
        startBossTimer();
      }
    }, 1000);
  }

  startBossTimer();

  bossOptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';
      if (isCorrect && !btn.classList.contains('hit-good')) {
        btn.classList.add('hit-good');
        playSound('clash');
        bossHits++;

        if (bossHits === 4) {
          clearInterval(timerInterval);
          updateScore(300);
          playSound('victory');
          bossBox.classList.add('hidden');
          victoryBox.classList.remove('hidden');

          finalScoreVal.textContent = currentState.score;
          let rank = 'புதிய வீரன்';
          if (currentState.score >= 900) rank = 'ஞான வீரன்';
          else if (currentState.score >= 750) rank = 'குறள் காவலன்';
          else if (currentState.score >= 550) rank = 'தலைவன்';
          else if (currentState.score >= 300) rank = 'வீரன்';
          finalRankTitle.textContent = rank;
        }
      } else if (!isCorrect) {
        btn.classList.add('hit-bad');
        playSound('wrong');
        setTimeout(() => btn.classList.remove('hit-bad'), 400);
      }
    });
  });

  document.getElementById('replay-game-btn').addEventListener('click', () => {
    playSound('click');
    kuralQuest.saveState({ currentModule: 'journey', currentStage: 1, score: 0 });
    window.location.href = '../01-journey/index.html';
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
      this.size = Math.random() * 3.5 + 1;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.8 + 0.2;
      this.color = '#F1D7A0';
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

  const particles = Array.from({ length: 40 }, () => new Particle());
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
});
