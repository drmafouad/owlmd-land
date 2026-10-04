/* OwlMD scroll motion helpers. No libraries, no scroll listeners: IntersectionObserver only. */
(function () {
  var R = document.documentElement, d = document;
  var $ = function (s) { return d.querySelector(s); };

  /* 02: mount the video only once the section is enabled (nothing is fetched while it is hidden) */
  var sec = $('#video'), tpl = $('#video-tpl');
  if (sec && tpl && !sec.hidden) tpl.parentNode.insertBefore(d.importNode(tpl.content, true), tpl);

  if (!/\bmo\b/.test(R.className)) return; // motion off: the default markup is the resting state
  R.className += ' mj'; // from here on, scenes may start in their pre-animation state
  var native = window.CSS && CSS.supports('animation-timeline', 'view()');

  /* 01: how far the dot travels to land as line 2's full stop */
  var t = $('.r2'), dot = $('.hero-title .dot');
  function measure() {
    if (t && dot) R.style.setProperty('--dx', (t.offsetWidth + parseFloat(getComputedStyle(dot).marginLeft)) + 'px'); // layout widths, unaffected by the animation's transforms
  }
  measure();
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(measure);

  /* Add .in when `sel` reaches `th` visible. mode: 'once', or 'tog' (removed again when scrolled back up). */
  function watch(sel, th, mode, before) {
    var el = $(sel);
    if (!el) return;
    new IntersectionObserver(function (es, ob) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          if (before) before(e.target);
          e.target.classList.add('in');
          if (mode === 'once') ob.unobserve(e.target);
        } else if (mode === 'tog' && e.boundingClientRect.top > 0) {
          e.target.classList.remove('in');
        }
      });
    }, { threshold: th }).observe(el);
  }

  if (!native) { watch('.promo-frame', 0.2, 'once'); watch('.stack3', 0.4, 'once'); watch('.fan', 0.3, 'once'); }
  watch('#arabic .pdf-page', 0.4, 'once');                       // 04
  watch('.sweep', 0.5, 'tog', function (s) {                     // 06: sweep grows from the dot
    var o = s.querySelector('.sweep-main .dot').getBoundingClientRect(), b = s.getBoundingClientRect();
    s.style.setProperty('--cx', (o.left - b.left + o.width / 2) + 'px');
    s.style.setProperty('--cy', (o.top - b.top + o.height / 2) + 'px');
  });
  watch('.payoff', 0.6, 'once');                                 // 07
  watch('.site-footer', 0.01, 'once');                           // footer never stays dimmed
  var p = $('.payoff');
  if (p) new MutationObserver(function () { if (p.classList.contains('in')) $('.site-footer').classList.add('in'); })
    .observe(p, { attributes: true, attributeFilter: ['class'] });

  /* 02: the play button starts the video; never autoplay */
  var v = $('.promo video'), b = $('.promo-play');
  if (v && b) {
    b.addEventListener('click', function () { v.play(); });
    v.addEventListener('play', function () { b.classList.add('gone'); });
  }
})();
