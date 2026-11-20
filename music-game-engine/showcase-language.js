// Bookmarks to engineering cases published on the original overview still work.
const companion = document.getElementById('engineering-challenges')?.dataset.casePage;
const moved = new Set(['casebook', 'gpu', 'drop2d-hold', 'runtime', 's21-present-attribution', 'android']);
if (companion) {
  const followCase = () => {
    if (moved.has(location.hash.slice(1))) location.replace(companion + location.hash);
  };
  addEventListener('hashchange', followCase);
  followCase();
}

const alternate = document.querySelector('.languages a:not([aria-current])');
alternate.addEventListener('click', () => {
  const readingLine = document.querySelector('.topbar').offsetHeight + 32;
  const sections = document.querySelectorAll('main section[id], main article[id], #materials, #gpu-summary, #scan-art, #quality-tiers, .challenges li[id]');
  const reached = [...sections].map(node => ({ node, bounds: node.getBoundingClientRect() }))
    .filter(({bounds}) => bounds.top <= readingLine && bounds.bottom > readingLine)
    .sort((a, b) => b.bounds.top - a.bounds.top);
  const last = sections[sections.length - 1];
  const atEnd = Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight;
  const linked = reached.find(({node}) => '#' + node.id === location.hash);
  const current = (linked && linked.bounds.top === reached[0]?.bounds.top) ? linked.node
    : (atEnd ? last : reached[0]?.node);
  const destination = new URL(alternate.getAttribute('href'), location.href);
  destination.hash = current?.id === 'overview' ? '' : (current?.id || location.hash);
  alternate.href = destination.href;
});
