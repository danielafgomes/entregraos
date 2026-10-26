(() => {
  'use strict';
  const translations = {
    brunchPhotoLabel: 'Brunch photograph', brunchPhotoAlt: 'Placeholder for a brunch photograph',
    quickVisit: 'Location and opening hours',
    skip: 'Skip to content', home: 'Entre Grãos — home', mainNav: 'Main navigation', mobileNav: 'Mobile navigation', openMenu: 'Open menu', closeMenu: 'Close menu', navTable: 'At the table', navSpace: 'Our space', navVisit: 'Visit us', directions: 'Get directions',
    heroEyebrow: "Entre Grãos · Rua da Cale, Fundão", heroTitle1: "Coffee, lunch", heroTitle2: "& brunch in Fundão.", heroDescription: "Illy coffee, homemade cakes and cinnamon rolls. For lunch, soup, sandwiches with a vegan option and seasonal choices.", discover: 'Discover what we serve', lunchWeek: 'Lunch from Monday to Friday', sandwichAlt: 'A sandwich served at Entre Grãos', heroPhotoCaption: "Our sandwiches, served at the table.", moments: "What we serve at Entre Grãos", stripCoffee: "Coffee and homemade cakes", stripLunch: 'Lunch during the week', stripBrunch: 'Saturday brunch',
    tableEyebrow: 'At the table', tableTitle: "From your first coffee to lunch.", tableIntro: "Soup, sandwiches and seasonal lunch choices. Coffee, drinks and homemade cakes throughout the day.", soupAlt: 'Soup in a green bowl at Entre Grãos', soupCaption: "Soup for lunch.", lunchPill: 'Monday to Friday · 12:00–15:00', lunchTitle1: 'Your lunch,', lunchTitle2: 'just around the corner.', lunchDescription: "We serve lunch from Monday to Friday, 12:00–15:00. Choose from soup, sandwiches with changing fillings and seasonal lunch options.", soupTitle: 'Soup & seasonal choices', soupBody: 'Ask us what’s on for lunch today.', sandwichTitle: "Sandwiches with a vegan option", sandwichBody: 'Changing fillings, including a vegan option.', lunchCta: 'Join us for lunch',
    coffeeEyebrow: "Coffee and homemade baking", coffeeTitle: "Coffee and homemade cakes", coffeeDescription: "Alongside Illy coffee, we serve lattes, matcha and chai. Pair your drink with homemade cakes or cinnamon rolls.", coffeeLabel: "Homemade cakes · Cinnamon rolls", coffeeAlt: 'An Illy coffee being served at a table', brunchEyebrow: 'Saturday · 10:00–14:00', brunchTitle: "Saturday brunch", brunchDescription: "We serve brunch on Saturdays from 10:00 to 14:00. Find us on Rua da Cale and discover what’s on offer.", brunchCta: "Hours and location",
    spaceEyebrow: "Our space", spaceTitle1: "On Rua da Cale,", spaceTitle2: "in central Fundão.", spaceDescription: "Entre Grãos is at number 75, Rua da Cale. Inside, green chairs and warm colours surround the tables and café counter.", spaceDescription2: "We have tables inside and on the terrace. Choose where you would like to have your coffee or lunch.", findUs: 'Find us here', interiorAlt: 'The welcoming interior of Entre Grãos, with green chairs and warm-coloured walls',
    journalEyebrow: "Photos and news", journalTitle: "Follow Entre Grãos", terraceAlt: 'A terrace table beside the Entre Grãos window', drinksAlt: 'Two drinks served at Entre Grãos', counterAlt: 'The green and cream counter at Entre Grãos café', gallery1: "Our terrace", gallery2: "Drinks at Entre Grãos", gallery3: "The café counter", journalNote: "A selection of photos from our café. Follow us on Instagram for the latest news.",
    visitEyebrow: "Hours and contact details", visitTitle1: "Visit us", visitTitle2: "in Fundão.", hoursTitle: "Opening hours", weekdays: 'Monday to Friday', saturday: 'Saturday', sunday: 'Sunday', closed: 'Closed', lunchHours: 'Lunch · Mon–Fri, 12:00–15:00', brunchHours: 'Brunch · Saturday, 10:00–14:00', contactTitle: 'Get in touch', footerNote: "Coffee, lunch and brunch · Rua da Cale, Fundão"
  };
  const textNodes = [...document.querySelectorAll('[data-i18n]')];
  const altNodes = [...document.querySelectorAll('[data-i18n-alt]')];
  const ariaNodes = [...document.querySelectorAll('[data-i18n-aria]')];
  const portuguese = new Map();
  textNodes.forEach(el => portuguese.set(el, el.innerHTML));
  altNodes.forEach(el => portuguese.set(el, el.getAttribute('alt')));
  ariaNodes.forEach(el => portuguese.set(el, el.getAttribute('aria-label')));
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  let language = 'pt';

  function closeMenu(restoreFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-label', language === 'en' ? translations.openMenu : 'Abrir menu');
    if (restoreFocus) menuButton.focus();
  }
  function setLanguage(next) {
    language = next === 'en' ? 'en' : 'pt';
    document.documentElement.lang = language === 'en' ? 'en' : 'pt-PT';
    textNodes.forEach(el => {
      if (language === 'en') el.textContent = translations[el.dataset.i18n] || portuguese.get(el);
      else el.innerHTML = portuguese.get(el);
    });
    altNodes.forEach(el => el.setAttribute('alt', language === 'en' ? translations[el.dataset.i18nAlt] : portuguese.get(el)));
    ariaNodes.forEach(el => el.setAttribute('aria-label', language === 'en' ? translations[el.dataset.i18nAria] : portuguese.get(el)));
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    document.title = language === 'en' ? 'Entre Grãos — Coffee, lunch & brunch in Fundão' : 'Entre Grãos — Café, almoços e brunch no Fundão';
    const description = language === 'en' ? "Coffee, homemade cakes, sandwiches and weekday lunch. Saturday brunch at Entre Grãos, 75 Rua da Cale, Fundão." : "Café, bolos caseiros, sandes e almoços de segunda a sexta. Brunch ao sábado no Entre Grãos, na Rua da Cale 75, no Fundão.";
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = description;
    document.querySelector('meta[property="og:locale"]').content = language === 'en' ? 'en_GB' : 'pt_PT';
    document.querySelector('meta[property="og:locale:alternate"]').content = language === 'en' ? 'pt_PT' : 'en_GB';
    if (menuButton.getAttribute('aria-expanded') === 'true') menuButton.setAttribute('aria-label', language === 'en' ? translations.closeMenu : 'Fechar menu');
    try { localStorage.setItem('entregraos-language', language); } catch (_) { /* Navigation still works when browser storage is unavailable. */ }
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.hidden = isOpen;
    menuButton.setAttribute('aria-label', isOpen ? (language === 'en' ? translations.openMenu : 'Abrir menu') : (language === 'en' ? translations.closeMenu : 'Fechar menu'));
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true); });
  document.addEventListener('click', event => { if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu(); });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  document.getElementById('year').textContent = new Date().getFullYear();
  try { if (localStorage.getItem('entregraos-language') === 'en') setLanguage('en'); } catch (_) { /* Portuguese remains the default. */ }
})();
