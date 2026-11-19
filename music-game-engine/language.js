(() => {
  const alternate = document.querySelector('.languages a:not([aria-current])');
  if (!alternate) return;
  const target = new URL(alternate.getAttribute('href'), location.href);
  const sections = [...document.querySelectorAll('section[id], #november-review article[id], .reading-page h2[id], .reading-page article[id]')];
  const incoming = new URL(location.href).searchParams.get('reading');
  if (incoming) {
    try {
      const state = JSON.parse(incoming);
      window.MGE_READING_STATE = state && typeof state === 'object' ? state : {};
    } catch {
      window.MGE_READING_STATE = {};
    }
    const clean = new URL(location.href);
    clean.searchParams.delete('reading');
    try { history.replaceState(history.state, '', clean); } catch { /* The browser may restrict file URLs. */ }
  }
  const state = window.MGE_READING_STATE ??= {};
  let lastCase = null;
  document.addEventListener('click', event => {
    const details = event.target.closest('details[id]');
    if (details) lastCase = details;
  });

  function syncHash() {
    target.hash = location.hash;
    alternate.href = target.href;
  }
  syncHash();
  window.addEventListener('hashchange', syncHash);

  document.addEventListener('DOMContentLoaded', () => {
    if (Array.isArray(state.open)) {
      for (const id of state.open) {
        const details = document.getElementById(id);
        if (details?.tagName === 'DETAILS') details.open = true;
      }
    }
    for (const [id, index] of Object.entries(state.evidence || {})) {
      const details = document.getElementById(id)?.querySelectorAll('details.evidence');
      if (!details || !Array.isArray(index)) continue;
      for (const i of index) if (details[i]) details[i].open = true;
    }
    if (typeof state.mode === 'string') {
      const button = document.querySelectorAll('.mode-trigger');
      [...button].find(item => item.getAttribute('aria-controls') === state.mode)?.click();
    }
    const anchor = document.getElementById(location.hash.slice(1));
    if (anchor && incoming) requestAnimationFrame(() => anchor.scrollIntoView());
  });

  alternate.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const cutoff = headerHeight + 100;
    const inView = [...sections, ...document.querySelectorAll('details[id]:not([hidden]), .case-group:not([hidden])')]
      .filter(element => element.getBoundingClientRect().top <= cutoff && element.getBoundingClientRect().bottom > cutoff)
      .sort((first, second) => first.contains(second) ? 1 : second.contains(first) ? -1 : 0)[0];
    const linked = document.getElementById(location.hash.slice(1));
    const engaged = [lastCase, linked].find(details => details?.matches('details[open]:not([hidden])'));
    const isOnScreen = engaged && engaged.getBoundingClientRect().bottom > cutoff
      && engaged.getBoundingClientRect().top < window.innerHeight;
    // Opening the switch with the keyboard can move the viewport to the sticky header.
    // The verification ledger is one disclosure containing many independent
    // findings. Keep the one the reader can see when changing languages.
    const linkedRow = linked?.matches('#closure-ledger[open] li[id]') ? linked : null;
    const linkedBounds = linkedRow?.getBoundingClientRect();
    const followedRow = linkedBounds && linkedBounds.bottom > headerHeight &&
      linkedBounds.top < headerHeight + innerHeight / 3 ? linkedRow : null;
    const readingRow = [...document.querySelectorAll('#closure-ledger[open] li[id]')].find(row => {
      const bounds = row.getBoundingClientRect();
      return bounds.top <= cutoff && bounds.bottom > headerHeight + 12;
    });
    const position = followedRow || readingRow || (engaged && (event.detail === 0 || isOnScreen) ? engaged : inView);
    const destination = new URL(target);
    if (position) destination.hash = position.id;
    const caseState = window.MGE_CASEBOOK_STATE?.();
    if (caseState) {
      const open = [...document.querySelectorAll('details[id][open]')].map(item => item.id);
      const evidence = {};
      for (const section of sections) {
        const opened = [...section.querySelectorAll('details.evidence')].flatMap((item, i) => item.open ? [i] : []);
        if (opened.length) evidence[section.id] = opened;
      }
      const mode = document.querySelector('.mode-trigger[aria-expanded="true"]')?.getAttribute('aria-controls');
      destination.searchParams.set('reading', JSON.stringify({...caseState, open, evidence, mode}));
    }
    alternate.href = destination.href;
  });
})();
