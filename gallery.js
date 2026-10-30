(() => {
  'use strict';
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const viewport = gallery.querySelector('.gallery-viewport');
    const slides = [...gallery.querySelectorAll('.gallery-slide')];
    const controls = gallery.querySelector('.gallery-controls');
    const previous = gallery.querySelector('[data-gallery-previous]');
    const next = gallery.querySelector('[data-gallery-next]');
    const caption = gallery.querySelector('[data-gallery-caption]');
    const count = gallery.querySelector('[data-gallery-count]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let scrollTimer;
    function update() {
      index = Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / viewport.clientWidth)));
      previous.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      caption.textContent = slides[index].dataset.caption;
      count.textContent = `${index + 1} / ${slides.length}`;
      slides.forEach((slide, position) => slide.setAttribute('aria-hidden', String(position !== index)));
    }
    function load(position) {
      const image = slides[position]?.querySelector('img[data-src]');
      if (!image) return;
      image.loading = 'eager';
      if (image.dataset.sizes) image.sizes = image.dataset.sizes;
      if (image.dataset.srcset) image.srcset = image.dataset.srcset;
      image.src = image.dataset.src;
      delete image.dataset.src;
      delete image.dataset.srcset;
      delete image.dataset.sizes;
    }
    function show(position) {
      const target = Math.max(0, Math.min(slides.length - 1, position));
      load(target);
      viewport.scrollTo({ left: target * viewport.clientWidth, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    }
    previous.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    viewport.addEventListener('keydown', event => {
      const position = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 }[event.key];
      if (position === undefined) return;
      event.preventDefault();
      show(position);
    });
    // Native overflow supplies touch swiping; update labels only after scrolling settles.
    viewport.addEventListener('pointerdown', () => {
      load(index - 1);
      load(index + 1);
    }, { passive: true });
    viewport.addEventListener('scroll', () => {
      const position = viewport.scrollLeft / viewport.clientWidth;
      load(Math.floor(position));
      load(Math.ceil(position));
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(update, 120);
    }, { passive: true });
    window.addEventListener('resize', () => {
      viewport.scrollTo({ left: index * viewport.clientWidth, behavior: 'instant' });
      update();
    });
    update();
    controls.hidden = false;
  });
})();
