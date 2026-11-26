(() => {
  const gallery = document.getElementById('interface-gallery');
  if (!gallery) return;
  const track = gallery.querySelector('#gallery-track');
  const slides = [...track.querySelectorAll('.gallery-slide')];
  const controls = gallery.querySelector('.gallery-controls');
  const counter = gallery.querySelector('.gallery-count');
  const status = gallery.querySelector('.gallery-status');
  const alternate = document.querySelector('.languages a:not([aria-current])');
  let current = 0;

  function show(index, announce = true) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    const template = slide.querySelector('template');
    if (template) template.replaceWith(template.content);
    for (const item of slides) item.hidden = item !== slide;
    counter.textContent = (current + 1) + ' / ' + slides.length;
    if (announce) status.textContent = counter.textContent + ' · ' + slide.querySelector('strong').textContent;
    const nextLanguage = new URL(alternate.href);
    if (current) nextLanguage.searchParams.set('screen', slide.dataset.screen);
    else nextLanguage.searchParams.delete('screen');
    alternate.href = nextLanguage.href;
  }

  for (const button of controls.querySelectorAll('button')) {
    button.addEventListener('click', () => show(current + Number(button.dataset.step)));
  }
  gallery.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const imageFocused = document.activeElement.closest('.gallery-image');
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
    if (imageFocused) slides[current].querySelector('a').focus({preventScroll: true});
  });

  let start, swiped = false;
  track.addEventListener('dragstart', event => event.preventDefault());
  track.addEventListener('pointerdown', event => {
    const link = event.target.closest('.gallery-image');
    if (!event.isPrimary) { start = null; return; }
    if (!link || event.button !== 0) return;
    swiped = false;
    start = {id: event.pointerId, x: event.clientX, y: event.clientY};
    link.setPointerCapture(event.pointerId);
  });
  track.addEventListener('pointercancel', () => { start = null; });
  track.addEventListener('pointerup', event => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < 1.4 * Math.abs(dy)) return;
    swiped = true;
    show(current + (dx < 0 ? 1 : -1));
  });
  track.addEventListener('click', event => {
    if (swiped && event.detail > 0) event.preventDefault();
    swiped = false;
  }, true);

  let wheelEnd = 0, wheelDistance = 0, wheelMoved = false;
  track.addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.4) return;
    event.preventDefault();
    if (event.timeStamp > wheelEnd) { wheelDistance = 0; wheelMoved = false; }
    wheelEnd = event.timeStamp + 180;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1;
    wheelDistance += event.deltaX * unit;
    if (!wheelMoved && Math.abs(wheelDistance) >= 40) {
      wheelMoved = true;
      show(current + Math.sign(wheelDistance));
    }
  }, {passive: false});

  const requested = new URL(location.href).searchParams.get('screen');
  show(Math.max(0, slides.findIndex(slide => slide.dataset.screen === requested)), false);
  controls.hidden = false;
})();
