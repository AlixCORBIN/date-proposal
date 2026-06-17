'use strict';

/* ============================================================
   STARS
   ============================================================ */
(function () {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function init() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 240 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.012 + 0.003
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      const a = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  requestAnimationFrame(draw);
})();


/* ============================================================
   SCREEN 1 — NOM
   ============================================================ */
const screenName     = document.getElementById('screen-name');
const screenProposal = document.getElementById('screen-proposal');
const nameInput      = document.getElementById('name-input');
const errorMsg       = document.getElementById('error-msg');
const btnEnter       = document.getElementById('btn-enter');

function submitName() {
  const val = nameInput.value.trim().toLowerCase();
  if (val === 'esther') {
    errorMsg.classList.add('hidden');
    screenName.classList.remove('active');
    screenName.classList.add('hidden');
    screenProposal.classList.remove('hidden');
    screenProposal.classList.add('active');
    initNoButton();
  } else {
    errorMsg.classList.remove('hidden');
    nameInput.value = '';
    nameInput.focus();
    nameInput.classList.add('shake-input');
    setTimeout(() => nameInput.classList.remove('shake-input'), 500);
  }
}

btnEnter.addEventListener('click', submitName);
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitName();
});


/* ============================================================
   SCREEN 2 — OUI
   ============================================================ */
const overlayWin = document.getElementById('overlay-win');
const btnYes     = document.getElementById('btn-yes');
const EMOJIS     = ['🐾', '❤️', '🎉', '✨', '🐾', '🌟', '🎊', '💕'];

btnYes.addEventListener('click', () => {
  overlayWin.classList.remove('hidden');
  launchConfetti();
  setTimeout(launchConfetti, 900);
  setTimeout(launchConfetti, 1800);
});

function launchConfetti() {
  let n = 0;
  const id = setInterval(() => {
    if (n++ > 70) { clearInterval(id); return; }
    const el = document.createElement('span');
    el.className = 'confetti';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.left             = Math.random() * 100 + 'vw';
    el.style.fontSize         = (1.4 + Math.random() * 2) + 'rem';
    el.style.animationDuration = (1.8 + Math.random() * 2.5) + 's';
    el.style.animationDelay   = Math.random() * 0.4 + 's';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }, 65);
}


/* ============================================================
   SCREEN 2 — NON BUTTON  (fuite + savon + maintien 3 s)
   ============================================================ */
function initNoButton() {
  const btn      = document.getElementById('btn-no');
  const ringFill = document.getElementById('ring-fill');
  const CIRCUMFERENCE = 125.66; // 2π × r=20
  let   isFixed  = false;
  let   holdTimer = null;
  let   holdStart = null;
  let   raf       = null;

  /* ---- Position utilities ---- */
  function getRect() { return btn.getBoundingClientRect(); }

  function makeFixed() {
    if (isFixed) return;
    const r = getRect();
    btn.style.position  = 'fixed';
    btn.style.left      = r.left + 'px';
    btn.style.top       = r.top  + 'px';
    btn.style.margin    = '0';
    btn.style.zIndex    = '50';
    btn.style.transition = 'left 0.06s ease-out, top 0.06s ease-out';
    isFixed = true;
  }

  function moveTo(x, y) {
    const w = btn.offsetWidth;
    const h = btn.offsetHeight;
    const pad = 16;
    x = Math.max(pad, Math.min(window.innerWidth  - w - pad, x));
    y = Math.max(pad, Math.min(window.innerHeight - h - pad, y));
    btn.style.left = x + 'px';
    btn.style.top  = y + 'px';
  }

  function pushAway(cx, cy) {
    const r   = getRect();
    const bx  = r.left + r.width  / 2;
    const by  = r.top  + r.height / 2;
    const dx  = bx - cx;
    const dy  = by - cy;
    const len = Math.hypot(dx, dy) || 1;
    const fly = 120 + Math.random() * 80;
    moveTo(r.left + (dx / len) * fly, r.top + (dy / len) * fly);
  }

  /* ---- 3-second hold ring ---- */
  function updateRing(progress) {
    ringFill.style.strokeDashoffset =
      (CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, progress)))).toFixed(2);
  }

  function startHold() {
    holdStart = performance.now();
    cancelHold();
    function tick(now) {
      const elapsed  = (now - holdStart) / 1000;
      const progress = elapsed / 3;
      updateRing(progress);
      if (elapsed >= 3) {
        updateRing(1);
        cancelHold(true); // truly validated → easter egg
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }

  function cancelHold(completed) {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    if (!completed) updateRing(0);
    holdStart = null;
  }

  /* ==================================================
     PC — fuite à la souris (mouseenter)
     ================================================== */
  btn.addEventListener('mouseenter', () => {
    makeFixed();
    const r = getRect();
    pushAway(r.left + r.width / 2, r.top + r.height / 2);
    cancelHold();
  });

  btn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startHold();
  });

  btn.addEventListener('mouseup',    () => cancelHold());
  btn.addEventListener('mouseleave', () => cancelHold());


  /* ==================================================
     MOBILE — effet savon (touchmove global)
     ================================================== */
  const SOAP_RADIUS = 130;

  document.addEventListener('touchmove', (e) => {
    if (!isFixed && !document.getElementById('screen-proposal').classList.contains('active')) return;
    makeFixed();

    const touch = e.touches[0];
    const r     = getRect();
    const bx    = r.left + r.width  / 2;
    const by    = r.top  + r.height / 2;
    const dx    = bx - touch.clientX;
    const dy    = by - touch.clientY;
    const dist  = Math.hypot(dx, dy);

    if (dist < SOAP_RADIUS) {
      const force = (SOAP_RADIUS - dist) / SOAP_RADIUS;
      const len   = dist || 1;
      const slide = 60 + force * 100;
      moveTo(
        r.left + (dx / len) * slide,
        r.top  + (dy / len) * slide
      );
      cancelHold(); // mouvement = annule le maintien
    }
  }, { passive: true });

  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    makeFixed();
    const touch = e.touches[0];
    pushAway(touch.clientX, touch.clientY);
    startHold();
  }, { passive: false });

  btn.addEventListener('touchend', () => cancelHold());
}
