(function () {
  'use strict';

  /* ── CONFIG ──────────────────────────────────────────── */
  const SCREENS = [
    'screen-welcome',
    'screen-haldi',
    'screen-sangeet',
    'screen-vivaah',
    'screen-reception',
    'screen-all',
  ];
  const AUTO_ADVANCE_MS   = 8334;   // 3×8334 + 2×3000 = 31002ms ≈ 31s for first 3 slides (one music play)
  const TRANSITION_MS     = 3000;   // 3.0s — slow, cinematic crossfade

  let current       = 0;
  let timer         = null;
  let audioEl       = document.getElementById('bg-audio');
  let musicPlaying  = false;
  let transitioning = false;
  let paused        = false;

  const screens     = SCREENS.map(id => document.getElementById(id));
  const dotsEl      = document.getElementById('nav-dots');
  const pauseToast  = document.getElementById('pause-toast');
  const pauseIcon   = document.getElementById('pause-icon');
  const playIcon    = document.getElementById('play-icon');
  let toastTimer    = null;

  /* ── GUEST NAME ───────────────────────────────────────── */
  const params    = new URLSearchParams(window.location.search);
  const guestName = params.get('guest') || params.get('name') || '';
  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
  if (guestName) {
    // Splash screen — guest name above the title
    const splashGuest = document.getElementById('splash-guest');
    splashGuest.textContent = 'Dear ' + guestName + ',';
    splashGuest.style.display = 'block';
    // Slide banner
    const guestEl = document.getElementById('guest-text');
    guestEl.innerHTML = `With love from the couple`;
    document.getElementById('guest-banner').style.display = 'block';
  }

  /* ── NAV DOTS ─────────────────────────────────────────── */
  SCREENS.forEach((_, i) => {
    const d = document.createElement('button');
    d.className  = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  });
  const dots = Array.from(dotsEl.querySelectorAll('.dot'));

  /* ── SHOW SCREEN ─────────────────────────────────────── */
  screens[0].classList.add('visible');
  dots[0].classList.add('active');

  function goTo(idx, force = false) {
    if ((!force && transitioning) || idx === current) return;
    transitioning = true;

    clearTimeout(timer);

    // Clean up any in-progress exit animation
    screens.forEach(s => s.querySelector('.card').classList.remove('card-exit'));

    const prev = current;
    current = ((idx % SCREENS.length) + SCREENS.length) % SCREENS.length;

    // Exit: kick off card-exit animation, then fade out old screen
    const prevCard = screens[prev].querySelector('.card');
    prevCard.classList.add('card-exit');
    setTimeout(() => prevCard.classList.remove('card-exit'), TRANSITION_MS);

    screens[prev].classList.remove('visible');
    dots[prev].classList.remove('active');

    // Enter: new screen fades in with its unique card entry animation
    screens[current].classList.add('visible');
    dots[current].classList.add('active');

    // Restart music exactly at slide 4 (index 3) so it plays once per 3 slides
    if (current === 3) {
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
    }

    // Fire theme burst for event slides
    setTimeout(() => spawnThemeBurst(SCREENS[current]), 800);

    setTimeout(() => {
      transitioning = false;
      startAutoAdvance();
    }, TRANSITION_MS);
  }

  function next(force = false) { goTo((current + 1) % SCREENS.length, force); }
  function prev(force = false) { goTo((current - 1 + SCREENS.length) % SCREENS.length, force); }


  /* ── AUTO-ADVANCE ────────────────────────────────────────── */
  function startAutoAdvance() {
    clearTimeout(timer);
    if (paused) return;
    timer = setTimeout(() => {
      next(); // wraps back to slide 0 after the last
    }, AUTO_ADVANCE_MS);
  }

  // startAutoAdvance() is called by dismissSplash() — not on load

  /* ── PAUSE / RESUME ──────────────────────────────────────── */
  function showToast() {
    pauseIcon.style.display = paused ? 'none' : 'block';
    playIcon.style.display  = paused ? 'block' : 'none';
    pauseToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => pauseToast.classList.remove('show'), 1200);
  }

  function togglePause() {
    paused = !paused;
    if (paused) {
      clearTimeout(timer);
    } else {
      startAutoAdvance();
    }
    showToast();
  }

  /* Click anywhere on a screen (but not on interactive elements) toggles pause */
  screens.forEach(screen => {
    screen.addEventListener('click', e => {
      const tag = e.target.tagName;
      if (tag === 'A' || tag === 'BUTTON' || e.target.closest('a, button')) return;
      togglePause();
    });
  });

  /* ── KEYBOARD NAV ─────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  next(true);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    prev(true);
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePause(); }
  });

  /* ── TOUCH / SWIPE ────────────────────────────────────── */
  let touchStartX = 0, touchStartY = 0;
  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  // Block browser horizontal pan during a predominantly horizontal swipe
  // so the viewport doesn't drift and make the card appear off-centre.
  document.addEventListener('touchmove', e => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX);
    const dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (dx > dy) e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? next(true) : prev(true); }
  });



  /* ── AUDIO PLAYBACK ──────────────────────────────────────── */
  function setMusicUI(playing) {
    musicPlaying = playing;
  }

  /* ── SPLASH DISMISS ──────────────────────────────────────── */
  const splashEl  = document.getElementById('splash');
  const splashBtn = document.getElementById('splash-btn');

  function dismissSplash() {
    audioEl.volume = 0.7;
    audioEl.play().then(() => setMusicUI(true)).catch(() => setMusicUI(false));
    splashEl.classList.add('hidden');
    startAutoAdvance(); // slideshow starts only now
  }

  splashBtn.addEventListener('click', dismissSplash);
  splashEl.addEventListener('touchstart', (e) => {
    if (e.target === splashBtn) return; // handled above
  }, { passive: true });

  /* ── MANDALA GENERATION ───────────────────────────────── */
  (function buildMandala() {
    const NS = 'http://www.w3.org/2000/svg';
    function makeSVG(layers, dotRing, circles) {
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 400 400');
      svg.style.cssText = 'width:100%;height:100%;';
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', 'translate(200,200)');
      g.setAttribute('fill', 'none');
      g.setAttribute('stroke', 'rgba(212,175,55,0.9)');
      // Concentric circles
      circles.forEach(({ r, dash, sw }) => {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('r', r);
        c.setAttribute('stroke-width', sw || 0.8);
        if (dash) c.setAttribute('stroke-dasharray', dash);
        g.appendChild(c);
      });
      // Petal layers
      layers.forEach(({ r, count, rx, ry }) => {
        for (let i = 0; i < count; i++) {
          const pg = document.createElementNS(NS, 'g');
          pg.setAttribute('transform', `rotate(${(360 / count) * i})`);
          const el = document.createElementNS(NS, 'ellipse');
          el.setAttribute('cx', 0); el.setAttribute('cy', -r);
          el.setAttribute('rx', rx); el.setAttribute('ry', ry);
          pg.appendChild(el); g.appendChild(pg);
        }
      });
      // Dot ring
      if (dotRing) {
        const { r, count } = dotRing;
        for (let i = 0; i < count; i++) {
          const a = (2 * Math.PI / count) * i;
          const d = document.createElementNS(NS, 'circle');
          d.setAttribute('cx', +(r * Math.sin(a)).toFixed(1));
          d.setAttribute('cy', -(r * Math.cos(a)).toFixed(1));
          d.setAttribute('r', 2.8);
          d.setAttribute('fill', 'rgba(212,175,55,0.7)');
          d.setAttribute('stroke', 'none');
          g.appendChild(d);
        }
      }
      svg.appendChild(g);
      return svg;
    }
    const outer = makeSVG(
      [{ r:168, count:8, rx:16, ry:46 }, { r:128, count:12, rx:10, ry:30 }, { r:88, count:16, rx:7, ry:18 }],
      { r:148, count:32 },
      [{ r:185, sw:1 }, { r:168, dash:'4 8' }, { r:130, sw:0.6 }, { r:90, dash:'2 5' }, { r:55 }, { r:28, dash:'3 6' }]
    );
    const inner = makeSVG(
      [{ r:80, count:6, rx:14, ry:38 }, { r:55, count:8, rx:9, ry:22 }, { r:32, count:12, rx:5, ry:12 }],
      { r:68, count:18 },
      [{ r:88, sw:1 }, { r:70, dash:'3 6' }, { r:48 }, { r:28, dash:'2 4' }, { r:14 }]
    );
    document.getElementById('mandala-outer').appendChild(outer);
    document.getElementById('mandala-inner').appendChild(inner);
  })();

  /* ── FLOATING PETALS (Indian festival palette) ─────────── */
  const petalColors = [
    '#FF6B00','#FF9500','#FFB700', // saffron / marigold
    '#FFD700','#F0D060','#D4AF37', // gold
    '#FF4B82','#E8336D',           // rose / gulal pink
    '#FFF0C0','#FAEBD7',           // jasmine / cream
  ];
  const petalShapes = [
    '50% 0 50% 0', '50%', '40% 60% 60% 40%',
    '50% 50% 0 0', '0 50% 50% 50%',
  ];
  const canvas = document.getElementById('petals-canvas');

  function spawnPetal() {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 7 + Math.random() * 11;
    p.style.cssText = [
      `left:${Math.random() * 100}%`,
      `width:${size}px`, `height:${size * (0.7 + Math.random() * 0.8)}px`,
      `background:${petalColors[Math.floor(Math.random() * petalColors.length)]}`,
      `opacity:0`,
      `animation-duration:${7 + Math.random() * 9}s`,
      `animation-delay:${Math.random() * 2}s`,
      `border-radius:${petalShapes[Math.floor(Math.random() * petalShapes.length)]}`,
    ].join(';');
    canvas.appendChild(p);
    setTimeout(() => p.remove(), 18000);
  }

  /* ── PER-SLIDE THEME BURST ───────────────────────────────── */
  const THEME_CONFIG = {
    'screen-haldi':     { chars:['·','•','✦','◦'], colors:['#FFD700','#FFA500','#FF8C00','#FFEC8B'], fly:'up',   count:28 },
    'screen-sangeet':   { chars:['♪','♫','♩','♬'], colors:['#E040FB','#CE93D8','#FFD700','#FF80AB'], fly:'drift',count:20 },
    'screen-vivaah':    { chars:['✦','•','◦','*'],  colors:['#FF6B35','#FF4500','#FFD700','#FF8C00'], fly:'spark',count:32 },
    'screen-reception': { chars:['✦','★','✧','·'],  colors:['#FFD700','#FFF8E1','#F0D060','#E8D5A3'], fly:'fall', count:24 },
  };

  function spawnThemeBurst(screenId) {
    const cfg = THEME_CONFIG[screenId];
    if (!cfg) return;
    const tc = document.getElementById('tc-' + screenId.replace('screen-',''));
    if (!tc) return;
    tc.innerHTML = '';
    for (let i = 0; i < cfg.count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'tp';
        el.textContent = cfg.chars[Math.floor(Math.random() * cfg.chars.length)];
        const x = 10 + Math.random() * 80, y = 20 + Math.random() * 70;
        let tx = (Math.random() - 0.5) * 200,
            ty = cfg.fly === 'up'    ? -(80 + Math.random() * 160) :
                 cfg.fly === 'fall'  ?  (60 + Math.random() * 120) :
                 cfg.fly === 'spark' ? -(40 + Math.random() * 120) :
                                        (Math.random() - 0.5) * 140 - 60;
        const dur  = 2.5 + Math.random() * 2.5;
        const size = 12 + Math.random() * 18;
        el.style.cssText = [
          `left:${x}%`, `top:${y}%`,
          `font-size:${size}px`,
          `color:${cfg.colors[Math.floor(Math.random() * cfg.colors.length)]}`,
          `--tx:${tx}px`, `--ty:${ty}px`,
          `--ts:${0.3 + Math.random() * 0.5}`,
          `--tr:${(Math.random()-0.5)*360}deg`,
          `animation-duration:${dur}s`,
          `filter:drop-shadow(0 0 4px currentColor)`,
        ].join(';');
        tc.appendChild(el);
        setTimeout(() => el.remove(), dur * 1000 + 200);
      }, i * 60);
    }
  }

  setInterval(spawnPetal, 350);
  for (let i = 0; i < 14; i++) spawnPetal();

  /* ── ACCURATE DATE / CLOCK ICONS ────────────────────────── */
  (function upgradeDetailIcons() {
    function calSVG(day, month) {
      const abbr = month.substring(0, 3).toUpperCase();
      const fs   = String(day).length > 1 ? '6.5' : '8';
      return `<svg class="detail-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">`
        // white body with light border
        + `<rect x="1.5" y="3.5" width="17" height="15" rx="1.5" fill="white" stroke="#bbb" stroke-width="0.7"/>`
        // red header (flat bottom edge)
        + `<path d="M1.5 5.5 Q1.5 3.5 3 3.5 H17 Q18.5 3.5 18.5 5.5 V9.5 H1.5 Z" fill="#CC2222"/>`
        // month text
        + `<text x="10" y="8.5" text-anchor="middle" font-size="4" fill="white" font-weight="700" font-family="system-ui,sans-serif">${abbr}</text>`
        // ring tabs
        + `<line x1="7" y1="1.5" x2="7" y2="5" stroke="#888" stroke-width="1.5" stroke-linecap="round"/>`
        + `<line x1="13" y1="1.5" x2="13" y2="5" stroke="#888" stroke-width="1.5" stroke-linecap="round"/>`
        // day number
        + `<text x="10" y="17" text-anchor="middle" font-size="${fs}" fill="#222" font-weight="700" font-family="system-ui,sans-serif">${day}</text>`
        + `</svg>`;
    }
    function clockSVG(h24, min) {
      const hRad = ((h24 % 12) + min / 60) * Math.PI / 6;
      const mRad = min * Math.PI / 30;
      const hx = (10 + 3.5 * Math.sin(hRad)).toFixed(2);
      const hy = (10 - 3.5 * Math.cos(hRad)).toFixed(2);
      const mx = (10 + 5   * Math.sin(mRad)).toFixed(2);
      const my = (10 - 5   * Math.cos(mRad)).toFixed(2);
      return `<svg class="detail-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">`
        + `<circle cx="10" cy="10.5" r="7.5" fill="#CC2222" stroke="#AA1111" stroke-width="0.5"/>`
        + `<circle cx="10" cy="10.5" r="6" fill="white"/>`
        + `<circle cx="3.2" cy="5.5" r="1.8" fill="#CC2222" stroke="#AA1111" stroke-width="0.5"/>`
        + `<circle cx="16.8" cy="5.5" r="1.8" fill="#CC2222" stroke="#AA1111" stroke-width="0.5"/>`
        + `<line x1="10" y1="10.5" x2="${(parseFloat(hx)).toFixed(2)}" y2="${(parseFloat(hy)+0.5).toFixed(2)}" stroke="#222" stroke-width="1.6" stroke-linecap="round"/>`
        + `<line x1="10" y1="10.5" x2="${(parseFloat(mx)).toFixed(2)}" y2="${(parseFloat(my)+0.5).toFixed(2)}" stroke="#222" stroke-width="1.1" stroke-linecap="round"/>`
        + `<circle cx="10" cy="10.5" r="1" fill="#CC2222" stroke="none"/>`
        + `</svg>`;
    }
    document.querySelectorAll('.detail-row').forEach(row => {
      const label = row.querySelector('.detail-label');
      const value = row.querySelector('.detail-value');
      if (!label || !value) return;
      const val = value.textContent;
      if (label.textContent.includes('📅')) {
        const m = val.match(/\b(\d{1,2})\s+(June|July|January|February|March|April|May|August|September|October|November|December)/i);
        if (m) label.innerHTML = calSVG(m[1], m[2]) + ' Date';
      }
      if (label.textContent.includes('⏰')) {
        const m = val.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (m) {
          let h = parseInt(m[1]), min = parseInt(m[2]);
          const pm = m[3].toUpperCase() === 'PM';
          if (pm && h !== 12) h += 12;
          if (!pm && h === 12) h = 0;
          label.innerHTML = clockSVG(h, min) + ' Time';
        }
      }
    });
  })();

})();
