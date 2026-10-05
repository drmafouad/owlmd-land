/* OwlMD motion. No libraries. Each scene is built with the Web Animations API (element.animate):
   it is armed (paused on its first frame) shortly before it scrolls into view, plays once when it is due,
   and is shown finished at once if the reader jumps past it. The markup is every scene's finished state. */
(function () {
  'use strict';
  var R = document.documentElement, d = document;
  function $(s, el) { return (el || d).querySelector(s); }
  function $$(s, el) { return [].slice.call((el || d).querySelectorAll(s)); }
  function rect(el) { return el.getBoundingClientRect(); }

  /* 02: mount the video only once the section is enabled (nothing is fetched while it is hidden) */
  var sec = $('#video'), tpl = $('#video-tpl');
  if (sec && tpl && !sec.hidden) tpl.parentNode.insertBefore(d.importNode(tpl.content, true), tpl);
  var v = $('.promo video'), b = $('.promo-play');
  if (v && b) {
    b.addEventListener('click', function () { v.play(); });
    v.addEventListener('play', function () { b.classList.add('gone'); });
  }

  /* 05: theme cards flip on tap (touch screens) and on Enter / Space; hover handles the mouse in CSS */
  $$('.fcard .flip').forEach(function (f) {
    function tog() { f.parentNode.classList.toggle('flipped'); }
    f.addEventListener('click', function () { if (!matchMedia('(hover: hover)').matches) tog(); });
    f.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tog(); } });
  });

  if (!/\bmo\b/.test(R.className)) return; // motion off: the default markup is the resting state
  R.className += ' mj';

  var EASE = 'cubic-bezier(.2,.8,.2,1)';  /* the site's one easing curve */
  var POP = 'cubic-bezier(.3,1.5,.5,1)';  /* a small overshoot, for things that land */

  /* ---------- Engine ---------- */
  /* Scenes below the hero play 1.3x faster than in the motion lab: in the lab you stop and watch,
     on the page you keep scrolling, so each scene has to finish while it is still on screen. */
  var RATE = 1.3;
  function Scene(el, build, rate) { this.el = el; this.build = build; this.rate = rate || RATE; this.anims = []; this.armed = false; this.fired = false; }
  Scene.prototype.a = function (target, kf, o) {
    o = Object.assign({ duration: 400, easing: EASE, fill: 'both' }, o);
    var an = target.animate(kf, o); an.playbackRate = this.rate; this.anims.push(an); return an;
  };
  Scene.prototype.clear = function () { this.anims.forEach(function (a) { a.cancel(); }); this.anims = []; this.armed = false; };
  Scene.prototype.arm = function () {
    this.clear(); this.build(this);
    this.anims.forEach(function (a) { a.pause(); }); this.armed = true;
  };
  Scene.prototype.fire = function () {
    this.fired = true;
    if (!this.armed || this.fresh) { this.firing = true; this.arm(); this.firing = false; }
    this.anims.forEach(function (a) { a.play(); });
  };

  /* due as soon as the scene's top is 15% of the screen into view (or it is on screen at the very end of the page):
     it starts while the reader is arriving, not when they are about to leave */
  function due(r, vh) {
    var end = window.scrollY + vh >= R.scrollHeight - 2;
    return r.bottom > 0 && (r.top < vh * 0.85 || (end && r.top < vh));
  }

  /* ---------- Shared moves ---------- */
  function splitChars(el) {
    var t = el.textContent; el.textContent = '';
    return t.split('').map(function (ch) { var s = d.createElement('span'); s.className = 'tch'; s.textContent = ch; el.appendChild(s); return s; });
  }
  /* letters appear one by one; the caret (which sits after the last letter) is moved back so it follows them */
  function typeIn(S, chars, caret, t0, per) {
    var last = rect(chars[chars.length - 1]).right;
    var xs = [rect(chars[0]).left - last].concat(chars.map(function (c) { return rect(c).right - last; }));
    chars.forEach(function (c, i) { S.a(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 1, delay: t0 + i * per, easing: 'linear' }); });
    var T = t0 + chars.length * per + 1;
    var kf = [{ offset: 0, transform: 'translateX(' + xs[0] + 'px)', easing: 'steps(1, end)' }];
    chars.forEach(function (c, i) { kf.push({ offset: (t0 + i * per) / T, transform: 'translateX(' + xs[i + 1] + 'px)', easing: 'steps(1, end)' }); });
    kf.push({ offset: 1, transform: 'translateX(0px)' });
    S.a(caret, kf, { duration: T, easing: 'linear' });
    return T;
  }
  function rise(S, el, delay, dist, dur, keepVisible) {
    var from = keepVisible ? { transform: 'translateY(' + dist + 'px)' } : { opacity: 0, transform: 'translateY(' + dist + 'px)' };
    var to = keepVisible ? { transform: 'none' } : { opacity: 1, transform: 'none' };
    return S.a(el, [from, to], { duration: dur || 320, delay: delay || 0 });
  }
  /* shared-element move: `to` starts on top of `from`, at from's size, and settles in its own place; `from` fades as it travels */
  function flip(S, from, to, at, dur) {
    var f = rect(from), g = rect(to), s = f.height / g.height;
    var dx = f.left - g.left, dy = f.top - g.top + (f.height - g.height * s) / 2;
    S.a(to, [{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')', opacity: 0 }, { opacity: 1, offset: 0.45 }, { transform: 'none', opacity: 1 }], { duration: dur, delay: at });
    S.a(from, [{ transform: 'none', opacity: 1 }, { opacity: 0, offset: 0.45 }, { transform: 'translate(' + (-dx) + 'px,' + (-dy) + 'px) scale(' + (1 / s) + ')', opacity: 0 }], { duration: dur, delay: at });
  }

  /* ---------- 01 Hero: an orange cursor types line 2, blinks once and becomes the full stop; the owl blinks ---------- */
  var hero = $('.hero'), heroChars = hero ? splitChars($('.type', hero)) : [];
  function buildHero(S) {
    var e = S.el, cd = $('.cd', e), bar = $('.bar', cd), dc = $('.dc', cd);
    rise(S, $('.chip-brass', e), 0, 8, 260, true);       /* line 1 and the chip are visible on the first frame: they only move */
    rise(S, $('.r1', e), 0, 10, 300, true);
    var T = typeIn(S, heroChars, cd, 300, 50);            /* typing ends ~0.85 s */
    S.a(bar, [{ opacity: 0, offset: 0, easing: 'steps(1,end)' }, { opacity: 1, offset: 0.08, easing: 'steps(1,end)' }, { opacity: 0, offset: 0.66, easing: 'steps(1,end)' }, { opacity: 1, offset: 0.8, easing: 'steps(1,end)' }, { opacity: 1, offset: 0.9 }, { opacity: 0, offset: 1 }], { duration: 1450, easing: 'linear' });
    S.a(bar, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.23)' }], { duration: 180, delay: 1290, easing: 'cubic-bezier(.5,0,.75,0)' });
    S.a(dc, [{ transform: 'scale(0)' }, { transform: 'scale(1.35)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 340, delay: 1380, easing: 'ease-out' });
    $$('.hero-sub, .hero-actions, .hero-note', e).forEach(function (el, i) { rise(S, el, T - 100 + i * 60, 12, 320); });
    var owl = $('.site-header .owl');
    if (owl) $$('.lid', owl).forEach(function (lid) {
      S.a(lid, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)', offset: 0.4 }, { transform: 'scaleY(1)', offset: 0.55 }, { transform: 'scaleY(0)' }], { duration: 300, delay: 1800, easing: 'ease-in-out', fill: 'none' });
    });
    e.classList.add('armed');
  }

  /* ---------- 03 Markdown -> PDF: typed, then each line slides and grows into its printed form ---------- */
  function buildPrint(S) {
    var e = S.el, pmd = $('.pmd', e), lines = $$('.ln', pmd), tx = $$('.tx', pmd), mk = $$('.mk', pmd), M = 1650;
    S.a(pmd, [{ opacity: 1 }, { opacity: 1, offset: 0.999 }, { opacity: 0 }], { duration: M + 900, easing: 'linear' });
    [[150, 300, 15], [480, 620, 34], [1150, 400, 21]].forEach(function (m, i) {
      S.a(lines[i], [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: m[1], delay: m[0], easing: 'steps(' + m[2] + ', end)' });
    });
    S.a(mk[0], [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(-0.6em) scale(1.6)' }], { duration: 260, delay: M, easing: 'ease-in' });
    flip(S, tx[0], $('h3', e), M + 40, 620);
    S.a(mk[1], [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scaleX(.15)' }], { duration: 280, delay: M + 120, easing: 'ease-in' });
    S.a($('.doc-callout', e), [{ clipPath: 'inset(0 100% 0 0 round 4px)' }, { clipPath: 'inset(0 0 0 0 round 4px)' }], { duration: 520, delay: M + 160 });
    flip(S, tx[1], $('.doc-ctitle', e), M + 160, 620);
    S.a($('.doc-badge', e), [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 320, delay: M + 560, easing: POP });
    S.a(mk[2], [{ opacity: 1 }, { opacity: 0 }], { duration: 200, delay: M + 240 });
    var cb = $('.doc-cb', e), ink = getComputedStyle(cb).color;
    flip(S, mk[3], cb, M + 240, 560);
    flip(S, tx[2], $('.dt3', e), M + 280, 620);
    S.a(cb, [{ color: 'transparent' }, { color: 'transparent', offset: 0.6 }, { color: ink }], { duration: 900, delay: M + 240, easing: 'steps(1,end)' });
  }

  /* ---------- 04 Arabic: the dot is a pen nib writing right to left; then the vowel marks drop in ---------- */
  function buildArabic(S) {
    var e = S.el, ink = $('.ar-ink', e), base = $('.ar-base', e), full = $('.ar-full', e), nib = $('.nib', e);
    var W = rect(ink).width, P = 200, DUR = 1400, PEN = 'cubic-bezier(.45,.05,.4,1)', F = P + DUR + 100;
    S.a(base, [{ clipPath: 'inset(-40% -5% -40% 100%)' }, { clipPath: 'inset(-40% -5% -40% -5%)' }], { duration: DUR, delay: P, easing: PEN });
    S.a(base, [{ opacity: 1 }, { opacity: 1, offset: 0.99 }, { opacity: 0 }], { duration: F + 500, easing: 'linear' });
    var kf = [], n = 12;
    for (var i = 0; i <= n; i++) { /* a slight up-and-down, like a hand writing */
      var y = (i === 0 || i === n) ? 0 : (i % 2 ? -0.07 : 0.05);
      kf.push({ transform: 'translate(' + (-W * i / n).toFixed(1) + 'px,' + y + 'em)' });
    }
    S.a(nib, kf, { duration: DUR, delay: P, easing: PEN });
    S.a(nib, [{ opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, offset: 0.08 }, { opacity: 1, scale: 1, offset: 0.86 }, { opacity: 0, scale: 0 }], { duration: DUR + 450, delay: P - 150, easing: 'linear' });
    S.a(full, [{ opacity: 0, transform: 'translateY(-0.22em)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: F });
  }

  /* ---------- 05 PDF themes: dealt from one stack into the fan (phones: slide in from the right) ---------- */
  function buildCards(S) {
    var e = S.el, cs = $$('.fcard', e);
    cs.forEach(function (c) { c.classList.remove('flipped'); });
    if (matchMedia('(max-width: 600px)').matches) {
      cs.forEach(function (c, i) { S.a(c, [{ opacity: 0, transform: 'translateX(48px)' }, { opacity: 1, transform: 'none' }], { duration: 460, delay: 120 + i * 90 }); });
      return;
    }
    cs.forEach(function (c, i) {
      var st = getComputedStyle(c);
      S.a(c, [{ translate: (i * 2 - 3) + 'px ' + (40 - i * 3) + 'px', rotate: '0deg' }, { translate: st.translate, rotate: st.rotate }], { duration: 540, delay: 200 + (3 - i) * 100, easing: POP });
    });
    $$('.fan-names li', e).forEach(function (n, i) { S.a(n, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 560 + (3 - i) * 100 }); });
  }

  /* ---------- AI answers: answer appears, is selected and copied, flies onto a page; rows light up in step ---------- */
  function buildAI(S) {
    var e = S.el, sec = e.closest('section'), bub = $('.bubble', e), aim = $('.aim', e), page = $('.ai-page', e), gh = $('.ghost', e);
    var s0 = rect(e), a = rect(aim), p = rect($('.doc-in', page));
    gh.style.left = (a.left - s0.left - 10) + 'px'; gh.style.top = (a.top - s0.top - 8) + 'px';
    var g = rect(gh), dx = p.left - g.left + 4, dy = p.top - g.top + 4, sc = Math.min(1, (p.width - 8) / g.width);
    rise(S, bub, 0, 14, 360);
    S.a($('.sel', e), [{ opacity: 1, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)', offset: 0.35 }, { opacity: 1, transform: 'scaleX(1)', offset: 0.8 }, { opacity: 0, transform: 'scaleX(1)' }], { duration: 1400, delay: 420 });
    S.a($('.copied', e), [{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'none', offset: 0.18 }, { opacity: 1, transform: 'none', offset: 0.8 }, { opacity: 0, transform: 'none' }], { duration: 1000, delay: 800, easing: 'ease-out' });
    S.a(gh, [
      { opacity: 0, transform: 'none' },
      { opacity: 1, transform: 'translate(0,-6px)', offset: 0.12 },
      { opacity: 1, transform: 'translate(' + (dx * 0.45) + 'px,' + (dy * 0.35 - 20) + 'px) scale(' + ((1 + sc) / 2) + ')', offset: 0.5 },
      { opacity: 1, transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sc + ')', offset: 0.88 },
      { opacity: 0, transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sc + ')' }
    ], { duration: 850, delay: 1100, easing: 'cubic-bezier(.4,0,.2,1)' });
    [$('h3', page)].concat($$('li', page)).forEach(function (el, i) { rise(S, el, 1800 + i * 70, 6, 300); });
    S.a(page, [{ transform: 'none' }, { transform: 'translateY(-3px)', offset: 0.4 }, { transform: 'none' }], { duration: 340, delay: 1850 });
    var dts = $$('.rows dt', sec), muted = getComputedStyle(dts[0]).color, prim = getComputedStyle(sec).getPropertyValue('--primary').trim();
    [420, 1100, 1800].forEach(function (t, i) { /* each step's row lights up while it happens */
      if (dts[i]) S.a(dts[i], [{ color: muted }, { color: prim, offset: 0.15 }, { color: prim, offset: 0.75 }, { color: muted }], { duration: i === 2 ? 1100 : 850, delay: t, easing: 'linear' });
    });
  }

  /* ---------- Find: types "meeting", results arrive, a marker sweeps over each match ---------- */
  var findQ = $('.find-stage .qt'), findChars = findQ ? splitChars(findQ) : [];
  function buildFind(S) {
    var e = S.el, caret = $('.qcaret', e);
    S.a(caret, [{ opacity: 1 }, { opacity: 1, offset: 0.95 }, { opacity: 0 }], { duration: 1300, delay: 120, easing: 'linear' });
    var T = typeIn(S, findChars, caret, 220, 65);
    $$('.results li', e).forEach(function (li, i) {
      rise(S, li, T + 60 + i * 90, 10, 320);
      S.a($('.mk', li), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 360, delay: T + 320 + i * 90, easing: 'cubic-bezier(.6,0,.3,1)' });
    });
  }

  /* ---------- Your theme: the dot sets like a sun, night falls from the top, the stars come out ---------- */
  function buildSunset(S) {
    var e = S.el, box = rect($('.ss-sunbox', e)), sun = $('.sun', e), D = rect(sun).width;
    var w = box.width, h = box.height, kf = [], n = 14;
    var P0 = [0.18 * w, 0.42 * h], P1 = [0.5 * w, -0.2 * h], P2 = [0.8 * w, h + D * 0.8];
    for (var i = 0; i <= n; i++) {
      var t = i / n, u = 1 - t;
      var x = u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0], y = u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1];
      kf.push({ transform: 'translate(' + (x - D / 2).toFixed(1) + 'px,' + (y - D / 2).toFixed(1) + 'px)', opacity: i === n ? 0 : 1 });
    }
    S.a(sun, kf, { duration: 1600, delay: 150, easing: 'cubic-bezier(.35,0,.6,1)' });
    S.a($('.ss-night', e), [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: 950, delay: 1150, easing: 'cubic-bezier(.45,0,.2,1)' });
    $$('.star', e).forEach(function (s, i) { S.a(s, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1.6)', offset: 0.5 }, { opacity: 1, transform: 'scale(1)' }], { duration: 400, delay: 1750 + i * 80, easing: 'ease-out' }); });
  }

  /* ---------- 06 Locked: night grows from the dot, the owl falls asleep, the padlock clicks shut ---------- */
  function buildLock(S) {
    var e = S.el, main = $('.sweep-main', e), dot = $('.dot', main);
    var r = rect(main), o = rect(dot), at = ' at ' + (o.left - r.left + o.width / 2) + 'px ' + (o.top - r.top + o.height / 2) + 'px';
    S.a(main, [{ clipPath: 'circle(' + (o.width / 2) + 'px' + at + ')' }, { clipPath: 'circle(150%' + at + ')' }], { duration: 1500, delay: 150, easing: 'cubic-bezier(.5,0,.2,1)' });
    $$('.lid', main).forEach(function (lid) { S.a(lid, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 420, delay: 1400, easing: 'cubic-bezier(.5,0,.3,1)' }); });
    var pl = $('.padlock', main);
    S.a(pl, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 1550 });
    S.a($('.sh', pl), [{ transform: 'translateY(-6px)' }, { transform: 'translateY(-6px)', offset: 0.5 }, { transform: 'none' }], { duration: 600, delay: 1550, easing: POP });
    S.a($('.kh', pl), [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 300, delay: 2080, easing: POP });
  }

  /* ---------- 07 Payoff: the margin dot flies off its line and lands as the full stop (phones: it drops in) ---------- */
  var rail = $('.rail'), railDot = rail && $('.rail-dot', rail);
  function railOn() { return rail && getComputedStyle(rail).display !== 'none'; }
  function buildPayoff(S) {
    var e = S.el, dot = $('.stop .dot', e), s = rect($('.stop', e));
    if (!S.firing) { S.a(dot, [{ opacity: 0 }, { opacity: 0 }], { duration: 1 }); return; } /* waiting: hidden, measured when it plays */
    dot.style.offsetRotate = '0deg'; dot.style.offsetAnchor = '0 0';
    if (railOn()) {
      var rd = rect(railDot), sx = rd.left - s.left, sy = rd.top - s.top;
      dot.style.offsetPath = 'path("M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' C ' + (sx * 0.55).toFixed(1) + ' ' + (sy - 140).toFixed(1) + ', ' + (sx * 0.1).toFixed(1) + ' -150, 0 0")';
      S.a(railDot, [{ opacity: 1 }, { opacity: 0 }], { duration: 1, delay: 1, easing: 'linear' });
      S.a(dot, [{ offsetDistance: '0%', transform: 'scale(' + (rd.width / s.width).toFixed(3) + ')' }, { offsetDistance: '100%', transform: 'none' }], { duration: 1100, easing: 'cubic-bezier(.45,0,.2,1)' });
      S.a(dot, [{ transform: 'none' }, { transform: 'scale(1.4, .7)', offset: 0.35 }, { transform: 'none' }], { duration: 260, delay: 1080, easing: 'ease-out', composite: 'add' });
    } else {
      dot.style.offsetPath = innerWidth <= 640 ? 'path("M -90 -120 C -90 -50, -40 -8, 0 0")' : 'path("M -170 -190 C -170 -70, -70 -12, 0 0")';
      S.a(dot, [{ offsetDistance: '0%', opacity: 0 }, { opacity: 1, offset: 0.12 }, { offsetDistance: '100%', opacity: 1 }], { duration: 1100, delay: 200 });
    }
  }
  var payoffEl = $('.payoff');
  function railMove() {
    if (!railOn() || !payoffEl) return;
    var target = payoffEl.offsetTop - window.innerHeight * 0.4;
    var p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, target)));
    railDot.style.transform = 'translateY(' + (p * rail.clientHeight).toFixed(1) + 'px)';
  }

  /* ---------- Wire up ---------- */
  var builders = { print: buildPrint, arabic: buildArabic, cards: buildCards, ai: buildAI, find: buildFind, sunset: buildSunset, lock: buildLock, payoff: buildPayoff };
  var scenes = $$('.scene').map(function (el) {
    var S = new Scene(el, builders[el.getAttribute('data-scene')]);
    S.fresh = true; /* measured again the moment it plays: late web fonts (the serif page, Arabic) can shift the letters after arming */
    if (el.getAttribute('data-scene') === 'payoff') S.again = true; /* it follows the moving rail dot and plays again on the way back */
    return S;
  });
  var heroScene = hero && new Scene(hero, buildHero, 1);

  var queued = false;
  function check() {
    queued = false; var vh = window.innerHeight;
    scenes.forEach(function (S) {
      var r = rect(S.el);
      if (S.fired) { if (S.again && r.top > vh) { S.fired = false; S.arm(); } return; }
      if (r.bottom <= 0) { S.clear(); S.fired = true; return; } /* jumped past: show it finished */
      if (!S.armed && r.top < vh * 1.25) S.arm(); /* set its first frame just before it scrolls in */
      if (due(r, vh)) S.fire();
    });
    railMove();
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(check); } }

  var started = false;
  function start() {
    if (started) return; started = true;
    if (heroScene) { if (rect(hero).bottom > 0) heroScene.fire(); else hero.classList.add('armed'); }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    window.addEventListener('load', queue);
    check();
  }
  /* letters are measured, so wait for the web fonts (never longer than 0.8 s) */
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(start);
  setTimeout(start, 800);
})();
