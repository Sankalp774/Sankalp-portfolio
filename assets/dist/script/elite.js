/**
 * Elite Layer — Page exploration HUD + contextual summaries
 */
(function() {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  document.body.classList.add('elite-mode');
  if (reduced) {
    document.body.classList.add('elite-reduced');
    return;
  }

  var shown = {};
  var xpFill = null;
  var xpLabel = null;
  var levelEl = null;

  var CONTACT = {
    title: 'CONTACT',
    desc: 'Open to Junior AI/ML roles',
    lines: [
      'Chennai, India',
      'sankalp774sahu@gmail.com',
      '+91 96917 28300',
      'github.com/Sankalp774'
    ],
    icon: '✉'
  };

  function currentPage() {
    var file = window.location.pathname.split('/').pop();
    if (!file || file === '') return 'index.html';
    return file;
  }

  var PAGE_META = {
    'index.html': { level: 1, zone: 'Home' },
    'about.html': { level: 2, zone: 'About' },
    'projects.html': { level: 3, zone: 'Projects' },
    'timeline.html': { level: 4, zone: 'Timeline' },
    'blog.html': { level: 5, zone: 'Blog' },
    'contacts.html': { level: 6, zone: 'Contact' }
  };

  if (currentPage().indexOf('blog-post') === 0) {
    PAGE_META[currentPage()] = { level: 5, zone: 'Blog' };
  }

  var meta = PAGE_META[currentPage()] || { level: 1, zone: 'Home' };

  // ============================================
  // Liquid-glass exploration HUD
  // ============================================
  var hud = document.createElement('div');
  hud.className = 'elite-xp-hud elite-glass';
  hud.setAttribute('aria-hidden', 'true');
  hud.innerHTML =
    '<span class="elite-xp-hud__level">LEVEL ' + meta.level + ' · ' + meta.zone.toUpperCase() + '</span>' +
    '<div class="elite-xp-hud__bar"><div class="elite-xp-hud__fill"></div></div>' +
    '<span class="elite-xp-hud__label">PAGE EXPLORATION 0%</span>';
  document.body.appendChild(hud);

  xpFill = hud.querySelector('.elite-xp-hud__fill');
  xpLabel = hud.querySelector('.elite-xp-hud__label');
  levelEl = hud.querySelector('.elite-xp-hud__level');

  setTimeout(function() { hud.classList.add('is-visible'); }, 900);

  function updateScrollXP() {
    var doc = document.documentElement;
    var scrollTop = window.pageYOffset || doc.scrollTop;
    var max = Math.max(doc.scrollHeight - window.innerHeight, 1);
    var pct = Math.min(100, Math.round((scrollTop / max) * 100));
    if (xpFill) xpFill.style.width = pct + '%';
    if (xpLabel) {
      xpLabel.textContent = pct >= 98
        ? 'LEVEL ' + meta.level + ' COMPLETE'
        : 'PAGE EXPLORATION ' + pct + '%';
    }
    if (pct >= 98) showSummary('complete', meta.zone.toUpperCase() + ' CLEARED', 'Full page explored · Level ' + meta.level, ['Navigate to the next level in the menu'], '★');
  }

  window.addEventListener('scroll', updateScrollXP, { passive: true });
  updateScrollXP();

  // ============================================
  // Contextual summary popups
  // ============================================
  var toastBox = document.createElement('div');
  toastBox.className = 'elite-achievements';
  toastBox.setAttribute('aria-hidden', 'true');
  document.body.appendChild(toastBox);

  function linesHtml(lines) {
    if (!lines || !lines.length) return '';
    return '<div class="elite-achievement__lines">' +
      lines.map(function(l) { return '<span>' + l + '</span>'; }).join('') +
    '</div>';
  }

  function showSummary(id, title, desc, lines, icon) {
    if (shown[id]) return;
    shown[id] = true;

    var toast = document.createElement('div');
    toast.className = 'elite-achievement';
    toast.innerHTML =
      '<span class="elite-achievement__icon">' + (icon || '◆') + '</span>' +
      '<div class="elite-achievement__body">' +
        '<div class="elite-achievement__title">' + title + '</div>' +
        '<div class="elite-achievement__desc">' + desc + '</div>' +
        linesHtml(lines) +
      '</div>';

    toastBox.appendChild(toast);

    setTimeout(function() {
      toast.classList.add('is-out');
      setTimeout(function() { toast.remove(); }, 500);
    }, 5000);
  }

  var page = currentPage();
  var PAGE_SUMMARIES = {
    'index.html': [
      { id: 'brief', trigger: 'load', delay: 600, title: 'PROFILE', desc: 'Sankalp Sahu — Junior AI/ML Engineer', lines: ['Chennai · SRM IST · 14 public repos'], icon: '01' },
      { id: 'stats', sel: '.stats-grid', title: 'METRICS', desc: 'Production-ready engineering stats', lines: ['5+ projects shipped', '87% BERTScore accuracy', '1000+ concurrent transactions'], icon: '87' },
      { id: 'topproj', sel: '.featured-grid', title: 'TOP PROJECT', desc: 'RefactorAI Gen 2 — flagship build', lines: ['FastAPI + React 19 + Docker', 'Qwen 2.5-Coder via LiteLLM', 'Last push Jun 6, 2026'], icon: 'S' },
      { id: 'skills', sel: '.skills-grid', title: 'EXPERTISE', desc: 'Core technical stack', lines: ['LangChain · RAG · Mistral', 'FastAPI · PyTorch · NLP'], icon: '⬡' },
      { id: 'contact', sel: '.footer', title: CONTACT.title, desc: CONTACT.desc, lines: CONTACT.lines, icon: CONTACT.icon }
    ],
    'about.html': [
      { id: 'brief', trigger: 'load', delay: 600, title: 'ABOUT', desc: 'Final-year CSE · GenAI specialist', lines: ['Building LLM, RAG & NLP systems'], icon: '02' },
      { id: 'education', sel: '.bio-intro', title: 'EDUCATION', desc: 'B.Tech Computer Science & Engineering', lines: ['SRM Institute of Science & Technology', 'Sept 2022 – Present · Chennai'], icon: 'ED' },
      { id: 'experience', sel: '.page.about h3:nth-of-type(2)', title: 'EXPERIENCE', desc: 'App Development Intern — SkillVertex', lines: ['Jan 2024 – Mar 2024', 'Firebase Auth · Firestore · Mobile/Web'], icon: 'EX' },
      { id: 'contact', sel: '.page.about .col-span-12.lg\\:col-span-4 .text-bodyM', title: CONTACT.title, desc: CONTACT.desc, lines: CONTACT.lines, icon: CONTACT.icon }
    ],
    'projects.html': [
      { id: 'brief', trigger: 'load', delay: 600, title: 'PROJECTS', desc: '14 public GitHub repositories', lines: ['Sorted by last push date'], icon: '03' },
      { id: 'best', sel: '.projects-grid .project-item:first-child', title: 'BEST PROJECT', desc: 'RefactorAI — Generation 2', lines: ['Full-stack AI code refactoring', 'Monaco diff · Bandit · Ruff · Docker', 'github.com/Sankalp774/AI-Code-Refactor-and-Optimization'], icon: 'S' },
      { id: 'archive', sel: '.projects-grid', title: 'ARCHIVE', desc: 'Legal Analyzer · BankEngine · LLM Chatbot', lines: ['NLP · Java concurrency · LangChain'], icon: '∞' },
      { id: 'contact', sel: '.footer', title: CONTACT.title, desc: CONTACT.desc, lines: CONTACT.lines, icon: CONTACT.icon }
    ],
    'timeline.html': [
      { id: 'brief', trigger: 'load', delay: 600, title: 'TIMELINE', desc: 'Career & repo milestones', lines: ['Built from GitHub activity'], icon: '04' },
      { id: 'latest', sel: '.events-grid .event-item:first-child', title: 'LATEST', desc: 'RefactorAI Gen 2 shipped', lines: ['Jun 6, 2026 — last push', 'Production full-stack GenAI app'], icon: '⏱' },
      { id: 'history', sel: '.events-grid', title: 'HISTORY', desc: '14 repos · Sep 2025 – Jun 2026', lines: ['From first commit to latest deploy'], icon: '↺' },
      { id: 'contact', sel: '.footer', title: CONTACT.title, desc: CONTACT.desc, lines: CONTACT.lines, icon: CONTACT.icon }
    ],
    'blog.html': [
      { id: 'brief', trigger: 'load', delay: 600, title: 'BLOG', desc: 'Notes on AI/ML & development', lines: ['Updates · tutorials · learnings'], icon: '05' },
      { id: 'posts', sel: '.projects-grid, .blog-grid, [data-aos]', title: 'READ', desc: 'Technical writing & project logs', lines: ['React · JavaScript · AI in web dev'], icon: '¶' },
      { id: 'contact', sel: '.footer', title: CONTACT.title, desc: CONTACT.desc, lines: CONTACT.lines, icon: CONTACT.icon }
    ],
    'contacts.html': [
      { id: 'brief', trigger: 'load', delay: 600, title: 'CONTACT', desc: 'Open to Junior AI/ML Engineer roles', lines: ['Chennai — collaborations & interviews'], icon: '06' },
      { id: 'contact', sel: '.contacts .col-span-12.lg\\:col-span-6.lg\\:col-start-7', title: CONTACT.title, desc: CONTACT.desc, lines: CONTACT.lines.concat(['linkedin.com/in/sankalp-sahu-738615250']), icon: CONTACT.icon },
      { id: 'form', sel: '#contact-form', title: 'MESSAGE', desc: 'Send a direct inquiry', lines: ['Roles · freelance · collaborations'], icon: '→' }
    ]
  };

  if (page.indexOf('blog-post') === 0) {
    PAGE_SUMMARIES[page] = [
      { id: 'brief', trigger: 'load', delay: 600, title: 'BLOG POST', desc: 'Level 5 · Article', lines: ['Technical notes & updates'], icon: '05' },
      { id: 'contact', sel: '.footer', title: CONTACT.title, desc: CONTACT.desc, lines: CONTACT.lines, icon: CONTACT.icon }
    ];
  }

  var summaries = PAGE_SUMMARIES[page] || PAGE_SUMMARIES['index.html'];

  summaries.forEach(function(s) {
    if (s.trigger === 'load') {
      setTimeout(function() {
        showSummary(s.id, s.title, s.desc, s.lines, s.icon);
      }, s.delay || 500);
      return;
    }

    if (!s.sel || !('IntersectionObserver' in window)) return;

    document.querySelectorAll(s.sel).forEach(function(el) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          showSummary(s.id, s.title, s.desc, s.lines, s.icon);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.2 });

      obs.observe(el);
    });
  });

  // ============================================
  // 3D tilt on cards
  // ============================================
  var tiltSelectors = '.featured-card, .explore-card, .project-item, .stat-item';
  document.querySelectorAll(tiltSelectors).forEach(function(el, i) {
    el.classList.add('elite-tilt', 'elite-shine');

    if (el.classList.contains('featured-card')) {
      var rank = document.createElement('span');
      rank.className = 'elite-rank elite-rank--' + (i === 0 ? 's' : i === 1 ? 'a' : 'b');
      rank.textContent = i === 0 ? 'S-RANK' : i === 1 ? 'A-RANK' : 'B-RANK';
      el.appendChild(rank);
    }

    if (el.classList.contains('explore-card')) {
      el.setAttribute('data-elite-index', String(i + 1).padStart(2, '0'));
    }

    if (!finePointer) return;

    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      el.classList.add('is-tilting');
      el.style.transform =
        'perspective(800px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-4px)';
    });

    el.addEventListener('mouseleave', function() {
      el.classList.remove('is-tilting');
      el.style.transform = '';
    });
  });

  // ============================================
  // Skill XP bars
  // ============================================
  document.querySelectorAll('.skill-item').forEach(function(el) {
    var bar = document.createElement('span');
    bar.className = 'elite-skill-xp';
    bar.setAttribute('aria-hidden', 'true');
    el.appendChild(bar);
  });

  // ============================================
  // Magnetic buttons
  // ============================================
  if (finePointer) {
    document.querySelectorAll('.button').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2 - 3) + 'px) scale(1.02)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = '';
      });
    });
  }

  // ============================================
  // Click ripple
  // ============================================
  document.querySelectorAll('.button, .explore-card').forEach(function(el) {
    el.addEventListener('click', function(e) {
      var rect = el.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'elite-ripple';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.appendChild(ripple);
      setTimeout(function() { ripple.remove(); }, 600);
    });
  });

  // ============================================
  // Page transition on internal links
  // ============================================
  document.querySelectorAll('a[href]').forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0 || href.indexOf('mailto:') === 0) return;
    if (link.hasAttribute('download') || link.getAttribute('target') === '_blank') return;
    if (!/\.html$/.test(href) && href.indexOf('.html') === -1) return;
    if (/\.pdf$/.test(href)) return;

    link.addEventListener('click', function(e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      var curtain = document.querySelector('.page-curtain') || document.createElement('div');
      if (!curtain.parentNode) {
        curtain.className = 'page-curtain';
        document.body.prepend(curtain);
      }
      curtain.classList.remove('is-hidden');
      curtain.classList.add('elite-page-exit');
      setTimeout(function() { window.location.href = href; }, 450);
    });
  });

})();