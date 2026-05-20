/**
 * Galerie testimoniale: filtrare pe categorii + lightbox.
 * Citește datele din assets/data/testimoniale.json.
 */

(async function () {
  const grid = document.getElementById('testimoniale-grid');
  const filters = document.getElementById('testimoniale-filters');
  const counter = document.getElementById('testimoniale-count');
  if (!grid || !filters) return;

  let data;
  try {
    const res = await fetch('assets/data/testimoniale.json', { cache: 'no-cache' });
    data = await res.json();
  } catch (err) {
    grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding: 2rem; color: var(--text-muted);">Nu am putut încărca testimonialele.</p>';
    return;
  }

  // numără total + per categorie
  const totalCount = data.reduce((sum, cat) => sum + cat.items.length, 0);

  // Render filter buttons
  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = 'tag tag--terracotta';
  allBtn.dataset.filter = 'all';
  allBtn.setAttribute('aria-pressed', 'true');
  allBtn.textContent = `Toate (${totalCount})`;
  filters.appendChild(allBtn);

  data.forEach((cat) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag tag--outline';
    btn.dataset.filter = cat.slug;
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = `${cat.label} (${cat.items.length})`;
    filters.appendChild(btn);
  });

  // Render grid
  data.forEach((cat) => {
    cat.items.forEach((item) => {
      const fig = document.createElement('figure');
      fig.className = 'testimoniale-card';
      fig.dataset.category = cat.slug;
      fig.innerHTML = `
        <img src="assets/img/testimoniale/${item.file}" alt="Testimonial despre ${cat.label}" loading="lazy" />
        <figcaption class="testimoniale-card__cat">${cat.label}</figcaption>
      `;
      grid.appendChild(fig);
    });
  });

  if (counter) counter.textContent = totalCount;

  // Filter
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    const filter = btn.dataset.filter;

    filters.querySelectorAll('[data-filter]').forEach((b) => {
      b.classList.remove('tag--terracotta');
      b.classList.add('tag--outline');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.remove('tag--outline');
    btn.classList.add('tag--terracotta');
    btn.setAttribute('aria-pressed', 'true');

    let visible = 0;
    grid.querySelectorAll('.testimoniale-card').forEach((fig) => {
      const show = filter === 'all' || fig.dataset.category === filter;
      fig.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (counter) counter.textContent = visible;
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  if (lightbox && lightboxImg) {
    grid.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) lightboxCaption.textContent = img.alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    const close = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    lightbox.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
    });
  }
})();
