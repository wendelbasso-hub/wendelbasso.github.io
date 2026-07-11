(() => {
  'use strict';

  /* =========================================================
     THEME (claro / escuro)
  ========================================================= */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY = 'wb-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* =========================================================
     NAVBAR: fade in / fade out ao rolar
  ========================================================= */
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function handleScroll() {
    const currentY = window.scrollY;

    navbar.classList.toggle('nav-scrolled', currentY > 10);

    if (currentY > lastScrollY && currentY > 120) {
      navbar.classList.add('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  });

  /* Menu mobile (hamburger) */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* Destaque do link ativo conforme a seção visível */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  /* =========================================================
     REVEAL ON SCROLL
  ========================================================= */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* =========================================================
     HERO: efeito de digitação
  ========================================================= */
  const typedEl = document.getElementById('typed');
  const phrases = [
    'Gerente Administrativo',
    'Contador especializado em Custos & Orçamentos',
    'Guitarrista nas horas vagas',
    'Torcedor do São Paulo Futebol Clube',
    'Leitor de clássicos como Victor Hugo'
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  /* =========================================================
     CONTADORES ANIMADOS (stats)
  ========================================================= */
  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => statObserver.observe(el));

  /* =========================================================
     TOAST helper
  ========================================================= */
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <span class="toast-icon">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="m4 12 5 5L20 6" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span class="toast-text"></span>`;
      document.body.appendChild(toast);
    }
    toast.querySelector('.toast-text').textContent = message;
    setTimeout(() => toast.classList.add('show'), 10);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 3800);
  }

  /* =========================================================
     NEWSLETTER FORM
  ========================================================= */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    newsletterMsg.classList.remove('show', 'success', 'error');

    if (!isValid) {
      newsletterMsg.textContent = 'Por favor, informe um e-mail válido.';
      newsletterMsg.classList.add('show', 'error');
      emailInput.focus();
      return;
    }

    newsletterMsg.textContent = `Inscrição confirmada para ${email}! Obrigado por assinar.`;
    newsletterMsg.classList.add('show', 'success');
    showToast('Assinatura da newsletter confirmada!');
    newsletterForm.reset();
  });

  /* =========================================================
     CONTACT FORM
  ========================================================= */
  const contactForm = document.getElementById('contactForm');
  const contactMsg = document.getElementById('contactMsg');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    contactMsg.classList.remove('show', 'success', 'error');

    if (!name || !isEmailValid || !message) {
      contactMsg.textContent = 'Preencha nome, e-mail válido e mensagem antes de enviar.';
      contactMsg.classList.add('show', 'error');
      return;
    }

    contactMsg.textContent = `Obrigado, ${name}! Sua mensagem foi registrada e retornarei em breve.`;
    contactMsg.classList.add('show', 'success');
    showToast('Mensagem enviada com sucesso!');
    contactForm.reset();
  });

  /* =========================================================
     FOOTER YEAR
  ========================================================= */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* =========================================================
     BACKGROUND CANVAS: partículas conectadas (tema azul)
  ========================================================= */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.documentElement.scrollHeight;
  }

  function isDark() {
    return root.getAttribute('data-theme') === 'dark';
  }

  function createParticles() {
    const count = Math.min(70, Math.floor((width * height) / 28000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * (window.innerHeight * 1.2),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    const dark = isDark();
    const dotColor = dark ? 'rgba(138,180,255,0.6)' : 'rgba(31,95,208,0.45)';
    const lineColorBase = dark ? '138,180,255' : '31,95,208';
    const viewTop = window.scrollY;
    const viewBottom = viewTop + window.innerHeight;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < viewTop - 50 || p.y > viewBottom + 50) p.vy *= -1;
    });

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.y < viewTop - 100 || p.y > viewBottom + 100) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(${lineColorBase},${(1 - dist / 140) * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  requestAnimationFrame(drawParticles);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      createParticles();
    }, 250);
  });
})();
