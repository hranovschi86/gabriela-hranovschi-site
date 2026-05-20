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
    const closeNav = () => {
      nav.setAttribute('data-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Deschide meniul');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Deschide meniul' : 'Închide meniul');
      document.body.classList.toggle('nav-open', !open);
    });

    // Închide meniul când se face click pe un link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 920px)').matches) closeNav();
      });
    });

    // Esc închide meniul mobil
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') closeNav();
    });
  }

  // Dropdown "Cursuri": click pe mobil (touch), hover pe desktop
  const dropdownToggle = document.querySelector('.site-nav__dropdown-toggle');
  const dropdown = document.querySelector('.site-nav__dropdown');
  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', e => {
      if (window.matchMedia('(max-width: 920px)').matches) return;  // desktop = hover handles it
      e.preventDefault();
      const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
      dropdownToggle.setAttribute('aria-expanded', String(!expanded));
      dropdown.classList.toggle('is-open', !expanded);
    });

    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target)) {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('is-open');
      }
    });
  }
}

function initFooterBehavior() {
  const yearEl = document.querySelector('[data-current-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}
