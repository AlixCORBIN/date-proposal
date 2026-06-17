'use strict';

/* ============================================================
   EMAILJS CONFIG
   ============================================================ */
const EMAILJS_PUBLIC_KEY  = 'TcnNcaEuoq4VPumA2';
const EMAILJS_SERVICE_ID  = 'service_8bq24ej';
const EMAILJS_TEMPLATE_ID = 'template_vq4s2ng';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

/* ============================================================
   PROFILS — ajoute autant de noms que tu veux ici
   Clé = prénom en minuscules, sans accent
   ============================================================ */
const PROFILS = {
  esther: {
    prenom:      'Esther',
    proposition: 'Veux-tu faire un date avec moi ? 🐾',
    winSub:      'Je suis le plus heureux 🐾💕',
    winTitle:    'ELLE A DIT OUI !!',
    btnBebew:    'ok bebeewww !! 💕',
  },
  pierre: {
    prenom:      'Pierre',
    proposition: 'Veux-tu faire un date avec moi ? 🐾',
    winSub:      'Je suis le plus heureux 🐾💕',
    winTitle:    'IL A DIT OUI !!',
    btnBebew:    'ok bebeewww !! 💕',
  },
  /* --- Ajoute d'autres noms ici --- */
  // marie: {
  //   prenom:      'Marie',
  //   proposition: 'Veux-tu faire un date avec moi ? 🌸',
  //   winSub:      'Trop contente 💕',
  //   winTitle:    'ELLE A DIT OUI !!',
  //   btnBebew:    'ok bebeewww !! 💕',
  // },
};

/* Profil utilisé si le nom n'est pas dans PROFILS */
const PROFIL_DEFAULT = {
  prenom:      '',
  proposition: 'Veux-tu faire un date avec moi ? 🐾',
  winSub:      'Super ! 💕',
  winTitle:    'OUI !!',
  btnBebew:    'Super !! 💕',
};

let profil = PROFIL_DEFAULT;

/* Données collectées au fil des écrans */
const dateData = {
  date:     '',
  heure:    '',
  quoi:     '',
  ou:       '',
  activite: ''
};


/* ============================================================
   STARS
   ============================================================ */
(function () {
  const canvas = document.getElementById('stars');
  const ctx    = canvas.getContext('2d');
  let stars    = [];

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
   HELPER — transition entre écrans
   ============================================================ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.add('hidden');
    s.classList.remove('active');
  });
  const target = document.getElementById(id);
  target.classList.remove('hidden');
  void target.offsetWidth;
  target.classList.add('active');
}

/* ============================================================
   HELPER — chips cliquables
   ============================================================ */
function initChips(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const input = document.getElementById(chip.dataset.target);
      if (!input) return;
      group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      input.value = chip.textContent.trim();
      input.focus();
    });
  });
}

function watchInputDeselectChips(inputId, groupId) {
  const input = document.getElementById(inputId);
  const group = document.getElementById(groupId);
  if (!input || !group) return;
  input.addEventListener('input', () => {
    group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  });
}

/* ============================================================
   HELPER — shake
   ============================================================ */
function shake(el) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'shake 0.4s ease';
}


/* ============================================================
   SCREEN 1 — NOM
   ============================================================ */
const nameInput = document.getElementById('name-input');
const errorMsg  = document.getElementById('error-msg');

function submitName() {
  const raw = nameInput.value.trim();
  if (!raw) {
    shake(nameInput);
    return;
  }

  const key = raw.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, ''); // retire les accents pour la clé
  profil = PROFILS[key] || { ...PROFIL_DEFAULT, prenom: raw };

  /* Personnalise le texte de la proposition */
  document.querySelector('.proposal-text').textContent = profil.proposition;

  showScreen('screen-proposal');
  startProposalScreen();
}

document.getElementById('btn-enter').addEventListener('click', submitName);
nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitName(); });


/* ============================================================
   SCREEN 2 — PROPOSITION
   ============================================================ */
function startProposalScreen() {
  growYesButton();
  initNoButton();
}

function growYesButton() {
  const btn      = document.getElementById('btn-yes');
  const start    = performance.now();
  const DURATION = 20_000;
  const MAX      = 1.8;
  let   stopped  = false;

  btn._stopGrow = () => { stopped = true; };

  (function frame(now) {
    if (stopped) return;
    const t     = Math.min((now - start) / DURATION, 1);
    const scale = 1 + (MAX - 1) * (t * t);
    btn.style.transform = `scale(${scale.toFixed(4)})`;
    if (t < 1) requestAnimationFrame(frame);
  })(start);
}

document.getElementById('btn-yes').addEventListener('click', () => {
  const btn = document.getElementById('btn-yes');
  if (btn._stopGrow) btn._stopGrow();

  /* Applique le texte du profil */
  document.querySelector('.win-title').textContent = profil.winTitle;
  document.querySelector('.win-sub').textContent   = profil.winSub;
  document.getElementById('btn-bebew').textContent = profil.btnBebew;

  showScreen('screen-win');
  launchConfetti();
  setTimeout(launchConfetti, 800);
  setTimeout(launchConfetti, 1600);
});


/* ============================================================
   SCREEN 3 — WIN
   ============================================================ */
document.getElementById('btn-bebew').addEventListener('click', () => {
  showScreen('screen-date');
});


/* ============================================================
   SCREEN 4 — DATE / HEURE
   ============================================================ */
