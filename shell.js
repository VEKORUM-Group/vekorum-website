(() => {
  const rootUrl = new URL('.', document.currentScript.src).href;
  if (!document.querySelector('link[href$="regions.css"]')) {
    const regionalStyles = document.createElement('link');
    regionalStyles.rel = 'stylesheet';
    regionalStyles.href = `${rootUrl}regions.css`;
    document.head.appendChild(regionalStyles);
  }
  const primaryNav = `<a href="${rootUrl}index.html#about">Who We Are</a><a href="${rootUrl}index.html#services">Services</a><a href="${rootUrl}global-services/index.html">Global</a><a href="${rootUrl}work/index.html">Work</a><a href="${rootUrl}industries/index.html">Industries</a><a href="${rootUrl}insights/index.html">Insights</a><a href="${rootUrl}index.html#method">Method</a><a class="nav-cta" href="${rootUrl}index.html#contact">Start a conversation <span>&#8599;</span></a>`;

  if (!document.querySelector('.skip-link')) {
    document.body.insertAdjacentHTML('afterbegin', '<a class="skip-link" href="#main">Skip to content</a>');
  }
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';

  let header = document.querySelector('.site-header');
  if (!header) {
    document.body.insertAdjacentHTML('afterbegin', `<header class="site-header"><a class="brand-lockup" href="${rootUrl}index.html" aria-label="VEKORUM home"><span class="brand-logo"><img src="${rootUrl}assets/vekorum-logo-transparent.png" alt="VEKORUM" width="1774" height="887" decoding="async"></span></a><nav class="site-nav" aria-label="Primary navigation">${primaryNav}</nav></header>`);
    header = document.querySelector('.site-header');
  }

  if (header) {
    header.setAttribute('data-header', '');
    if (!header.querySelector('.menu-toggle')) {
      const button = document.createElement('button');
      button.className = 'menu-toggle';
      button.type = 'button';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', 'site-nav');
      button.innerHTML = '<span>Menu</span><i></i><i></i>';
      header.insertBefore(button, header.querySelector('.site-nav'));
    }
    const nav = header.querySelector('.site-nav');
    if (nav) {
      nav.id = 'site-nav';
      nav.setAttribute('aria-label', 'Primary navigation');
      nav.innerHTML = primaryNav;
      const currentPath = window.location.pathname.replace(/index\.html$/, '');
      nav.querySelectorAll('a').forEach((link) => {
        const linkPath = new URL(link.href).pathname.replace(/index\.html$/, '');
        if (linkPath !== '/' && currentPath.startsWith(linkPath)) link.setAttribute('aria-current', 'page');
      });
    }
  }

  document.querySelectorAll('.brand-logo img').forEach((image) => {
    image.width = 1774;
    image.height = 887;
    image.decoding = 'async';
    if (image.closest('.site-footer')) image.loading = 'lazy';
  });

  if (!document.querySelector('.site-footer')) {
    document.body.insertAdjacentHTML('beforeend', `
      <footer class="site-footer">
        <div class="footer-brand"><a class="brand-lockup footer-lockup" href="${rootUrl}index.html" aria-label="VEKORUM home"><span class="brand-logo"><img src="${rootUrl}assets/vekorum-logo-transparent.png" alt="VEKORUM" width="1774" height="887" loading="lazy" decoding="async"></span></a><p>Delivering What Matters Most.</p></div>
        <div class="footer-nav"><div><span>Explore</span><a href="${rootUrl}index.html#about">Who We Are</a><a href="${rootUrl}index.html#services">Services</a><a href="${rootUrl}global-services/index.html">Global Services</a><a href="${rootUrl}work/index.html">Work</a><a href="${rootUrl}industries/index.html">Industries</a><a href="${rootUrl}insights/index.html">Insights</a><a href="${rootUrl}leadership/index.html">Leadership</a></div><div><span>Connect</span><a href="mailto:info@vekorum.com">info@vekorum.com</a><a href="${rootUrl}index.html#contact">Enquiries</a></div><div><span>Legal</span><a href="${rootUrl}legal/privacy.html">Privacy</a><a href="${rootUrl}legal/terms.html">Terms</a><a href="${rootUrl}legal/cookies.html">Cookies</a><a href="${rootUrl}legal/accessibility.html">Accessibility</a></div></div>
        <p class="footer-disclaimer">Professional services are provided in accordance with the regulatory and professional requirements applicable in the jurisdiction where the engagement is performed. Engineering consulting services are offered in Nigeria only, subject to applicable laws and professional registration requirements.</p>
        <div class="footer-bottom"><span>&copy; <span data-year></span> VEKORUM</span><span>VEKORUM is a trade name of VEKORUM Group Inc.</span><a href="#top">Back to top &#8593;</a></div>
      </footer>`);
  }

  if (window.VEKORUM_CONFIG?.analyticsId && !document.querySelector('[data-cookie-banner]')) {
    document.body.insertAdjacentHTML('beforeend', `<aside class="cookie-banner" data-cookie-banner aria-label="Cookie preferences" hidden><p>Optional analytics help us improve this site. <a href="${rootUrl}legal/cookies.html">Cookie policy</a></p><div><button type="button" data-consent="reject">Essential only</button><button type="button" data-consent="accept" class="cookie-accept">Accept analytics</button></div></aside>`);
  }
})();
