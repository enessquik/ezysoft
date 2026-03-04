/**
 * EzySoft – main.js
 * Handles: navbar scroll, mobile menu, scroll reveal,
 *          counter animation, contact form, back-to-top.
 */

(function () {
  'use strict';

  /* ── Helpers ── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ── Navbar scroll behaviour ── */
  const navbar = $('#navbar');
  function handleNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar();

  /* ── Mobile menu toggle ── */
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
    }
  });

  // Close mobile menu when a link is clicked
  $$('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) closeMenu();
  });

  /* ── Smooth scroll for all anchor links ── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Scroll reveal ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger sibling items
          const siblings = Array.from(entry.target.parentElement.children)
            .filter(el => el.classList.contains('reveal'));
          const idx = siblings.indexOf(entry.target);
          const delay = (idx % 4) * 80;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Counter animation ── */
  function animateCounter(el, target, duration = 1400) {
    let start = null;
    const startVal = 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(startVal + (target - startVal) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$('[data-target]').forEach(el => {
            animateCounter(el, parseInt(el.dataset.target, 10));
          });
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = $('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ── Contact Form ── */
  const form = $('#contactForm');
  if (form) {
    const fields = {
      name:    { el: $('#name'),    errorEl: $('#nameError'),    validate: v => v.trim().length >= 2 ? '' : 'Ad soyad en az 2 karakter olmalı.' },
      email:   { el: $('#email'),   errorEl: $('#emailError'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Geçerli bir e-posta adresi girin.' },
      subject: { el: $('#subject'), errorEl: $('#subjectError'), validate: v => v ? '' : 'Lütfen bir konu seçin.' },
      message: { el: $('#message'), errorEl: $('#messageError'), validate: v => v.trim().length >= 10 ? '' : 'Mesaj en az 10 karakter olmalı.' },
    };

    function validateField(key) {
      const { el, errorEl, validate } = fields[key];
      const error = validate(el.value);
      errorEl.textContent = error;
      el.classList.toggle('error', Boolean(error));
      return !error;
    }

    // Real-time validation on blur
    Object.keys(fields).forEach(key => {
      fields[key].el.addEventListener('blur', () => validateField(key));
      fields[key].el.addEventListener('input', () => {
        if (fields[key].el.classList.contains('error')) validateField(key);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const allValid = Object.keys(fields).map(k => validateField(k)).every(Boolean);
      if (!allValid) return;

      const btnText = form.querySelector('.btn-text');
      const btnLoading = form.querySelector('.btn-loading');
      const successMsg = $('#formSuccess');

      btnText.hidden = true;
      btnLoading.hidden = false;
      form.querySelector('button[type="submit"]').disabled = true;

      // Simulate async submission (replace with actual fetch/API call)
      await new Promise(resolve => setTimeout(resolve, 1400));

      btnText.hidden = false;
      btnLoading.hidden = true;
      form.querySelector('button[type="submit"]').disabled = false;
      successMsg.hidden = false;
      form.reset();

      // Hide success after 6 seconds
      setTimeout(() => { successMsg.hidden = true; }, 6000);
    });
  }

  /* ── Back to Top ── */
  const backTop = $('#backTop');
  if (backTop) {
    function toggleBackTop() {
      if (window.scrollY > 400) {
        backTop.classList.add('visible');
      } else {
        backTop.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', toggleBackTop, { passive: true });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleBackTop();
  }

  /* ── Footer year ── */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
