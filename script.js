const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 40);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const mobileNavigation = window.matchMedia('(max-width: 800px)');
const isMenuOpen = () => menuButton?.getAttribute('aria-expanded') === 'true';
const setMenuOpen = (open, returnFocus = false) => {
  if (!menuButton || !nav || !header) return;
  menuButton.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
  document.body.style.overflow = open && mobileNavigation.matches ? 'hidden' : '';

  if (open) {
    const firstLink = nav.querySelector('a');
    window.requestAnimationFrame(() => firstLink?.focus());
  } else if (returnFocus) {
    menuButton.focus();
  }
};

menuButton?.addEventListener('click', () => setMenuOpen(!isMenuOpen(), isMenuOpen()));

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  setMenuOpen(false);
}));

document.addEventListener('keydown', (event) => {
  if (!isMenuOpen() || !mobileNavigation.matches) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    setMenuOpen(false, true);
    return;
  }

  if (event.key !== 'Tab' || !header) return;
  const focusable = [...header.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hasAttribute('hidden'));
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

mobileNavigation.addEventListener('change', (event) => {
  if (!event.matches && isMenuOpen()) setMenuOpen(false);
});

document.querySelectorAll('.service button').forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    const panel = button.nextElementSibling;
    panel.classList.toggle('open', !expanded);
    panel.setAttribute('aria-hidden', String(expanded));
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

const form = document.querySelector('.contact-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  if (!form.checkValidity()) {
    status.textContent = 'Please complete the required fields.';
    form.reportValidity();
    return;
  }
  status.textContent = 'Sending your enquiry…';
  const data = new FormData(form);
  fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() })
    .then((response) => {
      if (!response.ok) throw new Error('Submission failed');
      window.location.assign('/thank-you.html');
    })
    .catch(() => { status.textContent = 'We could not send your enquiry. Please email info@vekorum.com.'; });
});

document.querySelectorAll('[data-year]').forEach((element) => { element.textContent = new Date().getFullYear(); });

const cookieBanner = document.querySelector('[data-cookie-banner]');
const consent = localStorage.getItem('vekorum-consent');
const enableAnalytics = () => {
  const id = window.VEKORUM_CONFIG?.analyticsId;
  if (!id) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });
};
if (consent === 'analytics') enableAnalytics();
if (!consent && cookieBanner) cookieBanner.hidden = false;
document.querySelectorAll('[data-consent]').forEach((button) => button.addEventListener('click', () => {
  const accepted = button.dataset.consent === 'accept';
  localStorage.setItem('vekorum-consent', accepted ? 'analytics' : 'essential');
  if (cookieBanner) cookieBanner.hidden = true;
  if (accepted) enableAnalytics();
}));

window.addEventListener('error', (event) => {
  if (window.VEKORUM_CONFIG?.errorEndpoint) {
    navigator.sendBeacon(window.VEKORUM_CONFIG.errorEndpoint, JSON.stringify({ message: event.message, source: event.filename, line: event.lineno }));
  }
});
