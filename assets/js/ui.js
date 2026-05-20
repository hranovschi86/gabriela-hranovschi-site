/**
 * UI behaviors: acordeon FAQ, formulare, dropdown a11y.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAccordions();
  initDropdownKeyboard();
});

function initAccordions() {
  document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
    });
  });
}

function initDropdownKeyboard() {
  // Esc închide dropdown-urile
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.site-nav__dropdown-toggle[aria-expanded="true"]').forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
        btn.blur();
      });
    }
  });
}
