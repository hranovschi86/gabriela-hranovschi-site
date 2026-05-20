/**
 * Injectează header și footer din /partials/ în orice pagină.
 * Folosește atributele data-include="header" și data-include="footer".
 * Funcționează atât local (cu server) cât și pe GitHub Pages.
 */

(async function () {
  const inject = async (selector, url) => {
    const target = document.querySelector(selector);
    if (!target) return;
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      target.outerHTML = await res.text();
    } catch (err) {
      console.error(`Eroare la încărcarea partial-ului ${url}:`, err);
      target.innerHTML = `<div style="padding:1rem;background:#fee;color:#900;">Partial neîncărcat: ${url}</div>`;
    }
  };

  await Promise.all([
    inject('[data-include="header"]', '/partials/header.html'),
    inject('[data-include="footer"]', '/partials/footer.html'),
  ]);

  // După injecție, atașăm comportamentul activ pentru meniu și an curent
  initHeaderBehavior();
  initFooterBehavior();
})();

function initHeaderBehavior() {
  // Marchează linkul activ pe baza pathname-ului
  const path = window.location.pathname;
  const navMap = {
    '/': 'home',
    '/index.html': 'home',
    '/despre.html': 'despre',
    '/comunitate.html': 'comunitate',
    '/media.html': 'media',
    '/contact.html': 'contact',
    '/faq.html': 'faq',
    '/newsletter.html': 'newsletter',
  };
  let key = navMap[path];
  if (!key && path.startsWith('/cursuri')) key = 'cursuri';
  if (!key && path.startsWith('/blog')) key = 'blog';

  if (key) {
    const link = document.querySelector(`[data-nav="${key}"]`);
    if (link) link.setAttribute('aria-current', 'page');
  }

  // Mobile menu toggle
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Deschide meniul' : 'Închide meniul');
    });
  }
}

function initFooterBehavior() {
  const yearEl = document.querySelector('[data-current-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}
