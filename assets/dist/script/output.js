/**
 * Sankalp Portfolio - Main JavaScript
 * Animations, interactions, mobile nav
 * Pure vanilla JS - no frameworks
 */

(function() {
  'use strict';

  // ============================================
  // Page load curtain
  // ============================================
  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  document.body.prepend(curtain);
  window.addEventListener('load', function() {
    curtain.classList.add('is-hidden');
    setTimeout(function() { curtain.remove(); }, 800);
  });

  // ============================================
  // Mobile menu toggle (injected on all pages)
  // ============================================
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('.header-nav');

  if (header && nav) {
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-label', 'Toggle navigation menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.parentNode.insertBefore(toggle, nav);

    toggle.addEventListener('click', function() {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================
  // Header scroll effect
  // ============================================
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ============================================
  // Hero reveal animation
  // ============================================
  const heroTitle = document.querySelector('[data-hero-title]');
  const heroDesc = document.querySelector('[data-hero-desc]');
  const heroActions = document.querySelector('[data-hero-actions]');

  function revealHero() {
    if (heroTitle) heroTitle.classList.add('is-revealed');
    if (heroDesc) heroDesc.classList.add('is-revealed');
    if (heroActions) heroActions.classList.add('is-revealed');
  }

  if (heroTitle) {
    requestAnimationFrame(function() {
      setTimeout(revealHero, 300);
    });
  }

  // ============================================
  // Hero parallax
  // ============================================
  const heroMedia = document.querySelector('[data-hero-parallax]');
  if (heroMedia) {
    window.addEventListener('scroll', function() {
      const scroll = window.pageYOffset;
      const hero = heroMedia.closest('.hero');
      if (!hero) return;
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      if (scroll < heroBottom) {
        heroMedia.style.transform = 'scale(1.08) translateY(' + (scroll * 0.25) + 'px)';
      }
    }, { passive: true });
  }

  // ============================================
  // Intersection Observer - AOS fade-up
  // ============================================
  const aosElements = document.querySelectorAll('[data-aos]');
  if (aosElements.length && 'IntersectionObserver' in window) {
    const aosObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    aosElements.forEach(function(el) {
      aosObserver.observe(el);
    });
  }

  // ============================================
  // Stat counter animation
  // ============================================
  const statNumbers = document.querySelectorAll('[data-count]');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = prefix + value.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function(el) {
      countObserver.observe(el);
    });
  }

  // ============================================
  // Timeline / Event filters
  // ============================================
  const filterButtons = document.querySelectorAll('[data-timeline-filter]');
  const eventItems = document.querySelectorAll('[data-timeline-event]');

  if (filterButtons.length && eventItems.length) {
    filterButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-timeline-filter');
        filterButtons.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        eventItems.forEach(function(item) {
          const itemYear = item.getAttribute('data-year');
          const show = filter === 'all' || itemYear === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ============================================
  // Contact form validation
  // ============================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');
      let valid = true;

      [name, email, message].forEach(function(field) {
        if (field) {
          field.removeAttribute('aria-invalid');
          field.style.borderColor = '';
        }
      });

      if (name && !name.value.trim()) {
        valid = false;
        name.setAttribute('aria-invalid', 'true');
        name.style.borderColor = '#cf2e2e';
      }
      if (email && !email.value.trim()) {
        valid = false;
        email.setAttribute('aria-invalid', 'true');
        email.style.borderColor = '#cf2e2e';
      }
      if (message && !message.value.trim()) {
        valid = false;
        message.setAttribute('aria-invalid', 'true');
        message.style.borderColor = '#cf2e2e';
      }
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        valid = false;
        email.setAttribute('aria-invalid', 'true');
        email.style.borderColor = '#cf2e2e';
      }

      if (!valid) e.preventDefault();
    });
  }

  // ============================================
  // Smooth scroll for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // Marvel-style intro (home about teaser)
  // ============================================
  const marvelIntro = document.querySelector('[data-marvel-intro]');
  if (marvelIntro) {
    if ('IntersectionObserver' in window) {
      const marvelObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            marvelIntro.classList.add('is-playing');
            setTimeout(function() { marvelIntro.classList.add('is-live'); }, 700);
            marvelObs.unobserve(marvelIntro);
          }
        });
      }, { threshold: 0.3 });
      marvelObs.observe(marvelIntro);
    } else {
      marvelIntro.classList.add('is-playing', 'is-live');
    }
  }

  // ============================================
  // Grid overlay toggle
  // ============================================
  const gridOverlay = document.getElementById('grid-overlay');
  if (gridOverlay && window.location.hash === '#debug') {
    gridOverlay.style.display = 'block';
  }

})();