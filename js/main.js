/* Brew & Bloom — shared interactions */
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initMobileNav();
  initReveal();
  initMenuTabs();
  initFavorites();
  initGallery();
  initHoursIndicator();
  initReservationForm();
  initYear();
});

/* Lucide icons */
function initIcons() {
  if (window.lucide) window.lucide.createIcons();
}

/* Mobile navigation */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menu.style.maxHeight = isOpen ? menu.scrollHeight + 'px' : '0px';
    menu.style.opacity = isOpen ? '1' : '0';
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menu.style.maxHeight = '0px';
      menu.style.opacity = '0';
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Scroll reveal */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
}

/* Menu category tabs */
function initMenuTabs() {
  const tabs = document.querySelectorAll('[data-tab-target]');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const groupSel = tab.dataset.tabGroup || 'default';
      const group = document.querySelectorAll(`[data-tab-group="${groupSel}"]`);
      const target = tab.dataset.tabTarget;

      group.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll(`[data-panel-group="${groupSel}"]`).forEach(panel => {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });
    });
  });
}

/* Favorite / heart buttons, persisted in-memory for the session */
function initFavorites() {
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const active = btn.classList.toggle('active');
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  });
}

/* Gallery lightbox */
function initGallery() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  if (!items.length || !lightbox) return;

  const lbImg = lightbox.querySelector('img');
  const lbCaption = lightbox.querySelector('.lb-caption');
  const btnClose = lightbox.querySelector('.lb-close');
  const btnPrev = lightbox.querySelector('.lb-prev');
  const btnNext = lightbox.querySelector('.lb-next');
  let current = 0;

  function open(index) {
    current = index;
    const img = items[current].querySelector('img');
    lbImg.src = img.dataset.full || img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }
  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function nav(delta) {
    current = (current + delta + items.length) % items.length;
    open(current);
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => nav(-1));
  btnNext.addEventListener('click', () => nav(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  });
}

/* Opening hours + "Open Now" indicator based on local browser time */
function initHoursIndicator() {
  const nodes = document.querySelectorAll('[data-hours-indicator]');
  if (!nodes.length) return;

  const now = new Date();
  const day = now.getDay(); // 0 Sun - 6 Sat
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const isWeekend = day === 0 || day === 6;
  const openTime = 8 * 60; // 8:00 AM every day
  const closeTime = isWeekend ? 23 * 60 : 22 * 60; // 11PM weekends, 10PM weekdays
  const isOpen = minutesNow >= openTime && minutesNow < closeTime;

  nodes.forEach(node => {
    const dot = node.querySelector('.status-dot');
    const label = node.querySelector('[data-status-label]');
    if (dot) dot.classList.add(isOpen ? 'open' : 'closed');
    if (label) {
      if (isOpen) {
        const hoursLeft = Math.floor((closeTime - minutesNow) / 60);
        const minsLeft = (closeTime - minutesNow) % 60;
        label.textContent = `Open now · closes in ${hoursLeft}h ${minsLeft}m`;
      } else {
        const minsToOpen = minutesNow < openTime
          ? openTime - minutesNow
          : (24 * 60 - minutesNow) + openTime;
        const h = Math.floor(minsToOpen / 60);
        const m = minsToOpen % 60;
        label.textContent = minutesNow < openTime
          ? `Closed · opens in ${h}h ${m}m`
          : `Closed for the night · opens 8:00 AM`;
      }
    }
  });
}

/* Reservation form */
function initReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;
  const success = document.getElementById('reservation-success');

  const dateInput = form.querySelector('#res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const name = form.querySelector('#res-name').value.trim();
    form.reset();
    form.hidden = true;
    if (success) {
      success.hidden = false;
      const nameSpan = success.querySelector('[data-guest-name]');
      if (nameSpan) nameSpan.textContent = name || 'there';
      success.focus();
    }
  });
}

function initYear() {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}
