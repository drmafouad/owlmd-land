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

  /* Scene timing. One passive scroll/resize check (throttled to one per frame) covers every case:
     - a scene starts when its centre reaches 66% of the screen height (eyes are on it); for scenes taller than
       that, when their top reaches the upper third;
     - at the very end of the page (the scene can never reach that line) it starts once it is on screen;
     - a scene the reader has already passed (jump link, End key, reload half-way down) is shown finished at once
       ("now" = no animation), so nothing is ever left hidden above the reader. */
  var scenes = [d.querySelector('.stack3'), d.querySelector('#arabic .pdf-page'), d.querySelector('.payoff')].filter(Boolean);
  var s = $('.sweep'), sDot = s && s.querySelector('.sweep-main .dot');
  var queued = false;

  function due(r, vh) {
    var line = vh * 0.66;
    var end = window.scrollY + vh >= d.documentElement.scrollHeight - 2;
    return r.bottom > 0 && r.top < vh && (r.top <= line - Math.min(r.height, line) / 2 || end);
  }
  function start(el, now) {
    if (now) el.classList.add('now');
    el.classList.add('in');
  }
  function check() {
    queued = false;
    var vh = window.innerHeight;
    scenes = scenes.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom <= 0) { start(el, true); return false; }   // already passed
      if (due(r, vh)) { start(el, false); return false; }
      return true;
    });
    if (s) {
      var r = s.getBoundingClientRect(), on = s.classList.contains('in');
      if (!on && (r.bottom <= 0 || due(r, vh))) {
        var o = sDot.getBoundingClientRect();
        s.style.setProperty('--cx', (o.left - r.left + o.width / 2) + 'px');
        s.style.setProperty('--cy', (o.top - r.top + o.height / 2) + 'px');
        s.style.setProperty('--r0', (o.width / 2) + 'px');
        s.classList.toggle('now', r.bottom <= 0);
        s.classList.add('in');
      } else if (on && r.top > vh - Math.min(r.height, vh) * 0.15) {
        s.classList.remove('in', 'now');   // back below the screen: close again (never flickers mid-screen)
      }
    }
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(check); } }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  window.addEventListener('load', queue);
  queue();
})();
