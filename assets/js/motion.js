/* OwlMD motion helpers. No libraries, no scroll listeners: IntersectionObserver only. */
(function () {
  var R = document.documentElement, d = document;
  var $ = function (s) { return d.querySelector(s); };

  /* 02: mount the video only once the section is enabled (nothing is fetched while it is hidden) */
  var sec = $('#video'), tpl = $('#video-tpl');
  if (sec && tpl && !sec.hidden) tpl.parentNode.insertBefore(d.importNode(tpl.content, true), tpl);
  var v = $('.promo video'), b = $('.promo-play');
  if (v && b) {
    b.addEventListener('click', function () { v.play(); });
    v.addEventListener('play', function () { b.classList.add('gone'); });
  }

  if (!/\bmo\b/.test(R.className)) return; // motion off: the default markup is the resting state
  R.className += ' mj'; // from here on, scenes may start in their pre-animation state

  /* Add .in once when `sel` is `th` visible. */
  function once(sel, th) {
    var el = $(sel);
    if (!el) return;
    new IntersectionObserver(function (es, ob) {
      es.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= th) { e.target.classList.add('in'); ob.unobserve(e.target); }
      });
    }, { threshold: th }).observe(el);
  }
  once('.stack3', 0.6);            // 03
  once('#arabic .pdf-page', 0.4);  // 04
  once('.payoff', 0.6);            // 07

  /* 06: on at 50% visible; off again only below 15% visible AND below the screen, so it can't flicker */
  var s = $('.sweep');
  if (s) new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.intersectionRatio >= 0.5 && !s.classList.contains('in')) {
        var o = s.querySelector('.sweep-main .dot').getBoundingClientRect(), r = s.getBoundingClientRect();
        s.style.setProperty('--cx', (o.left - r.left + o.width / 2) + 'px');
        s.style.setProperty('--cy', (o.top - r.top + o.height / 2) + 'px');
        s.classList.add('in');
      } else if (e.intersectionRatio < 0.15 && e.boundingClientRect.top > 0) {
        s.classList.remove('in');
      }
    });
  }, { threshold: [0, 0.15, 0.5] }).observe(s);
})();
