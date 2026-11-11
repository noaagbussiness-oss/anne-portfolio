/* Section navigation and cinematic motion, independent of CMS data handling. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rail = document.getElementById('nav-menu');
  const links = [...rail.querySelectorAll('.nav-link')];
  const scenes = [...document.querySelectorAll('main > section[id]')];
  const wash = document.querySelector('.scene-transition');
  let active = scenes[0];
  let navigating = false;
  let introFinished = false;

  // Keep the original navigation labels and CTA, relocating them to the rail/header.
  links.forEach(link => {
    link.dataset.label = link.textContent.trim();
    link.setAttribute('aria-label', link.dataset.label);
    link.title = link.dataset.label;
  });
  const cta = rail.querySelector('.nav-cta');
  if (cta) {
    cta.classList.add('header-cta');
    cta.setAttribute('aria-label', cta.textContent.trim());
    document.querySelector('.navbar').appendChild(cta);
  }
  const status = document.createElement('div');
  status.className = 'rail-status';
  status.setAttribute('aria-hidden', 'true');
  status.innerHTML = '<b>01</b><small>Home</small>';
  document.body.appendChild(status);
  if (typeof sectionObserver !== 'undefined') sectionObserver.disconnect();

  function ripple(link, falling = false) {
    if (!link || reduced.matches) return;
    if (falling) {
      const drop = document.createElement('i');
      drop.className = 'water-drop';
      link.appendChild(drop);
      setTimeout(() => drop.remove(), 900);
    }
    setTimeout(() => {
      const rings = document.createElement('span');
      rings.className = 'water-ripple';
      rings.innerHTML = '<i></i><i></i><i></i>';
      link.appendChild(rings);
      setTimeout(() => rings.remove(), 2400);
    }, falling ? 630 : 0);
  }

  function markScene(scene, animate = true) {
    if (!scene) return;
    const changed = active !== scene;
    active = scene;
    links.forEach(link => {
      const selected = link.hash === `#${scene.id}`;
      link.classList.toggle('active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const selected = links.find(link => link.hash === `#${scene.id}`);
    status.querySelector('b').textContent = String(scenes.indexOf(scene) + 1).padStart(2, '0');
    status.querySelector('small').textContent = selected?.dataset.label || scene.id;
    if (changed && animate && !reduced.matches) {
      scenes.forEach(item => item.classList.remove('scene-enter'));
      void scene.offsetWidth;
      scene.classList.add('scene-enter');
      ripple(selected);
    }
  }

  function goTo(scene, updateHash = true) {
    if (!scene || navigating || document.body.classList.contains('lightbox-open')) return;
    navigating = true;
    if (!reduced.matches) {
      wash.classList.remove('is-transitioning');
      void wash.offsetWidth;
      wash.classList.add('is-transitioning');
    }
    const jump = () => {
      scene.scrollIntoView({ behavior: 'instant', block: 'start' });
      markScene(scene);
      scene.querySelectorAll('.reveal').forEach(item => item.classList.add('visible'));
      if (updateHash) history.replaceState(null, '', `#${scene.id}`);
    };
    if (reduced.matches) jump();
    else setTimeout(jump, 150);
    setTimeout(() => { navigating = false; wash.classList.remove('is-transitioning'); }, reduced.matches ? 10 : 750);
  }
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const id = anchor.getAttribute('href').slice(1);
    const target = scenes.find(scene => scene.id === id);
    if (!target) return;
    event.preventDefault();
    goTo(target);
  });

  // A full scene jump at a section boundary; long sections remain fully scrollable.
  let wheelTotal = 0;
  let lastWheel = 0;
  window.addEventListener('wheel', event => {
    if (reduced.matches || window.innerWidth < 981 || event.ctrlKey || event.metaKey ||
        document.body.classList.contains('lightbox-open') || !introFinished ||
        event.target.closest('input,textarea,select,.lightbox,.filter-bar')) return;
    if (navigating) { event.preventDefault(); return; }
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
    if (Math.abs(delta) < Math.abs(event.deltaX) || Math.abs(delta) < 2) return;
    const now = performance.now();
    if (now - lastWheel > 180 || Math.sign(delta) !== Math.sign(wheelTotal)) wheelTotal = 0;
    lastWheel = now;
    wheelTotal += delta;
    const top = active.getBoundingClientRect().top;
    const bottom = active.getBoundingClientRect().bottom;
    const headerHeight = document.querySelector('.navbar').offsetHeight;
    const index = scenes.indexOf(active);
    const atBottom = bottom <= window.innerHeight + 55;
    const atTop = top >= headerHeight - 50;
    if (Math.abs(wheelTotal) > 55 && ((delta > 0 && atBottom && scenes[index + 1]) || (delta < 0 && atTop && scenes[index - 1]))) {
      event.preventDefault();
      goTo(scenes[index + (delta > 0 ? 1 : -1)]);
      wheelTotal = 0;
    }
  }, { passive: false });

  let scrollQueued = false;
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      scrollQueued = false;
      if (navigating) return;
      const reference = Math.min(window.innerHeight * .38, 300);
      const current = scenes.find(scene => {
        const bounds = scene.getBoundingClientRect();
        return bounds.top <= reference && bounds.bottom > reference;
      });
      if (current) markScene(current);
    });
  }, { passive: true });

  // Scene-specific artwork, leaving every existing text block and card in place.
  const artScenes = [
    ['about', 'images/anne-cutout.png', 'THE PERSON BEHIND THE PIXELS', 'A creative mind.'],
    ['expertise', 'images/anne-cutout.png', 'CREATIVITY MEETS TECHNOLOGY', 'Made to create.'],
    ['portfolio', null, 'SELECTED VISUAL STORIES', 'A world of ideas.'],
    ['impact', 'images/leopard-landscape.png', 'LEARNING · CREATING · GROWING', 'Every step matters.'],
    ['contact', 'images/leopard-landscape.png', 'LET’S CREATE SOMETHING', 'Into the extraordinary.']
  ];
  artScenes.forEach(([id, source, label, caption]) => {
    const section = document.getElementById(id);
    const shell = section?.querySelector('.shell');
    if (!shell) return;
    const art = document.createElement('div');
    art.className = `section-art art-${id} reveal`;
    art.setAttribute('aria-hidden', 'true');
    if (source) {
      const img = document.createElement('img');
      img.src = source;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      if (source.includes('anne-cutout')) img.onerror = () => { img.onerror = null; img.src = 'images/profile.jpg'; };
      art.appendChild(img);
    }
    const text = document.createElement('span');
    text.className = 'art-caption';
    const small = document.createElement('small');
    small.textContent = label;
    text.append(small, document.createTextNode(caption));
    art.appendChild(text);
    // Wide section artwork before content, or below the intro for split layouts.
    const heading = shell.querySelector('.section-head');
    if (heading) heading.after(art);
    else shell.querySelector('.experience-intro,.contact-intro')?.appendChild(art);
  });
  if (typeof observeReveal === 'function') observeReveal();
  document.querySelectorAll('.services-grid,.process-grid,.experience-list,.about-side').forEach(group => {
    [...group.children].forEach((card, index) => card.style.setProperty('--reveal-delay', `${Math.min(index * .09, .36)}s`));
  });
  if (!reduced.matches) {
    for (let index = 0; index < 9; index++) {
      const spark = document.createElement('i');
      spark.className = 'cinema-spark';
      spark.setAttribute('aria-hidden', 'true');
      spark.style.setProperty('--spark-x', `${28 + index * 8}%`);
      spark.style.setProperty('--spark-time', `${8 + index % 4}s`);
      spark.style.setProperty('--spark-delay', `${index * .8}s`);
      document.getElementById('home').appendChild(spark);
    }
    let pointerQueued = false;
    document.addEventListener('pointermove', event => {
      if (pointerQueued || event.pointerType !== 'mouse') return;
      pointerQueued = true;
      const shift = (event.clientX / innerWidth - .5) * 10;
      requestAnimationFrame(() => {
        active.querySelectorAll('.section-art').forEach(art => art.style.setProperty('--art-x', `${shift}px`));
        pointerQueued = false;
      });
    }, { passive: true });
  }

  // Count only explicit numeric facts, never dates, contact numbers or invented metrics.
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || !introFinished) return;
      const el = entry.target;
      countObserver.unobserve(el);
      const original = el.dataset.countOriginal;
      if (reduced.matches) { el.textContent = original; return; }
      const target = Number(original);
      const start = performance.now();
      const tick = now => {
        const fraction = Math.min((now - start) / 1500, 1);
        const value = Math.round(target * (1 - Math.pow(1 - fraction, 3)));
        el.textContent = original.startsWith('0') ? String(value).padStart(original.length, '0') : String(value);
        if (fraction < 1) requestAnimationFrame(tick);
        else el.textContent = original;
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: .5 });
  const counts = [...document.querySelectorAll('.hero-facts b')].filter(el => /^\d+$/.test(el.textContent.trim()));
  counts.forEach(el => { el.dataset.countOriginal = el.textContent.trim(); });

  const intro = document.getElementById('cinema-intro');
  function finishIntro() {
    if (introFinished) return;
    introFinished = true;
    document.getElementById('intro-progress').style.width = '100%';
    document.getElementById('intro-percentage').textContent = '100%';
    document.documentElement.classList.add('intro-ready');
    document.body.classList.remove('intro-playing');
    intro.inert = true;
    intro.setAttribute('aria-hidden', 'true');
    active.classList.add('scene-enter');
    counts.forEach(el => countObserver.observe(el));
    setTimeout(() => ripple(links.find(link => link.classList.contains('active')), true), reduced.matches ? 0 : 1000);
  }
  document.getElementById('intro-skip').addEventListener('click', finishIntro);
  if (reduced.matches) finishIntro();
  else {
    document.body.classList.add('intro-playing');
    const start = performance.now();
    const assets = ['images/anne-cutout.png', 'images/crimson-landscape.png', 'images/leopard-landscape.png'];
    let loaded = 0;
    let settled = false;
    Promise.allSettled(assets.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = () => { loaded += 1; resolve(); };
      img.src = src;
    }))).then(() => { settled = true; });
    function progress(now) {
      if (introFinished) return;
      const elapsed = now - start;
      const percent = Math.min(96, Math.round((elapsed / 2400) * 65 + (loaded / assets.length) * 30));
      document.getElementById('intro-progress').style.width = `${percent}%`;
      document.getElementById('intro-percentage').textContent = `${percent}%`;
      if ((settled && elapsed > 2300) || elapsed > 5000) finishIntro();
      else requestAnimationFrame(progress);
    }
    requestAnimationFrame(progress);
  }

  // Repeated image crossfades on each project; stop while a visitor interacts.
  const galleryTimers = new WeakMap();
  function enhanceCards() {
    document.querySelectorAll('.work-card:not([data-cinema-gallery])').forEach(card => {
      card.dataset.cinemaGallery = 'true';
      const cells = [...card.querySelectorAll('.work-media-cell')];
      if (cells.length < 2) return;
      const mosaic = card.querySelector('.work-media-mosaic');
      mosaic.classList.add('cinema-gallery');
      let current = 0;
      cells[0].classList.add('gallery-current');
      const advance = () => {
        cells[current].classList.remove('gallery-current');
        current = (current + 1) % cells.length;
        cells[current].classList.add('gallery-current');
      };
      const observer = new IntersectionObserver(entries => {
        const visible = entries.some(entry => entry.isIntersecting);
        clearInterval(galleryTimers.get(card));
        if (visible && !reduced.matches) galleryTimers.set(card, setInterval(advance, 4200));
      });
      observer.observe(card);
      const dots = document.createElement('span');
      dots.className = 'gallery-indicator';
      dots.textContent = `${cells.length} images`;
      dots.setAttribute('aria-hidden', 'true');
      card.appendChild(dots);
    });
  }
  const grid = document.getElementById('portfolio-grid');
  if (grid) new MutationObserver(enhanceCards).observe(grid, { childList: true });
  enhanceCards();
  markScene(scenes.find(scene => `#${scene.id}` === location.hash) || scenes[0], false);
  window.addEventListener('hashchange', () => {
    const scene = scenes.find(item => `#${item.id}` === location.hash);
    if (scene) goTo(scene, false);
  });
})();