document.getElementById('btn-confirm-date').addEventListener('click', () => {
  const dateVal = document.getElementById('date-input').value;
  const timeVal = document.getElementById('time-input').value;

  if (!dateVal && !timeVal) {
    shake(document.getElementById('date-form'));
    return;
  }

  let dateStr = '';
  if (dateVal) {
    const d = new Date(dateVal + 'T00:00:00');
    dateStr = d.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
    dateData.date = dateStr;
  }
  const timeStr = timeVal ? timeVal.replace(':', 'h') : '';
  if (timeStr) dateData.heure = timeStr;

  const parts = [dateStr, timeStr].filter(Boolean);
  document.getElementById('confirm-date-text').textContent =
    `Rendez-vous ${parts.join(' à ')} ! 🗓️`;

  document.getElementById('date-form').classList.add('hidden');
  document.getElementById('date-confirm').classList.remove('hidden');
});

document.getElementById('btn-to-food').addEventListener('click', () => {
  showScreen('screen-food');
  initChips('food-chips');
  watchInputDeselectChips('food-what', 'food-chips');
  initChoiceButtons();
});


/* ============================================================
   SCREEN 5 — NOURRITURE
   ============================================================ */

/* Boutons choix "où manger" */
function initChoiceButtons() {
  document.querySelectorAll('#food-where-choices .choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#food-where-choices .choice-btn')
        .forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      dateData.ou = btn.dataset.value;
    });
  });
}

document.getElementById('btn-confirm-food').addEventListener('click', () => {
  const what  = document.getElementById('food-what').value.trim();
  const where = dateData.ou;

  if (!what && !where) {
    shake(document.querySelector('#screen-food .card'));
    return;
  }

  dateData.quoi = what || '(non précisé)';

  let msg = '';
  if (what && where)   msg = `${what} — ${where} 😋`;
  else if (what)       msg = `${what} — super choix ! 😋`;
  else                 msg = `${where} — j'adore ! 😋`;

  document.getElementById('confirm-food-text').textContent = msg;
  document.getElementById('btn-confirm-food').classList.add('hidden');
  document.querySelectorAll('#screen-food .field').forEach(f => f.classList.add('hidden'));
  document.getElementById('food-confirm').classList.remove('hidden');
});

document.getElementById('btn-to-activity').addEventListener('click', () => {
  showScreen('screen-activity');
  initChips('activity-chips');
  watchInputDeselectChips('activity-input', 'activity-chips');
});


/* ============================================================
   SCREEN 6 — ACTIVITÉ + ENVOI EMAIL
   ============================================================ */
document.getElementById('btn-confirm-activity').addEventListener('click', () => {
  const val = document.getElementById('activity-input').value.trim();

  if (!val) {
    shake(document.getElementById('activity-input'));
    return;
  }

  dateData.activite = val;

  document.getElementById('confirm-activity-text').textContent =
    `${val} — c'est parfait ! 🎊`;

  document.getElementById('btn-confirm-activity').classList.add('hidden');
  document.querySelector('#screen-activity .field').classList.add('hidden');
  document.getElementById('activity-confirm').classList.remove('hidden');

  launchConfetti();
  setTimeout(launchConfetti, 700);

  /* Envoi email */
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    prenom:   profil.prenom     || 'Inconnu(e)',
    date:     dateData.date     || 'non précisée',
    heure:    dateData.heure    || 'non précisée',
    quoi:     dateData.quoi     || 'non précisé',
    ou:       dateData.ou       || 'non précisé',
    activite: dateData.activite
  }).catch(() => {/* silencieux si clés pas encore configurées */});
});


/* ============================================================
   SCREEN 7 — RÉCAP FINAL
   ============================================================ */
document.getElementById('btn-to-summary').addEventListener('click', () => {
  const dateParts = [dateData.date, dateData.heure].filter(Boolean);
  document.getElementById('sum-date').textContent =
    dateParts.length ? dateParts.join(' à ') : 'À définir';

  const foodParts = [dateData.quoi, dateData.ou].filter(p => p && p !== '(non précisé)');
  document.getElementById('sum-food').textContent =
    foodParts.length ? foodParts.join(' — ') : 'À définir';

  document.getElementById('sum-activity').textContent =
    dateData.activite || 'À définir';

  /* Message de pickup : heure - 30 min */
  const pickupEl = document.getElementById('pickup-msg');
  if (dateData.heure) {
    const [h, m] = dateData.heure.replace('h', ':').split(':').map(Number);
    const total  = h * 60 + m - 30;
    const ph     = String(Math.floor(((total % 1440) + 1440) % 1440 / 60)).padStart(2, '0');
    const pm     = String(((total % 60) + 60) % 60).padStart(2, '0');
    pickupEl.textContent = `🚗 Très bien, je passerai te chercher à ${ph}h${pm} !`;
    pickupEl.classList.remove('hidden');
  } else {
    pickupEl.textContent = '';
  }

  showScreen('screen-summary');
  launchConfetti();
});


/* ============================================================
   CONFETTI
   ============================================================ */
const EMOJIS = ['🐾', '❤️', '🎉', '✨', '💕', '🌟', '🎊', '💖'];

function launchConfetti() {
  let n = 0;
  const id = setInterval(() => {
    if (n++ > 70) { clearInterval(id); return; }
    const el = document.createElement('span');
    el.className = 'confetti';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.left              = Math.random() * 100 + 'vw';
    el.style.fontSize          = (1.4 + Math.random() * 2) + 'rem';
    el.style.animationDuration = (1.8 + Math.random() * 2.5) + 's';
    el.style.animationDelay    = Math.random() * 0.4 + 's';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }, 65);
}


/* ============================================================
   NON BUTTON — fuite PC + savon mobile + maintien 3 s
   ============================================================ */
function initNoButton() {
  const btn   = document.getElementById('btn-no');
  const error = document.getElementById('no-error');

  btn.addEventListener('click', () => {
    error.classList.remove('hidden');
    // Relancer l'animation shake à chaque clic
    error.style.animation = 'none';
    void error.offsetWidth;
    error.style.animation = 'shake 0.45s ease';
  });
}
