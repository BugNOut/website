// =============================================
// Bug N' Out LLC - Animation & Interaction Engine
// =============================================

(function() {
  'use strict';

  // ----- Scroll Reveal Observer -----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve stagger parents - children need individual handling
        if (!entry.target.classList.contains('stagger')) {
          revealObserver.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all reveal elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger').forEach(el => {
    revealObserver.observe(el);
  });

  // ----- Counter Animation for Stats -----
  function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const start = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // Observe stats section for counter triggers
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll('.stat-number');
        numbers.forEach(num => {
          const text = num.textContent.trim();
          // Handle formats like "15+", "1,200+", "100%"
          const match = text.match(/^([\d,]+)([+%k]?)/);
          if (match) {
            const target = parseInt(match[1].replace(/,/g, ''), 10);
            const suffix = match[2] || '';
            num.textContent = '0' + suffix;
            animateCounter(num, target, suffix);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ----- FAQ Accordion -----
  document.addEventListener('click', (e) => {
    const question = e.target.closest('.faq-question');
    if (question) {
      const item = question.closest('.faq-item');
      if (!item) return;

      // Close all other items
      const parent = item.closest('.faq-list');
      if (parent) {
        parent.querySelectorAll('.faq-item.active').forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
      }

      item.classList.toggle('active');
    }
  });

  // ----- Smooth Scroll for Anchor Links -----
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  // ----- Parallax Effect on Hero -----
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
      const scrolled = window.scrollY;
      const bg = hero.querySelector('.hero-bg img');
      if (bg) {
        bg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
      }
    }
  }, { passive: true });

  // ----- Create Particle Effect on Hero -----
  function createParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDelay = (Math.random() * 15) + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      container.appendChild(particle);
    }
  }

  // Initialize particles after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createParticles);
  } else {
    createParticles();
  }

  // ----- Active Nav Link Highlighting -----
  function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', highlightActiveNav);
  } else {
    highlightActiveNav();
  }

})();