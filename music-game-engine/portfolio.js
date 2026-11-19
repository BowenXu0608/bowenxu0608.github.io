(() => {
  const dialog = document.querySelector('#viewer');
  const media = document.querySelector('#viewer-media');
  const caption = document.querySelector('#viewer-caption');
  const original = document.querySelector('#viewer-file');
  let trigger = null;

  const labels = window.MGE_LABELS || {};
  function displayText(value) {
    return Object.hasOwn(labels, value) ? labels[value] : value;
  }

  function textElement(tag, text, className = '') {
    const el = document.createElement(tag);
    el.textContent = displayText(text);
    if (className) el.className = className;
    return el;
  }

  function addSection(parent, title, contents) {
    parent.append(textElement('h4', title), textElement('p', contents));
  }

  function addTierTable(parent, tiers) {
    const table = document.createElement('table');
    table.append(textElement('caption', 'Spatial rendering profiles'));
    const heading = table.createTHead().insertRow();
    for (const label of ['Capability', 'Desktop', 'S21 Standard', 'S21 High']) {
      const th = textElement('th', label);
      th.scope = 'col';
      heading.append(th);
    }
    const body = table.createTBody();
    for (const item of tiers) {
      const row = body.insertRow();
      const feature = textElement('th', item.feature);
      feature.scope = 'row';
      row.append(feature, ...['desktop','standard','high'].map(field => textElement('td', item[field])));
    }
    const scroll = document.createElement('div');
    scroll.className = 'table-scroll';
    scroll.append(table);
    parent.append(scroll);
  }

  function archiveFrame(file, label) {
    const figure = document.createElement('figure');
    const link = document.createElement('a');
    link.href = 'assets/' + file + '.webp';
    link.className = 'image-link';
    link.dataset.image = '';
    link.dataset.caption = displayText(label);
    const image = new Image();
    image.loading = 'lazy';
    image.src = link.href;
    image.alt = displayText(label);
    link.append(image);
    figure.append(link, textElement('figcaption', label));
    return figure;
  }

  const archivedFigures = {
    rendering: [
      ['shadow-after', 'Directional shadow · desktop'],
      ['glass-after', 'Glass · refracted opaque scene'],
      ['emission-after', 'Emissive proxies · Circle']
    ],
    editor: [
      ['markers', 'Detect beat markers'],
      ['author', 'Auto-place notes'],
      ['manual', 'Adjust time and lane'],
      ['build', 'Export the APK']
    ]
  };
  const index = document.querySelector('#system-index');
  const caseLinks = {
    rendering: ['materials', 'Material compatibility'],
    modes: ['runtime', 'Timing regression'],
    android: ['android', 'Lifecycle investigation']
  };
  for (const system of window.MGE_SYSTEMS) {
    const row = document.createElement('details');
    row.id = 'system-' + system.id;
    row.className = 'system';
    const heading = document.createElement('summary');
    heading.append(textElement('strong', system.title), textElement('span', system.summary, 'index-description'));
    const contents = document.createElement('div');
    contents.className = 'system-body';
    contents.append(textElement('p', system.capability));
    if (system.tiers) addTierTable(contents, system.tiers);
    if (archivedFigures[system.id]) {
      const gallery = document.createElement('div');
      gallery.className = 'archive-gallery';
      gallery.append(...archivedFigures[system.id].map(([file,label]) => archiveFrame(file,label)));
      contents.append(gallery);
    }
    addSection(contents, 'Verification', system.validation);
    if (system.id === 'android') {
      contents.append(document.querySelector('#pacing-evidence').content.cloneNode(true));
    }
    addSection(contents, 'Scope', system.limit);
    if (system.id === 'rendering') {
      const reference = textElement('a', 'Burley, Physically-Based Shading at Disney (2012) ↗', 'source');
      reference.href = 'https://disneyanimation.com/publications/physically-based-shading-at-disney/';
      contents.append(reference);
    }
    if (caseLinks[system.id]) {
      const [id, label] = caseLinks[system.id];
      const link = textElement('a', label + ' ↓', 'case-link');
      link.href = '#' + id;
      contents.append(link);
    }
    row.append(heading, contents);
    index.append(row);
  }
  for (const mode of window.MGE_MODES) {
    const entry = document.querySelector('[data-mode="' + mode.id + '"]');
    const toggle = entry.querySelector('.mode-trigger');
    const contents = document.createElement('div');
    contents.id = toggle.getAttribute('aria-controls');
    contents.className = 'mode-copy';
    contents.hidden = true;
    for (const [label,body] of [
      ['Authoring', mode.authoring], ['Input', mode.input], ['Rendering', mode.rendering]
    ]) {
      const column = document.createElement('div');
      addSection(column, label, body);
      contents.append(column);
    }
    const full = document.createElement('a');
    full.className = 'detail-link';
    full.href = mode.id === 'drop2d' ? 'assets/material-scene.webp' : entry.querySelector('img').src;
    full.dataset.image = '';
    full.dataset.caption = mode.title + displayText(' · desktop capture');
    full.textContent = displayText('Full image ↗');
    contents.append(full);
    document.querySelector('#mode-panels').append(contents);
    toggle.addEventListener('click', () => {
      const shouldOpen = contents.hidden;
      for (const other of document.querySelectorAll('.mode-trigger')) {
        const expanded = other === toggle && shouldOpen;
        other.setAttribute('aria-expanded',String(expanded));
        document.getElementById(other.getAttribute('aria-controls')).hidden = !expanded;
      }
    });
  }

  function openMedia(link) {
    trigger = link;
    original.href = link.href;
    caption.textContent = link.dataset.caption;
    let item;
    if (link.hasAttribute('data-movie')) {
      item = document.createElement('video');
      item.controls = true;
      item.playsInline = true;
      item.preload = 'metadata';
    } else {
      item = new Image();
      item.alt = caption.textContent;
    }
    item.src = link.href;
    media.replaceChildren(item);
    dialog.showModal();
    document.body.classList.add('viewing');
    document.querySelector('#viewer-close').focus();
    if (item.tagName === 'VIDEO') item.play().catch(() => {});
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-image],a[data-movie]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    openMedia(link);
  });
  document.querySelector('#viewer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    const video = media.querySelector('video');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    media.replaceChildren();
    document.body.classList.remove('viewing');
    if (trigger) trigger.focus({preventScroll:true});
    trigger = null;
  });

  for (const range of document.querySelectorAll('.wipe input')) {
    range.addEventListener('input', () => range.parentElement.style.setProperty('--split',range.value+'%'));
  }

  const navLinks = [...document.querySelectorAll('header nav a[href^="#"]')];
  const chapters = navLinks.map(link => document.getElementById(link.hash.slice(1)));
  let updatePending = false;
  function updateChapter() {
    updatePending = false;
    const threshold = document.querySelector('header').offsetHeight + 30;
    const current = chapters.filter(section => section.getBoundingClientRect().top <= threshold).pop() || chapters[0];
    for (const link of navLinks) {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    }
  }
  document.addEventListener('scroll', () => {
    if (!updatePending) {
      updatePending = true;
      requestAnimationFrame(updateChapter);
    }
  }, {passive:true});
  updateChapter();

  function revealTarget() {
    const target = document.getElementById(location.hash.slice(1));
    const details = target?.closest('details');
    if (details && !details.open) {
      details.open = true;
      if (target !== details) target.scrollIntoView();
    }
  }
  window.addEventListener('hashchange',revealTarget);
  revealTarget();
})();
