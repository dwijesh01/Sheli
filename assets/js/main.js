/* ==========================================================
   main.js - shared features used on every page
   ========================================================== */
document.documentElement.classList.add('js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1. Mobile hamburger menu */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  if (!toggle || !menu) return;
  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  };
  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

/* 2. Active navigation highlighting (matches the current file name) */
function highlightActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const active = link.getAttribute('href') === current;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
  });
}

/* 3. Typing effect: edit the words in the data-words attribute in index.html */
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const words = JSON.parse(el.dataset.words);
  if (reduceMotion) { el.textContent = words[0]; return; }
  let w = 0, c = 0, deleting = false;
  function tick() {
    const word = words[w];
    c += deleting ? -1 : 1;
    el.textContent = word.slice(0, c);
    let delay = deleting ? 45 : 90;
    if (!deleting && c === word.length) { deleting = true; delay = 1400; }
    else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
    setTimeout(tick, delay);
  }
  tick();
}

/* 4. Scroll reveal + 6. skill progress bars (one shared observer) */
function initScrollEffects() {
  const reveals = document.querySelectorAll('[data-reveal]');
  const bars = document.querySelectorAll('.bar-fill');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    bars.forEach((b) => (b.style.width = b.dataset.level + '%'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  reveals.forEach((el) => io.observe(el));

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      bar.style.width = bar.dataset.level + '%';
      barObserver.unobserve(bar);
    });
  }, { threshold: 0.4 });
  bars.forEach((b) => barObserver.observe(b));
}

/* 7. Back-to-top button */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
}

/* 9. Dynamic copyright year */
function setYear() {
  document.querySelectorAll('.year').forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* 11. Resume print button */
function initPrint() {
  document.querySelectorAll('[data-print]').forEach((btn) => btn.addEventListener('click', () => window.print()));
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  highlightActiveNav();
  initTyping();
  initScrollEffects();
  initBackToTop();
  setYear();
  initPrint();
});
