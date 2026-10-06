/* ==========================================================================
   MODULE 02 — BATTLE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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

  let enemyHp = 100;

  function playSound(type) {
    if (!currentState.soundEnabled) return;
    let fileName = 'sword-hit.wav';
    if (type === 'click') fileName = 'click.wav';
    if (type === 'correct') fileName = 'correct.wav';
    if (type === 'victory') fileName = 'victory.wav';

    const audio = new Audio(`../../assets/audio/combat/${fileName}`);
    audio.volume = 0.4;
    audio.play().catch(() => { });
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

  // Combat Attack Action
  const animWarrior = document.getElementById('anim-warrior');
  const animEnemy = document.getElementById('anim-enemy');
  const animClash = document.getElementById('anim-clash');
  const enemyHpBar = document.getElementById('enemy-hp-bar');
  const gotoFallBtn = document.getElementById('goto-fall-btn');

  document.getElementById('cmd-attack').addEventListener('click', () => {
    playSound('clash');
    animWarrior.style.transform = 'translateX(60px)';
    animEnemy.style.transform = 'translateX(-60px)';
    animClash.classList.add('active');

    enemyHp = Math.max(0, enemyHp - 50);
    enemyHpBar.style.width = `${enemyHp}%`;

    setTimeout(() => {
      if (enemyHp <= 0) {
        animEnemy.style.opacity = '0.2';
        animEnemy.style.transform = 'translateX(-100px) rotate(-15deg)';
      }
      playSound('correct');
      updateScore(50);
      gotoFallBtn.classList.remove('hidden');
    }, 600);
  });

  document.getElementById('cmd-block').addEventListener('click', () => {
    playSound('clash');
    animWarrior.style.transform = 'scale(1.15)';
    setTimeout(() => animWarrior.style.transform = 'scale(1)', 400);
    gotoFallBtn.classList.remove('hidden');
  });

  // Fall -> Rise Sequence
  const battleScene1 = document.getElementById('battle-scene-1');
  const battleScene2 = document.getElementById('battle-scene-2');
  const poseText = document.getElementById('pose-text');
  const wordReveal1 = document.getElementById('word-reveal-1');
  const subText2 = document.getElementById('sub-text-2');
  const cmdRiseUp = document.getElementById('cmd-rise-up');
  const gotoWisdomBtn = document.getElementById('goto-wisdom-btn');

  gotoFallBtn.addEventListener('click', () => {
    playSound('click');
    battleScene1.classList.add('hidden');
    battleScene2.classList.remove('hidden');
  });

  cmdRiseUp.addEventListener('click', () => {
    playSound('clash');
    updateScore(100);
    poseText.textContent = '💪 "விழுந்தாலும் மீண்டு எழுந்தான்!"';
    wordReveal1.classList.remove('hidden');
    subText2.textContent = 'எளிதில் அழியாமல், துன்பம் வந்தாலும் உறுதியோடு மீண்டும் எழுவது!';
    cmdRiseUp.classList.add('hidden');
    gotoWisdomBtn.classList.remove('hidden');
  });

  gotoWisdomBtn.addEventListener('click', () => {
    playSound('click');
    kuralQuest.saveState({ currentModule: 'wisdom', currentStage: 7, battleCompleted: true });
    window.location.href = '../03-wisdom/index.html';
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
