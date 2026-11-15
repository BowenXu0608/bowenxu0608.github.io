(() => {
  "use strict";
  const zh = document.documentElement.lang.startsWith("zh");
  const query = (selector, root = document) => root.querySelector(selector);
  const list = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const film = query("#film-dialog");
  const reel = film?.querySelector("video");
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
  const open = dialog => {
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-open");
    query("[data-close]", dialog)?.focus({ preventScroll: true });
  };
  function playAt(time) {
    const start = () => {
      reel.currentTime = time;
      const result = reel.play();
      if (result) result.catch(() => {});
    };
    if (reel.readyState >= 1) start();
    else {
      filmStart = time;
      if (!reel.dataset.waiting) {
        reel.dataset.waiting = "true";
        reel.addEventListener("loadedmetadata", () => {
          delete reel.dataset.waiting;
          if (film.open) playAt(filmStart);
        }, {once: true});
      }
      reel.load();
    }
  }
  if (film && typeof film.showModal === "function") {
    list("[data-film]").forEach(link => link.addEventListener("click", event => {
      event.preventDefault(); open(film); playAt(Number(link.dataset.start) || 0);
    }));
    list("[data-time]",film).forEach(button => button.addEventListener("click", () => playAt(Number(button.dataset.time))));
    reel.addEventListener("timeupdate", () => {
      const chapters = list("[data-time]",film);
      const active = chapters.filter(button => Number(button.dataset.time) <= reel.currentTime).pop();
      chapters.forEach(button => button.setAttribute("aria-pressed",String(button === active)));
    });
    film.addEventListener("close", () => reel.pause());
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
        img.src = photos[current].href;
        img.alt = query("img",slide).alt;
        query("#comparison-title",viewer).textContent = name;
        query("[data-zoom-caption]",viewer).textContent = caption;
        if (announce) query("[data-pair-status]",viewer).textContent = name;
      } else {
        if (announce) status.textContent = name;
        if (announce && focusWasOnPhoto) session.focus();
      }
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
        img.src = link.href;
        img.alt = query("img",link).alt;
        query("[data-original]", album).href = link.href;
      }
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
    dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
  }
})();
