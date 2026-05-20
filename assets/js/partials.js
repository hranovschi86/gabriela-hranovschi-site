/**
 * Injectează header și footer din partials/.
 * Funcționează atât local (localhost) cât și pe GitHub Pages (subpath /repo/).
 * Folosește <base href> deja setat în <head> de scriptul inline din fiecare pagină.
 */

// Calculează BASE-ul curent (cu trailing slash)
const SITE_BASE = (function () {
  const host = window.location.hostname;
  if (host.endsWith('github.io')) {
    const seg = window.location.pathname.split('/').filter(Boolean)[0];
    return seg ? '/' + seg + '/' : '/';
  }
  return '/';
})();

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

  // fetch se rezolvă față de <base href>, deci căile fără slash inițial merg pe ambele medii
  await Promise.all([
    inject('[data-include="header"]', 'partials/header.html'),
    inject('[data-include="footer"]', 'partials/footer.html'),
  ]);

  initHeaderBehavior();
  initFooterBehavior();
})();

function initHeaderBehavior() {
  // Strip BASE din path pentru lookup (pe GH Pages path = /gabriela-hranovschi-site/despre.html)
  let path = window.location.pathname;
  if (path.startsWith(SITE_BASE)) path = '/' + path.slice(SITE_BASE.length);

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
