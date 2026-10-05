/* OwlMD website: theme toggle, scroll reveal, guide contents highlight. No dependencies. */
(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'owlmd-theme';

  /* ---- Theme: Light / Dark / Auto (the head script already set the first paint) ---- */
  function apply(pref) {
    root.setAttribute('data-pref', pref);
    if (pref === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', pref);
    var buttons = document.querySelectorAll('.theme-toggle button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-theme-set') === pref));
    }
  }
  var current = root.getAttribute('data-pref') || 'auto';
  apply(current);
  var toggles = document.querySelectorAll('.theme-toggle button');
  for (var t = 0; t < toggles.length; t++) {
    toggles[t].addEventListener('click', function () {
      var pref = this.getAttribute('data-theme-set');
      apply(pref);
      try { localStorage.setItem(KEY, pref); } catch (e) { /* private mode or blocked storage */ }
    });
  }

  /* ---- Reveal on scroll: below-the-fold blocks fade up as their top passes 88% of the screen.
     One passive scroll check per frame; blocks the reader jumped past are shown at once. ---- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = [].slice.call(document.querySelectorAll('.rv'));
  if (!reduce && items.length) {
    var vh0 = window.innerHeight;
    items = items.filter(function (el) {
      if (el.getBoundingClientRect().top > vh0) { el.setAttribute('data-rv', 'pending'); return true; }
      return false;
    });
    var queued = false;
    var reveal = function () {
      queued = false;
      var vh = window.innerHeight;
      items = items.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.88 || r.bottom <= 0) { el.removeAttribute('data-rv'); return false; }
        return true;
      });
      if (!items.length) { window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); }
    };
    var queue = function () { if (!queued) { queued = true; requestAnimationFrame(reveal); } };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
  }

  /* ---- Guide: highlight the current section in the contents ---- */
  var links = document.querySelectorAll('.toc a');
  var sections = document.querySelectorAll('.prose section[id]');
  if (links.length && sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.getAttribute('id');
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
      });
    }, { rootMargin: '-20% 0px -60% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
