// Bookmarks to engineering cases published on the original overview still work.
const companion = document.querySelector('.challenges-link');
const moved = new Set(['casebook', 'gpu', 'drop2d-hold', 'runtime', 's21-present-attribution', 'android']);
if (companion) {
  const followCase = () => {
    if (moved.has(location.hash.slice(1))) location.replace(companion.getAttribute('href') + location.hash);
  };
  addEventListener('hashchange', followCase);
  followCase();
}

const alternate = document.querySelector('.languages a:not([aria-current])');
alternate.addEventListener('click', () => {
  const readingLine = document.querySelector('.topbar').offsetHeight + 32;
  const sections = document.querySelectorAll('main section[id], .system[id], #materials, #gpu-summary, .challenges li[id]');
  const reached = [...sections].filter(node => node.getBoundingClientRect().top <= readingLine);
  const last = sections[sections.length - 1];
  const atEnd = Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight;
  const current = atEnd ? last : reached.pop();
  const destination = new URL(alternate.getAttribute('href'), location.href);
  destination.hash = current?.id === 'overview' ? '' : (current?.id || location.hash);
  alternate.href = destination.href;
});
