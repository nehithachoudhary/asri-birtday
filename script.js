
(() => {
  const gate = document.getElementById('birthdayGate');
  const content = document.getElementById('birthdayContent');
  const keypad = document.getElementById('keypad');
  const dots = [...document.querySelectorAll('#pinDots span')];
  const error = document.getElementById('gateError');
  const card = gate.querySelector('.gate-card');
  const secret = '1911';
  let entered = '';

  document.body.classList.add('gate-locked');

  function refreshDots() {
    dots.forEach((dot, index) => dot.classList.toggle('filled', index < entered.length));
  }
  function unlock() {
    gate.classList.add('is-opening');
    content.classList.remove('locked');
    content.classList.add('unlocked');
    document.body.classList.remove('gate-locked');
    window.setTimeout(() => gate.remove(), 800);
    launchGrandSprinkles();
  }
  function addDigit(digit) {
    if (entered.length >= 4) return;
    entered += digit;
    refreshDots();
    if (entered.length === 4) {
      if (entered === secret) {
        window.setTimeout(unlock, 220);
      } else {
        error.textContent = 'That date doesn’t look right. Try again 💗';
        card.classList.remove('shake');
        void card.offsetWidth;
        card.classList.add('shake');
        window.setTimeout(() => {
          entered = '';
          refreshDots();
          error.textContent = '';
        }, 650);
      }
    }
  }
  keypad.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.digit) addDigit(button.dataset.digit);
    if (button.dataset.action === 'backspace') {
      entered = entered.slice(0, -1);
      refreshDots();
      error.textContent = '';
    }
  });
  document.addEventListener('keydown', event => {
    if (gate.classList.contains('is-opening')) return;
    if (/^\d$/.test(event.key)) addDigit(event.key);
    if (event.key === 'Backspace') {
      entered = entered.slice(0, -1);
      refreshDots();
      error.textContent = '';
    }
  });

  function launchGrandSprinkles() {
    const field = document.getElementById('grandSprinkles');
    const bits = ['🎉','✨','💗','🎊','🌸','💙','⭐','🎈','✦'];
    // A broad shower from the top plus side cannons from both edges.
    for (let i = 0; i < 110; i++) {
      const piece = document.createElement('span');
      piece.className = 'grand-sprinkle';
      piece.textContent = bits[i % bits.length];
      const fromSide = i % 3 !== 0;
      const x = fromSide ? (i % 2 === 0 ? Math.random() * 12 : 88 + Math.random() * 12) : Math.random() * 100;
      piece.style.setProperty('--start-x', `${x}vw`);
      piece.style.setProperty('--drift', `${(Math.random() - .5) * 44}vw`);
      piece.style.setProperty('--spin', `${Math.random() * 900 - 450}deg`);
      piece.style.setProperty('--size', `${14 + Math.random() * 18}px`);
      piece.style.setProperty('--duration', `${2.2 + Math.random() * 2.2}s`);
      piece.style.setProperty('--delay', `${Math.random() * .9}s`);
      field.appendChild(piece);
      window.setTimeout(() => piece.remove(), 5600);
    }
  }
})();

(() => {
  const memoryPhotos = [
    ['assets/memory-1.jpg','the prettiest smile 🌷'],
    ['assets/memory-2.jpg','a day to remember ✨'],
    ['assets/memory-3.jpg','timeless moments 🤍'],
    ['assets/memory-4.jpg','grace in every frame 💗'],
    ['assets/memory-5.jpg','one of a kind 🌸']
  ];
  let memoryIndex = 0;
  const camera = document.getElementById('cameraButton');
  const reveals = document.getElementById('memoryReveals');
  const counter = document.getElementById('memoryCounter');
  camera.addEventListener('click', () => {
    if (memoryIndex >= memoryPhotos.length) {
      counter.textContent = 'All 5 memories have been found 💗';
      return;
    }
    const [src, caption] = memoryPhotos[memoryIndex];
    const card = document.createElement('figure');
    card.className = 'memory-polaroid';
    card.style.setProperty('--tilt', `${[-3,2,-1,3,-2][memoryIndex]}deg`);
    const img = document.createElement('img'); img.src = src; img.alt = 'A birthday memory';
    const text = document.createElement('p'); text.textContent = caption;
    card.append(img, text); reveals.append(card);
    memoryIndex++;
    counter.textContent = memoryIndex < 5 ? `Tap the camera · ${5-memoryIndex} memories left` : 'All 5 memories have been found 💗';
    if (memoryIndex === 5) document.getElementById('memoryHint').textContent = 'Keep these little moments close ✨';
  });

  const cakeStage = document.getElementById('cakeStage');
  const cakeKnife = document.getElementById('cakeKnife');
  const cakeResult = document.getElementById('cakeResult');
  let knifeDown = false, knifeStart = null, cakeCut = false;
  function moveKnife(event) {
    if (!knifeDown || cakeCut) return;
    const rect = cakeStage.getBoundingClientRect();
    cakeKnife.style.left = `${event.clientX - rect.left}px`;
    cakeKnife.style.top = `${event.clientY - rect.top}px`;
    cakeKnife.classList.add('visible');
  }
  function cutCake() {
    if (cakeCut) return;
    cakeCut = true;
    cakeStage.classList.add('sliced');
    cakeKnife.classList.add('slice-swipe');
    document.getElementById('cakeInstruction').textContent = 'You did it! A sweet little slice just for you 💗';
    cakeResult.classList.remove('hidden');
    burstConfetti(cakeStage);
    setTimeout(() => cakeKnife.classList.remove('visible','slice-swipe'), 650);
  }
  cakeStage.addEventListener('pointerdown', event => {
    if (cakeCut) return;
    knifeDown = true;
    knifeStart = {x:event.clientX,y:event.clientY};
    cakeStage.setPointerCapture(event.pointerId);
    cakeStage.classList.add('cutting');
    moveKnife(event);
  });
  cakeStage.addEventListener('pointermove', moveKnife);
  cakeStage.addEventListener('pointerup', event => {
    if (!knifeDown) return;
    knifeDown = false;
    cakeStage.classList.remove('cutting');
    const dx = Math.abs(event.clientX - knifeStart.x);
    const dy = Math.abs(event.clientY - knifeStart.y);
    if (dx > 65 && dx > dy * 1.15) cutCake();
    else cakeKnife.classList.remove('visible');
  });
  cakeStage.addEventListener('pointercancel', () => { knifeDown=false; cakeStage.classList.remove('cutting'); });
  cakeStage.addEventListener('click', event => { if (!cakeCut && event.detail === 0) cutCake(); });
  const candleButton = document.getElementById('candleButton');
  candleButton.addEventListener('click', () => {
    candleButton.classList.add('blown');
    document.getElementById('candleLabel').textContent = 'WISH MADE ✨';
    document.getElementById('wishComplete').classList.remove('hidden');
    burstConfetti(document.querySelector('.wish-section'));
  });

  document.querySelectorAll('.wish-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('revealed'));
  });

  function burstConfetti(anchor) {
    const field = document.getElementById('confettiField');
    const symbols = ['✦','♡','✧','🌸','💙','🎉'];
    for (let i=0;i<24;i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.textContent = symbols[i % symbols.length];
      piece.style.setProperty('--x', `${(Math.random()-.5)*520}px`);
      piece.style.setProperty('--y', `${(Math.random()-.7)*330}px`);
      piece.style.animationDelay = `${Math.random()*.3}s`;
      field.append(piece);
      setTimeout(() => piece.remove(), 2600);
    }
  }
})();
