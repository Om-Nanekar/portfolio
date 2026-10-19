/**
 * Cyberpunk Glassmorphism Portfolio — main.js
 * Om Naresh Nanekar
 */
(function () {
  "use strict";

  /* ══════════════════════════════════
     PRELOADER
  ══════════════════════════════════ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader && preloader.classList.add('done');
    }, 800);
  });

  /* ══════════════════════════════════
     PARTICLE CANVAS (subtle floating dots)
  ══════════════════════════════════ */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#00ff88', '#a855f7', '#00d4ff', '#3b82f6', '#ec4899'];
    const COUNT  = Math.min(70, Math.floor(window.innerWidth / 18));

    const particles = Array.from({ length: COUNT }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      r:   Math.random() * 1.8 + 0.4,
      vx:  (Math.random() - 0.5) * 0.35,
      vy:  (Math.random() - 0.5) * 0.35,
      col: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.4 + 0.1,
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
      });

      // Draw faint connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].col;
            ctx.globalAlpha = (1 - dist / 120) * 0.08;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ══════════════════════════════════
     NAVBAR: scroll + hamburger
  ══════════════════════════════════ */
  const navbar       = document.getElementById('navbar');
  const hamburger    = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');

  // Scroll → add .scrolled class
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileDrawer.classList.toggle('open', open);
    });

    // Close drawer when a link is clicked
    mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileDrawer.classList.remove('open');
      });
    });
  }

  /* ══════════════════════════════════
     ACTIVE NAV LINK on scroll
  ══════════════════════════════════ */
  const allNavLinks = document.querySelectorAll('.nav-link');

  function updateActive() {
    const scrollY = window.scrollY + 120;
    ['hero', 'about', 'skills', 'projects', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
        allNavLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('load', updateActive);

  /* ══════════════════════════════════
     TYPED.JS
  ══════════════════════════════════ */
  const typedEl = document.querySelector('.typed');
  if (typedEl && typeof Typed !== 'undefined') {
    const items = typedEl.getAttribute('data-typed-items').split(',');
    new Typed('.typed', {
      strings:   items,
      loop:      true,
      typeSpeed: 85,
      backSpeed: 45,
      backDelay: 2200,
    });
  }

  /* ══════════════════════════════════
     AOS INIT
  ══════════════════════════════════ */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing:   'ease-out-cubic',
      once:     true,
    });
  }



  /* ══════════════════════════════════
     GLASS CARD scroll reveal
     (supplement AOS with a custom fade-up)
  ══════════════════════════════════ */
  const glassCards = document.querySelectorAll('.glass-card');
  if (glassCards.length) {
    const cardIO = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          // stagger based on card index inside parent
          const siblings = [...e.target.parentElement.children];
          const idx = siblings.indexOf(e.target);
          setTimeout(() => {
            e.target.classList.add('aos-animate');
          }, idx * 80);
          cardIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    glassCards.forEach(card => cardIO.observe(card));
  }

  /* ══════════════════════════════════
     SCROLL TOP BUTTON
  ══════════════════════════════════ */
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ══════════════════════════════════
     CONTACT FORM — submit feedback
  ══════════════════════════════════ */
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');

  if (form && submitBtn) {
    form.addEventListener('submit', () => {
      submitBtn.disabled = true;
      if (submitText) submitText.textContent = 'Sending…';
    });
  }

  /* ══════════════════════════════════
     SMOOTH HASH SCROLL (page load)
  ══════════════════════════════════ */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }, 100);
      }
    }
  });

})();