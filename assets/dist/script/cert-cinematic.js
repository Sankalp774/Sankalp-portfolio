/**
 * Certificates — F1 Starting Grid 3D scroll (broadcast layout)
 */
(function () {
  'use strict';

  var track = document.querySelector('[data-grid-track]');
  var stage = document.querySelector('[data-grid-stage]');
  var world = document.querySelector('[data-grid-world]');
  var panelsHost = document.querySelector('[data-grid-panels]');
  var posLabel = document.querySelector('[data-grid-pos]');
  var progressBar = document.querySelector('[data-grid-progress-bar]');
  var finale = document.querySelector('[data-grid-finale]');
  var bg = document.querySelector('[data-grid-bg]');
  var floor = document.querySelector('[data-grid-floor]');
  var laneMarkers = document.querySelector('[data-grid-lane-markers]');
  var scene = document.querySelector('.grid-3d__scene');
  var advanceCue = document.querySelector('[data-grid-advance-cue]');
  var nextPage = document.querySelector('[data-grid-next-page]');
  var lastCueSide = '';
  var sessionNextShown = false;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!track || !stage || !world || !panelsHost) return;

  var FALLBACK_IMG = 'https://picsum.photos/seed/cert-fallback/600/800';
  var SCROLL_SPEED = 1;
  var CERT_COUNT;
  var SEG_LEN;
  var CERT_END;
  var EXIT_END;
  var Z_STEP = 300;
  var LERP = reduceMotion ? 1 : 0.028;
  var PERSP_LERP = 0.045;

  var GRID = [
    { title: 'DIGI-SUSTAIN Track Winner', issuer: 'IIITM Gwalior (Global Business Review International conference)', date: '2026', image: 'assets/certificates/thumbs/1.jpg', link: 'assets/certificates/files/1.pdf' },
    { title: 'AWS ML Foundations', issuer: 'Amazon Web Services', date: '2024', image: 'assets/certificates/thumbs/2.jpg', link: 'assets/certificates/files/2.pdf' },
    { title: 'App Development Internship', issuer: 'SkillVertex', date: '2024', image: 'assets/certificates/thumbs/6.jpg', link: 'assets/certificates/files/6.pdf' },
    { title: 'Generative AI Ideathon', issuer: 'SRM Institute of Science & Technology', date: '2024', image: 'assets/certificates/thumbs/14.jpg', link: 'assets/certificates/files/14.pdf' },
    { title: 'X-Play Aaruush 24', issuer: 'SRMIST — Aaruush', date: '2024', image: 'assets/certificates/thumbs/15.jpg', link: 'assets/certificates/files/15.pdf' },
    { title: 'Scaler Computer Networking', issuer: 'Scaler Academy', date: '2024', image: 'assets/certificates/thumbs/8.jpg', link: 'assets/certificates/files/8.png' },
    { title: 'Google Analytics for Beginners', issuer: 'Google', date: '2024', image: 'assets/certificates/thumbs/9.pdf.jpg', link: 'assets/certificates/files/9.pdf.pdf' },
    { title: 'Advanced Google Analytics', issuer: 'Google', date: '2024', image: 'assets/certificates/thumbs/4.jpg', link: 'assets/certificates/files/4.pdf' },
    { title: 'App Development Training', issuer: 'Industry Training Program', date: '2024', image: 'assets/certificates/thumbs/5.jpg', link: 'assets/certificates/files/5.pdf' },
    { title: 'Arduino vs Raspberry Pi', issuer: 'Technical Workshop', date: '2024', image: 'assets/certificates/thumbs/7.jpg', link: 'assets/certificates/files/7.pdf' },
    { title: 'NPTEL Programming in Java', issuer: 'NPTEL — IIT Madras', date: '2023', image: 'assets/certificates/thumbs/3.jpg', link: 'assets/certificates/files/3.pdf' },
    { title: 'WEBB WAVE 5', issuer: 'SRMIST Web Development', date: '2023', image: 'assets/certificates/thumbs/1701680102329.jpg', link: 'assets/certificates/files/1701680102329.pdf' }
  ];

  var panels = [];
  var laneSlots = [];
  var targetProgress = 0;
  var smoothProgress = 0;
  var smoothPersp = 50;
  var currentIdx = 0;
  var rafId = null;
  var time = 0;
  var inTrack = false;


  CERT_COUNT = GRID.length;
  SEG_LEN = 1 / (CERT_COUNT + 1);
  CERT_END = CERT_COUNT * SEG_LEN;
  EXIT_END = CERT_END + SEG_LEN * 0.72;

  track.style.setProperty('--grid-slots', String((GRID.length + 1) * SCROLL_SPEED));

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function focusCurve(dist) {
    return Math.pow(Math.max(0, 1 - dist * 0.52), 1.5);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function isRightSide(i) {
    return i % 2 === 1;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildPanels() {
    GRID.forEach(function (item, i) {
      var panel = document.createElement('article');
      panel.className = 'grid-3d__panel ' + (isRightSide(i) ? 'grid-3d__panel--right' : 'grid-3d__panel--left');
      panel.setAttribute('data-grid-panel', String(i));
      panel.setAttribute('data-side', isRightSide(i) ? 'right' : 'left');
      panel.innerHTML =
        '<div class="grid-3d__dock">' +
          '<div class="grid-3d__broadcast">' +
            '<div class="grid-3d__hero-col">' +
              '<div class="grid-3d__accent" aria-hidden="true"></div>' +
              '<a href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener" class="grid-3d__cert">' +
                '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="eager" decoding="async" data-cert-img>' +
              '</a>' +
              '<div class="grid-3d__pos-badge" aria-label="Position ' + (i + 1) + '">' +
                '<span class="grid-3d__pos-num">' + (i + 1) + '</span>' +
                '<span class="grid-3d__pos-chevron" aria-hidden="true"></span>' +
              '</div>' +
            '</div>' +
            '<div class="grid-3d__info-bar">' +
              '<div class="grid-3d__info">' +
                '<h3 class="grid-3d__title">' + escapeHtml(item.title) + '</h3>' +
                '<p class="grid-3d__issuer">' + escapeHtml(item.issuer) + '</p>' +
                '<p class="grid-3d__date">' + escapeHtml(item.date) + '</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      panelsHost.appendChild(panel);
      panels.push(panel);

      var img = panel.querySelector('[data-cert-img]');
      if (img) {
        img.addEventListener('error', function () {
          if (img.dataset.fallbackApplied) return;
          img.dataset.fallbackApplied = '1';
          img.src = FALLBACK_IMG + '?id=' + (i + 1);
        });
      }
    });
  }

  function preloadImages() {
    GRID.forEach(function (item) {
      var img = new Image();
      img.src = item.image;
    });
  }

  function buildLaneMarkers() {
    if (!laneMarkers) return;
    GRID.forEach(function (_, i) {
      var slot = document.createElement('span');
      slot.className = 'grid-3d__lane-slot';
      slot.textContent = String(i + 1);
      slot.setAttribute('data-lane', String(i));
      laneMarkers.appendChild(slot);
      laneSlots.push(slot);
    });
  }

  function getScrollRange() {
    return Math.max(track.offsetHeight - window.innerHeight, 1);
  }

  function getScrollProgress() {
    var range = getScrollRange();
    return Math.min(1, Math.max(0, -track.getBoundingClientRect().top / range));
  }

  function getCertProgress(progress) {
    if (progress >= CERT_END) return 1;
    return progress / CERT_END;
  }

  function getCamIndex(progress) {
    var slots = GRID.length;
    if (progress >= EXIT_END) return slots;
    if (progress >= CERT_END) return slots - 1;
    return (progress / CERT_END) * (slots - 1);
  }

  function getActiveIndex(progress) {
    var slots = GRID.length;
    if (progress >= EXIT_END) return slots;
    if (progress >= CERT_END) return slots - 1;
    return Math.min(slots - 1, Math.max(0, Math.round(getCamIndex(progress))));
  }

  function getExitProgress(progress) {
    if (progress < CERT_END || progress >= EXIT_END) return progress >= EXIT_END ? 1 : 0;
    return (progress - CERT_END) / (EXIT_END - CERT_END);
  }

  function indexFromProgress(progress) {
    return getActiveIndex(progress);
  }

  function render(progress) {
    var slots = GRID.length;
    var certT = getCertProgress(progress);
    var camIndex = getCamIndex(progress);
    var exitT = getExitProgress(progress);
    var inExit = exitT > 0;
    var postExit = progress >= EXIT_END;
    var camZ = certT * Z_STEP * slots;
    var camTilt = 2.5 + certT * 1.2;
    var camY = -certT * 8;
    var activeIdx = inExit || postExit ? slots - 1 : Math.min(slots - 1, Math.max(0, Math.round(camIndex)));
    var hudIdx = getActiveIndex(progress);
    var targetPersp = isRightSide(activeIdx) ? 62 : 38;
    smoothPersp = lerp(smoothPersp, targetPersp, PERSP_LERP);
    var camX = lerp(-5, 5, smoothPersp / 100) + certT * 3;
    var dockStrength = 0;
    var vw = window.innerWidth;

    world.style.setProperty('--cam-z', String(camZ));
    world.style.setProperty('--cam-tilt', String(camTilt));
    world.style.setProperty('--cam-y', String(camY));
    world.style.setProperty('--cam-x', String(camX));

    if (bg) {
      bg.style.setProperty('--bg-y', String(certT * -55));
      bg.style.setProperty('--bg-z', String(certT * -30));
      bg.style.setProperty('--light-pulse', String(0.5 + 0.5 * Math.sin(time * 0.0018)));
      bg.style.setProperty('--cars-y', String(certT * -18));
      bg.style.setProperty('--stands-x', String(certT * 12));
    }
    if (floor) {
      floor.style.setProperty('--floor-y', String(certT * 120));
    }
    if (stage) {
      stage.style.setProperty('--persp-x', smoothPersp + '%');
    }

    panels.forEach(function (panel, i) {
      var fromSide = isRightSide(i) ? 1 : -1;
      var dist, focus, slideX, slideY, scale, opacity, blur, rotY;

      if (postExit) {
        dist = 99;
        focus = 0;
        slideX = fromSide * 160;
        slideY = 48;
        scale = 0.9;
        opacity = 0;
        blur = 0;
        rotY = 0;
      } else if (inExit) {
        if (i === slots - 1) {
          dist = 0;
          focus = 1 - exitT;
          slideX = fromSide * (80 + exitT * 140);
          slideY = exitT * 56;
          scale = 0.96 - exitT * 0.1;
          opacity = 1 - exitT;
          blur = exitT * 4;
          rotY = fromSide * exitT * 6;
          dockStrength = Math.max(dockStrength, 1 - exitT);
        } else {
          dist = 99;
          focus = 0;
          slideX = 0;
          slideY = 0;
          scale = 0.9;
          opacity = 0;
          blur = 0;
          rotY = 0;
        }
      } else {
        dist = Math.abs(i - camIndex);
        focus = focusCurve(dist);
        var spread = vw * 0.06;
        var dockX = fromSide * lerp(spread, 0, focus);
        var driftX = (i - camIndex) * 4 * fromSide * (1 - focus);
        slideX = dockX + driftX;
        slideY = lerp(10, 0, focus);
        scale = 0.96 + focus * 0.04;
        opacity = dist < 0.42 ? 1 : Math.max(0, 1 - (dist - 0.42) * 2.8);
        blur = dist < 0.4 ? 0 : Math.min(3, (dist - 0.4) * 2.5);
        rotY = dist < 0.35 ? 0 : (i - camIndex) * -0.8 * fromSide * (1 - focus);
        if (dist < 0.35) dockStrength = Math.max(dockStrength, focus);
      }

      panel.style.setProperty('--focus', String(focus));
      panel.style.setProperty('--depth', String(i * Z_STEP));
      panel.style.setProperty('--slide-x', slideX + 'px');
      panel.style.setProperty('--slide-y', slideY + 'px');
      panel.style.setProperty('--panel-scale', String(scale));
      panel.style.setProperty('--panel-opacity', String(opacity));
      panel.style.setProperty('--panel-rot-y', rotY + 'deg');
      panel.style.setProperty('--blur', blur + 'px');
      panel.classList.toggle('is-active', !postExit && !inExit && dist < 0.28);
      panel.classList.toggle('is-near', !postExit && dist < 0.55);
      panel.classList.toggle('is-exiting', inExit && i === slots - 1);
    });

    if (stage) {
      stage.style.setProperty('--dock-strength', String(dockStrength));
      stage.classList.toggle('is-docked', dockStrength > 0.48);
    }
    if (scene) {
      scene.style.setProperty('--dock-strength', String(dockStrength));
    }

    var showSession = progress >= CERT_END;

    if (finale) {
      finale.classList.toggle('is-active', showSession);
      finale.classList.toggle('is-session', showSession);
    }

    if (nextPage) {
      nextPage.classList.toggle('is-visible', showSession);
      if (showSession && !sessionNextShown) {
        nextPage.classList.remove('is-pop');
        void nextPage.offsetWidth;
        nextPage.classList.add('is-pop');
        sessionNextShown = true;
      }
      if (!showSession) {
        sessionNextShown = false;
        nextPage.classList.remove('is-pop');
      }
    }

    var litCam = inExit ? slots - 1 : camIndex;
    laneSlots.forEach(function (slot, i) {
      if (postExit) {
        slot.classList.add('is-lit');
      } else {
        slot.classList.toggle('is-lit', Math.abs(i - litCam) < 0.5);
      }
    });

    if (progress >= CERT_END) {
      if (posLabel) posLabel.textContent = 'P' + slots + ' / P' + slots;
      currentIdx = slots;
    } else {
      currentIdx = hudIdx;
      if (posLabel) posLabel.textContent = 'P' + (hudIdx + 1) + ' / P' + slots;
    }

    if (progressBar) {
      var barPct = progress >= CERT_END ? 100 : certT * 100;
      progressBar.style.width = barPct + '%';
    }
    stage.classList.toggle('is-live', progress > 0.008 && progress < 0.998);

    if (advanceCue) {
      var cueSide = postExit || inExit ? '' : (isRightSide(activeIdx) ? 'left' : 'right');
      var cueVisible = progress > 0.01 && progress < CERT_END - SEG_LEN * 0.15;
      advanceCue.classList.toggle('is-visible', cueVisible);
      advanceCue.classList.toggle('is-docked', dockStrength > 0.5 && cueVisible);
      advanceCue.classList.toggle('grid-3d__advance-cue--left', cueSide === 'left');
      advanceCue.classList.toggle('grid-3d__advance-cue--right', cueSide === 'right');
      if (cueSide && cueSide !== lastCueSide) {
        advanceCue.classList.remove('is-pop');
        void advanceCue.offsetWidth;
        advanceCue.classList.add('is-pop');
        lastCueSide = cueSide;
      }
      if (!cueVisible) lastCueSide = '';
    }
  }

  function tick(now) {
    time = now || performance.now();

    if (!reduceMotion) {
      smoothProgress += (targetProgress - smoothProgress) * LERP;
      if (Math.abs(targetProgress - smoothProgress) < 0.00008) {
        smoothProgress = targetProgress;
      }
    } else {
      smoothProgress = targetProgress;
    }

    inTrack = getScrollProgress() > 0.004 && getScrollProgress() < 0.997;
    render(smoothProgress);

    if (inTrack || Math.abs(targetProgress - smoothProgress) > 0.00008) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function requestTick() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  buildPanels();
  buildLaneMarkers();
  preloadImages();
  targetProgress = getScrollProgress();
  smoothProgress = targetProgress;
  currentIdx = indexFromProgress(smoothProgress);
  render(smoothProgress);

  window.addEventListener('scroll', function () {
    targetProgress = getScrollProgress();
    requestTick();
  }, { passive: true });

  window.addEventListener('resize', function () {
    targetProgress = getScrollProgress();
    requestTick();
  }, { passive: true });

  requestTick();
})();