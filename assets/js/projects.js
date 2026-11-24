/* ==========================================================
   projects.js - project filtering and the "View Details" pop-up
   ========================================================== */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project[data-category]');
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category.split(' ').includes(filter);
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  const fields = {
    img: modal.querySelector('img'),
    title: modal.querySelector('#modal-title'),
    desc: modal.querySelector('#modal-desc'),
    tags: modal.querySelector('#modal-tags'),
  };
  let lastFocus = null;
  const close = () => { modal.classList.remove('open'); if (lastFocus) lastFocus.focus(); };

  document.querySelectorAll('[data-details]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project');
      lastFocus = btn;
      fields.img.src = card.querySelector('.thumb img').src;
      fields.img.alt = card.querySelector('.thumb img').alt;
      fields.title.textContent = card.querySelector('h3').textContent;
      fields.desc.textContent = card.dataset.long;
      fields.tags.innerHTML = card.querySelector('.tags').innerHTML;
      modal.classList.add('open');
      modal.querySelector('.modal-close').focus();
    });
  });
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  modal.querySelector('.modal-close').addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
}

/* Demo / GitHub buttons are placeholders until real links exist */
function initUnavailableLinks() {
  document.querySelectorAll('[aria-disabled="true"]').forEach((el) =>
    el.addEventListener('click', (e) => e.preventDefault()));
}

document.addEventListener('DOMContentLoaded', () => {
  initProjectFilter();
  initProjectModal();
  initUnavailableLinks();
});
