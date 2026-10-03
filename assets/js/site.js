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

  /* ---- Reveal on scroll: below-the-fold blocks start slightly dimmed (never hidden) ---- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.rv');
  if (!reduce && 'IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.removeAttribute('data-rv'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top > window.innerHeight) { el.setAttribute('data-rv', 'pending'); io.observe(el); }
    });
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
