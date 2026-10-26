(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  function closeMenu(restoreFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-label', menuButton.dataset.menuOpen);
    if (restoreFocus) menuButton.focus();
  }
  if (menuButton && mobileNav) {
    menuButton.hidden = false;
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.hidden = isOpen;
      menuButton.setAttribute('aria-label', isOpen ? menuButton.dataset.menuOpen : menuButton.dataset.menuClose);
    });
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
    });
    document.addEventListener('focusin', event => {
      if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
    });
    window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
      if (event.matches) closeMenu();
    });
  }
  // Keep the current section on a language change; never redirect or store preferences.
  const languageLinks = document.querySelectorAll('.language-switch a');
  function updateLanguageLinks() {
    languageLinks.forEach(link => { link.href = link.href.split('#')[0] + window.location.hash; });
  }
  updateLanguageLinks();
  window.addEventListener('hashchange', updateLanguageLinks);
  document.getElementById('year').textContent = new Date().getFullYear();
})();
