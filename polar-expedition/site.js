(() => {
  "use strict";
  const zh = document.documentElement.lang.startsWith("zh");
  const query = (selector, root = document) => root.querySelector(selector);
  const list = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const film = query("#film-dialog");
  const reel = film?.querySelector("video");
  const connection = typeof navigator === "undefined" ? null : navigator.connection;
  const saveData = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "");
  const warmedImages = new Set();
  const pendingImages = new Set();
  function warmImage(img, expandedSizes) {
    if (saveData || typeof Image === "undefined" || film?.open) return;
    const source = img?.src;
    if (!source) return;
    const sizes = expandedSizes || img.sizes || "100vw";
    const key = [img.srcset, sizes, source].join("|");
    if (warmedImages.has(key)) return;
    warmedImages.add(key);
    const next = new Image();
    next.decoding = "async";
    next.fetchPriority = "low";
    next.onload = () => pendingImages.delete(next);
    next.onerror = () => { pendingImages.delete(next); warmedImages.delete(key); };
    pendingImages.add(next);
    next.sizes = sizes;
    next.srcset = img.srcset || "";
    next.src = source;
  }
  // Warm only the neighbours of an album near the viewport, using its responsive sizes.
  function nearbyAlbum(root, neighbours, expandedSizes) {
    let nearby = false;
    const warm = (full = false) => {
      if (!nearby && !full) return;
      for (const item of neighbours()) warmImage(item.image, full ? expandedSizes : null);
    };
    if (!saveData && typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(entries => {
        nearby = entries.some(entry => entry.isIntersecting);
        if (nearby) warm();
      }, {rootMargin:"240px 0px"});
      observer.observe(root);
    }
    for (const event of ["pointerenter", "focusin", "touchstart"]) {
      root.addEventListener(event, () => { nearby = true; warm(); }, {passive:true});
    }
    return warm;
  }
  function showResponsive(target, source, fallback, sizes) {
    target.sizes = sizes;
    target.srcset = source.srcset || "";
    target.src = source.src || fallback;
    target.alt = source.alt;
  }
  // Browser file origins restrict external caption tracks. Populate native captions from the same edit offline.
  if (reel && location.protocol === "file:" && typeof VTTCue === "function") {
    const cues = JSON.parse(query("#film-cues", film).textContent);
    for (const node of list("track", reel)) {
      const lang = node.srclang, label = node.label, index = lang === "en" ? 2 : 3;
      const selected = node.default;
      node.remove();
      const captions = reel.addTextTrack("captions", label, lang);
      captions.mode = "hidden";
      for (const cue of cues) {
        const timed = new VTTCue(cue[0], cue[1], cue[index]);
        if (cue[4] != null) {
          timed.snapToLines = false;
          timed.line = cue[4];
          timed.size = 70;
        }
        captions.addCue(timed);
      }
      captions.mode = selected ? "showing" : "disabled";
    }
  }
  let filmStart = 0;
  let adaptive = null, streamReady = false, streamPaused = false, usingFallback = false;
  function fallbackFilm() {
    if (usingFallback || !reel.dataset.fallback) return;
    usingFallback = true;
    const time = reel.currentTime || filmStart;
    if (adaptive) { adaptive.destroy(); adaptive = null; }
    reel.dataset.transport = "mp4-fallback";
    reel.src = reel.dataset.fallback;
    reel.preload = "auto";
    reel.addEventListener("loadedmetadata", () => {
      reel.currentTime = time;
      if (film.open) reel.play()?.catch(() => {});
    }, {once:true});
    reel.load();
  }
  function prepareFilm(startTime = null) {
    if (!reel.dataset.stream || location.protocol === "file:") {
      reel.preload = "auto";
      return;
    }
    if (streamReady) {
      if (adaptive && streamPaused && startTime != null) { adaptive.startLoad(startTime); streamPaused = false; }
      return;
    }
    streamReady = true;
    const manifest = new URL(reel.dataset.stream, location.href).href;
    if (window.Hls?.isSupported()) {
      adaptive = new window.Hls({
        startLevel:0, abrEwmaDefaultEstimate:400000,
        abrBandWidthFactor:0.8, abrBandWidthUpFactor:0.65,
        maxBufferLength:45, maxMaxBufferLength:90, maxBufferSize:16*1024*1024,
        backBufferLength:8, capLevelToPlayerSize:true, ignoreDevicePixelRatio:true,
        lowLatencyMode:false
      });
      reel.dataset.transport = "hls";
      adaptive.on(window.Hls.Events.LEVEL_SWITCHED, (_,data) => {
        reel.dataset.rendition = String(adaptive.levels[data.level].height);
      });
      adaptive.on(window.Hls.Events.ERROR, (_,data) => { if (data.fatal) fallbackFilm(); });
      adaptive.loadSource(manifest);
      adaptive.attachMedia(reel);
    } else if (reel.canPlayType?.("application/vnd.apple.mpegurl")) {
      reel.dataset.transport = "native-hls";
      reel.src = manifest;
      reel.preload = "auto";
      reel.addEventListener("error", fallbackFilm, {once:true});
    } else fallbackFilm();
  }
  const open = dialog => {
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-open");
    query("[data-close]", dialog)?.focus({ preventScroll: true });
  };
  function playAt(time) {
    filmStart = time;
    prepareFilm(time);
    reel.preload = "auto";
    if (reel.readyState >= 1) reel.currentTime = time;
    else {
      if (!reel.dataset.waiting) {
        reel.dataset.waiting = "true";
        reel.addEventListener("loadedmetadata", () => {
          delete reel.dataset.waiting;
          if (film.open) reel.currentTime = filmStart;
        }, {once: true});
      }
    }
    // Start in the click's activation scope; play() also starts the network request.
    const result = reel.play();
    if (result) result.catch(() => {});
  }
  if (film && typeof film.showModal === "function") {
    list("[data-film]").forEach(link => {
      const prepare = () => { if (!saveData) prepareFilm(); };
      link.addEventListener("pointerenter", prepare);
      link.addEventListener("focus", prepare);
      link.addEventListener("touchstart", prepare, {passive:true});
      link.addEventListener("click", event => {
        event.preventDefault(); open(film); playAt(Number(link.dataset.start) || 0);
      });
    });
    film.addEventListener("close", () => {
      if (film.open) return;
      reel.pause();
      if (adaptive) { adaptive.stopLoad(); streamPaused = true; }
    });
  }


  function onSwipe(surface, move) {
    let start;
    surface.addEventListener("touchstart", e => {
      start = e.touches.length === 1 ? e.touches[0] : null;
    }, {passive:true});
    surface.addEventListener("touchcancel", () => { start = null; });
    surface.addEventListener("touchend", e => {
      if (start && !e.touches.length) {
        const dx = e.changedTouches[0].clientX - start.clientX;
        const dy = e.changedTouches[0].clientY - start.clientY;
        if (Math.abs(dx) > 42 && Math.abs(dx) > 1.4 * Math.abs(dy)) {
          if (e.cancelable) e.preventDefault();
          move(dx < 0 ? 1 : -1);
        }
      }
      start = null;
    }, {passive:false});
  }

  function translateAt(link, hash) {
    const target = new URL(link.getAttribute("href"), location.href);
    target.hash = hash;
    link.href = target.href;
  }
  const translations = list(".languages a, .reading-language");
  const syncLanguage = () => translations.forEach(link => translateAt(link, location.hash));
  syncLanguage();
  window.addEventListener("hashchange", syncLanguage);

  const contents = query(".reading-nav");
  if (contents) {
    const links = list("a[href^='#']", contents);
    const sections = links.map(link => document.getElementById(link.hash.slice(1)));
    const alternate = query(".reading-language", contents);
    const anchors = list(".reading-column section[id], .reading-column article[id]");
    function readingPosition(items, cutoff) {
      let latest = items[0];
      for (const item of items) {
        if (item.getBoundingClientRect().top > cutoff) break;
        latest = item;
      }
      return latest;
    }
    function highlight() {
      const selected = readingPosition(sections, window.innerHeight * 0.42);
      links.forEach((link,i) => {
        if (sections[i] === selected) link.setAttribute("aria-current","location");
        else link.removeAttribute("aria-current");
      });
    }
    if (links.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(highlight, {rootMargin:"0px 0px -58% 0px"});
      sections.forEach(section => observer.observe(section));
      highlight();
    }
    if (alternate) alternate.addEventListener("click", () => {
      const current = readingPosition(anchors, Math.max(85, window.innerHeight * 0.22));
      if (current) translateAt(alternate, "#" + current.id);
    });
  }

  const viewer = query("#comparison-dialog");
  let activePair = null;
  function wirePager(root, selectSide, move) {
    const tools = query("[data-pair-controls]",root);
    const choices = list("[data-side]",tools);
    const count = query("[data-pair-count]",tools);
    choices.forEach((button,i) => button.addEventListener("click", () => selectSide(i)));
    query("[data-pair-prev]",tools).addEventListener("click", () => move(-1));
    query("[data-pair-next]",tools).addEventListener("click", () => move(1));
    root.addEventListener("keydown", e => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        move(e.key === "ArrowRight" ? 1 : -1);
      }
    });
    tools.hidden = false;
    return (current,total) => {
      choices.forEach((button,i) => button.setAttribute("aria-pressed",String(i === current % 2)));
      if (count) {
        count.hidden = total === 2;
        count.textContent = zh ? "第 " + (1 + Math.floor(current/2)) + " / " + total/2 + " 组"
                               : "Pair " + (1 + Math.floor(current/2)) + " / " + total/2;
      }
    };
  }

  let showViewerControls;
  if (viewer && typeof viewer.showModal === "function") {
    showViewerControls = wirePager(viewer, side => activePair?.side(side), step => activePair?.move(step));
    onSwipe(query(".comparison-full",viewer), step => activePair?.move(step));
    viewer.addEventListener("close", () => {
      activePair?.focus();
      activePair = null;
    });
  }
  const bookmarks = new Map();
  for (const gallery of list("[data-pair-gallery]")) {
    const track = query("[data-pair-track]",gallery);
    const slides = list("[data-pair-slide]",track);
    const photos = slides.map(slide => query("[data-zoom]",slide));
    const status = query("[data-pair-status]",gallery);
    let current = 0;
    const warmSlides = nearbyAlbum(gallery, () => [1,-1].map(offset => {
      const i = (current + offset + slides.length) % slides.length;
      return {image:query("img",slides[i]), href:photos[i].href};
    }), "(max-width:1280px) 94vw, 1220px");
    const session = {
      side: i => show(current - current % 2 + i),
      move: step => show(current + step),
      focus: () => photos[current].focus({preventScroll:true})
    };
    const showControls = wirePager(gallery,session.side,session.move);
    function show(index, announce = true) {
      const focusWasOnPhoto = document.activeElement === photos[current];
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i !== current; });
      showControls(current,slides.length);
      const slide = slides[current];
      const name = query("[data-view-name]",slide).textContent;
      const caption = query("[data-pair-caption]",slide).textContent;
      if (viewer?.open && activePair === session) {
        showViewerControls(current,slides.length);
        const img = query("[data-zoom-image]",viewer);
        showResponsive(img,query("img",slide),photos[current].href,"(max-width:1280px) 94vw, 1220px");
        const original = query("[data-comparison-original]",viewer);
        if (original) original.href = photos[current].href;
        query("#comparison-title",viewer).textContent = name;
        query("[data-zoom-caption]",viewer).textContent = caption;
        if (announce) query("[data-pair-status]",viewer).textContent = name;
      } else {
        if (announce) status.textContent = name;
        if (announce && focusWasOnPhoto) session.focus();
      }
      warmSlides(viewer?.open && activePair === session);
    }
    onSwipe(track,session.move);
    if (showViewerControls) {
      photos.forEach((photo,i) => photo.addEventListener("click", e => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        activePair = session;
        open(viewer);
        show(i,false);
      }));
    }
    track.dataset.paged = "true";
    show(0,false);
    list("[data-pair-bookmark]",gallery).forEach((bookmark,i) => bookmarks.set("#" + bookmark.id,() => show(2*i,false)));
  }
  const restorePair = () => bookmarks.get(location.hash)?.();
  window.addEventListener("hashchange",restorePair);
  list("[data-pair-link]").forEach(link => link.addEventListener("click", () => bookmarks.get(link.hash)?.()));
  restorePair();
  const gallery = query("#gallery");
  if (gallery) {
    const track = query("#screenshot-track", gallery);
    const slides = list("[data-slide]", track);
    const frames = slides.map(slide => query("[data-image]", slide));
    const controls = query("[data-gallery-controls]", gallery);
    const counter = query("[data-gallery-count]", controls);
    const status = query("[data-gallery-status]", gallery);
    const album = query("#image-dialog");
    let current = 0;
    const warmSlides = nearbyAlbum(gallery, () => [1,-1].map(offset => {
      const i = (current + offset + frames.length) % frames.length;
      return {image:query("img",frames[i]), href:frames[i].href};
    }), "(max-width:1480px) 92vw, 1420px");

    function select(index, announce = true) {
      const moveFocus = document.activeElement === frames[current] && !album?.open;
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i !== current; });
      const caption = frames[current].dataset.title;
      counter.textContent = (current + 1) + ' / ' + slides.length;
      if (announce) status.textContent = counter.textContent + ' · ' + caption;
      if (moveFocus) frames[current].focus({preventScroll:true});
      if (album?.open) {
        const link = frames[current];
        query("#image-heading", album).textContent = caption;
        query("[data-image-caption]", album).textContent = link.dataset.caption;
        query("[data-image-version]", album).textContent = link.dataset.version;
        const img = query(".full-still", album);
        showResponsive(img,query("img",link),link.href,"(max-width:1480px) 92vw, 1420px");
        query("[data-original]", album).href = link.href;
      }
      warmSlides(!!album?.open);
    }
    function arrowKey(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      select(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }

    select(0, false);
    track.dataset.paged = 'true';
    controls.hidden = false;
    query("[data-previous-slide]", controls).addEventListener("click", () => select(current-1));
    query("[data-next-slide]", controls).addEventListener("click", () => select(current+1));
    gallery.addEventListener("keydown", arrowKey);
    onSwipe(track, offset => select(current + offset));
    if (album && typeof album.showModal === "function") {
      frames.forEach((frame,index) => frame.addEventListener("click", event => {
        event.preventDefault();
        open(album);
        select(index, false);
      }));
      query("[data-prev]",album).addEventListener("click", () => select(current-1));
      query("[data-next]",album).addEventListener("click", () => select(current+1));
      album.addEventListener("keydown", arrowKey);
      album.addEventListener("close", () => frames[current].focus({preventScroll:true}));
    }
  }
  for (const dialog of list("dialog")) {
    query("[data-close]",dialog)?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => { if (!query("dialog[open]")) document.body.classList.remove("dialog-open"); });
  }
})();
