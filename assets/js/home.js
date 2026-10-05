/* OwlMD home page motion. Built from the approved motion lab (motion-lab.html) without the lab controls.
   Each scene is armed (paused on its first frame) as it nears the screen, plays once when its middle
   reaches 80% of the screen, and is shown finished at once if the reader jumps past it. */
(function () {
    'use strict';
    var d = document, R = d.documentElement;
    var EASE = 'cubic-bezier(.2,.8,.2,1)';      /* the site's one easing curve */
    var POP = 'cubic-bezier(.3,1.5,.5,1)';      /* small overshoot, for things that land */
    var motionOK = /\blab-motion\b/.test(R.className);
    var opt = { slow: false, still: !motionOK };
    var demos = [], byName = {};
    function $(s, el) { return (el || d).querySelector(s); }
    function $$(s, el) { return [].slice.call((el || d).querySelectorAll(s)); }

    /* 02: mount the video only once the section is enabled (nothing is fetched while it is hidden) */
    var vsec = $('#video'), vtpl = $('#video-tpl');
    if (vsec && vtpl && !vsec.hidden) vtpl.parentNode.insertBefore(d.importNode(vtpl.content, true), vtpl);
    var vid = $('.promo video'), vplay = $('.promo-play');
    if (vid && vplay) {
        vplay.addEventListener('click', function () { vid.play(); });
        vid.addEventListener('play', function () { vplay.classList.add('gone'); });
    }
    function rect(el) { return el.getBoundingClientRect(); }

    /* ---------- Engine: each demo builds its animations; arm = paused on frame 0, fire = play ---------- */
    function Demo(el, build) {
        this.el = el; this.stage = $('.lab-stage', el); this.build = build;
        this.anims = []; this.armed = false; this.fired = false; this.variant = 0;
    }
    Demo.prototype.a = function (target, kf, o) {
        o = Object.assign({ duration: 400, easing: EASE, fill: 'both' }, o);
        var an = target.animate(kf, o);
        if (opt.slow) an.playbackRate = 1 / 3;
        this.anims.push(an); return an;
    };
    Demo.prototype.clear = function () {
        this.anims.forEach(function (a) { a.cancel(); }); this.anims = []; this.armed = false;
    };
    Demo.prototype.arm = function () {
        this.clear(); if (opt.still) return;
        this.build(this); this.anims.forEach(function (a) { a.pause(); }); this.armed = true;
    };
    Demo.prototype.fire = function () {
        this.fired = true;
        if (opt.still) { this.clear(); return; }
        if (!this.armed || this.fresh) { this.firing = true; this.arm(); this.firing = false; }
        this.anims.forEach(function (a) { a.play(); });
    };
    Demo.prototype.replay = function () { this.armed = false; this.fire(); };

    /* the scene is due when its middle passes 80% of the screen (same rule as the live site) */
    function due(r, vh) {
        var line = vh * 0.8, end = window.scrollY + vh >= R.scrollHeight - 2;
        return r.bottom > 0 && r.top < vh && (r.top <= line - Math.min(r.height, line) / 2 || end);
    }
    var queued = false;
    function check() {
        queued = false; var vh = window.innerHeight;
        demos.forEach(function (D) {
            var r = rect(D.stage);
            if (D.fired) { if (r.top > vh) { D.fired = false; D.arm(); } return; } /* below the screen again: ready to replay */
            if (r.bottom <= 0) { D.clear(); D.fired = true; return; }            /* jumped past: show it finished */
            if (!D.armed && r.top < vh * 1.6) D.arm();
            if (due(r, vh)) D.fire();
        });
        railMove();
    }
    function queue() { if (!queued) { queued = true; requestAnimationFrame(check); } }

    /* ---------- Shared: typing with a caret that follows the text ---------- */
    function splitChars(el) {
        var t = el.textContent; el.textContent = '';
        return t.split('').map(function (ch) { var s = d.createElement('span'); s.className = 'tch'; s.textContent = ch; el.appendChild(s); return s; });
    }
    function typeIn(D, chars, caret, t0, per) {
        var last = rect(chars[chars.length - 1]).right;
        var xs = [rect(chars[0]).left - last].concat(chars.map(function (c) { return rect(c).right - last; }));
        chars.forEach(function (c, i) { D.a(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 1, delay: t0 + i * per, easing: 'linear' }); });
        var T = t0 + chars.length * per + 1;
        var kf = [{ offset: 0, transform: 'translateX(' + xs[0] + 'px)', easing: 'steps(1, end)' }];
        chars.forEach(function (c, i) { kf.push({ offset: (t0 + i * per) / T, transform: 'translateX(' + xs[i + 1] + 'px)', easing: 'steps(1, end)' }); });
        kf.push({ offset: 1, transform: 'translateX(0px)' });
        D.a(caret, kf, { duration: T, easing: 'linear' });
        return T;
    }
    function rise(D, el, delay, dist, dur) {
        return D.a(el, [{ opacity: 0, transform: 'translateY(' + (dist || 12) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: dur || 320, delay: delay || 0 });
    }
    function blink(D, owl, at) { /* both eyelids close and open once */
        $$('.lid', owl).forEach(function (lid) {
            D.a(lid, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)', offset: 0.4 }, { transform: 'scaleY(1)', offset: 0.55 }, { transform: 'scaleY(0)' }], { duration: 300, delay: at, easing: 'ease-in-out' });
        });
    }
    /* shared-element move: `to` starts on top of `from` at from's size, then settles; `from` fades as it travels */
    function flip(D, from, to, at, dur) {
        var f = rect(from), g = rect(to), s = f.height / g.height;
        var dx = f.left - g.left, dy = f.top - g.top + (f.height - g.height * s) / 2;
        D.a(to, [{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')', opacity: 0 }, { opacity: 1, offset: 0.45 }, { transform: 'none', opacity: 1 }], { duration: dur, delay: at });
        D.a(from, [{ transform: 'none', opacity: 1 }, { opacity: 0, offset: 0.45 }, { transform: 'translate(' + (-dx) + 'px,' + (-dy) + 'px) scale(' + (1 / s) + ')', opacity: 0 }], { duration: dur, delay: at });
    }

    /* ---------- 01 Hero ---------- */
    var heroChars = splitChars($('#d-hero .type'));
    function hero(D) {
        var e = D.el, cd = $('.cd', e), bar = $('.bar', cd), dc = $('.dc', cd);
        D.a($('.chip-brass', e), [{ transform: 'translateY(8px)' }, { transform: 'none' }], { duration: 260 });
        rise(D, $('.l1', e), 40, 14, 340);
        var T = typeIn(D, heroChars, cd, 420, 55);                     /* typing ends ~1.03 s */
        /* the caret: on at 0.25 s, one blink after typing, then hands over to the dot */
        D.a(bar, [{ opacity: 0, offset: 0, easing: 'steps(1,end)' }, { opacity: 1, offset: 0.15, easing: 'steps(1,end)' }, { opacity: 0, offset: 0.72, easing: 'steps(1,end)' }, { opacity: 1, offset: 0.82, easing: 'steps(1,end)' }, { opacity: 1, offset: 0.9 }, { opacity: 0, offset: 1 }], { duration: 1650, easing: 'linear' });
        D.a(bar, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.23)' }], { duration: 200, delay: 1460, easing: 'cubic-bezier(.5,0,.75,0)' });
        D.a(dc, [{ transform: 'scale(0)' }, { transform: 'scale(1.35)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 360, delay: 1560, easing: 'ease-out' });
        $$('.hero-sub, .hero-actions', e).forEach(function (el, i) { rise(D, el, T - 40 + i * 60, 12, 340); });
        blink(D, $('.site-header .owl'), 1950); /* the owl in the header */
    }

    /* ---------- 02 Print ---------- */
    function print(D) {
        var e = D.el, st = $('.pstage', e), pmd = $('.pmd', e), lines = $$('.ln', pmd);
        var M = 1850, B = D.variant === 1;
        st.classList.toggle('pv-b', B);
        /* the overlay is visible for the whole demo, then gone */
        D.a(pmd, [{ opacity: 1 }, { opacity: 1, offset: 0.999 }, { opacity: 0 }], { duration: B ? M + 260 : M + 900, easing: 'linear' });
        var marks = [[200, 300, 15], [560, 640, 34], [1260, 430, 21]];
        lines.forEach(function (ln, i) {
            D.a(ln, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: marks[i][1], delay: marks[i][0], easing: 'steps(' + marks[i][2] + ', end)' });
        });
        if (B) { /* PRINTER: the editor fades, the page feeds down out of a slot */
            D.a(pmd, [{ transform: 'none' }, { transform: 'translateY(-12px) scale(.97)' }], { duration: 260, delay: M, easing: 'ease-in' });
            var slot = $('.slot', e);
            D.a(slot, [{ opacity: 0, transform: 'scaleX(.4)' }, { opacity: 1, transform: 'none', offset: 0.12 }, { opacity: 1, transform: 'none', offset: 0.85 }, { opacity: 0, transform: 'none' }], { duration: 1500, delay: M + 120 });
            D.a($('.doc-page', e), [{ clipPath: 'inset(100% 0 0 0)', transform: 'translateY(-100%)' }, { clipPath: 'inset(0 0 0 0)', transform: 'none' }], { duration: 1050, delay: M + 300, easing: 'cubic-bezier(.35,.1,.25,1)' });
            return;
        }
        /* MORPH: each Markdown line becomes its printed form */
        var tx = $$('.tx', pmd), mk = $$('.mk', pmd);
        D.a(mk[0], [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(-0.6em) scale(1.6)' }], { duration: 260, delay: M, easing: 'ease-in' });
        flip(D, tx[0], $('h3', e), M + 40, 620);
        var co = $('.doc-callout', e);
        D.a(mk[1], [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scaleX(.15)' }], { duration: 280, delay: M + 120, easing: 'ease-in' });
        D.a(co, [{ clipPath: 'inset(0 100% 0 0 round 4px)' }, { clipPath: 'inset(0 0 0 0 round 4px)' }], { duration: 520, delay: M + 160 });
        flip(D, tx[1], $('.doc-ctitle', e), M + 160, 620);
        D.a($('.doc-badge', e), [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 320, delay: M + 560, easing: POP });
        D.a(mk[2], [{ opacity: 1 }, { opacity: 0 }], { duration: 200, delay: M + 240 });
        flip(D, mk[3], $('.doc-cb', e), M + 240, 560);
        flip(D, tx[2], $('.dt3', e), M + 280, 620);
        var cb = $('.doc-cb', e), ink = getComputedStyle(cb).color;
        D.a(cb, [{ color: 'transparent' }, { color: 'transparent', offset: 0.6 }, { color: ink }], { duration: 900, delay: M + 240, easing: 'steps(1,end)' });
    }

    /* ---------- 03 Arabic ---------- */
    function arabic(D) {
        var e = D.el, ink = $('.ar-ink', e), base = $('.ar-base', e), full = $('.ar-full', e), nib = $('.nib', e);
        var W = rect(ink).width, P = 250, DUR = 1500, PEN = 'cubic-bezier(.45,.05,.4,1)';
        D.a(base, [{ clipPath: 'inset(-40% -5% -40% 100%)' }, { clipPath: 'inset(-40% -5% -40% -5%)' }], { duration: DUR, delay: P, easing: PEN });
        var kf = [], n = 12;
        for (var i = 0; i <= n; i++) { /* a slight up-and-down, like a hand writing */
            var y = (i === 0 || i === n) ? 0 : (i % 2 ? -0.07 : 0.05);
            kf.push({ transform: 'translate(' + (-W * i / n).toFixed(1) + 'px,' + y + 'em)' });
        }
        D.a(nib, kf, { duration: DUR, delay: P, easing: PEN });
        D.a(nib, [{ opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, offset: 0.08 }, { opacity: 1, scale: 1, offset: 0.86 }, { opacity: 0, scale: 0 }], { duration: DUR + 450, delay: P - 150, easing: 'linear' });
        D.a(full, [{ opacity: 0, transform: 'translateY(-0.22em)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: P + DUR + 120 });
    }

    /* ---------- 04 Cards ---------- */
    function cards(D) {
        var e = D.el, cs = $$('.fcard', e), phone = matchMedia('(max-width: 600px)').matches;
        cs.forEach(function (c) { c.classList.remove('flipped'); });
        if (phone) {
            cs.forEach(function (c, i) { D.a(c, [{ opacity: 0, transform: 'translateX(48px)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: 150 + i * 90 }); });
            return;
        }
        cs.forEach(function (c, i) {
            var cst = getComputedStyle(c);
            D.a(c, [{ translate: (i * 2 - 3) + 'px ' + (40 - i * 3) + 'px', rotate: '0deg' }, { translate: cst.translate, rotate: cst.rotate }], { duration: 560, delay: 300 + (3 - i) * 110, easing: POP });
        });
        $$('.fan-names li', e).forEach(function (n, i) { D.a(n, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 700 + (3 - i) * 110 }); });
    }

    /* ---------- 05 AI ---------- */
    function ai(D) {
        var e = D.el, st = $('.ai-stage', e), bub = $('.bubble', e), aim = $('.aim', e), sel = $('.sel', e);
        var page = $('.ai-page', e), gh = $('.ghost', e), dts = $$('.rows dt', e);
        var s0 = rect(st), a = rect(aim), p = rect($('.doc-in', page));
        gh.style.left = (a.left - s0.left - 10) + 'px'; gh.style.top = (a.top - s0.top - 8) + 'px';
        var g = rect(gh), dx = p.left - g.left + 4, dy = p.top - g.top + 4, sc = Math.min(1, (p.width - 8) / g.width);
        rise(D, bub, 0, 14, 380);
        D.a(sel, [{ opacity: 1, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)', offset: 0.35 }, { opacity: 1, transform: 'scaleX(1)', offset: 0.8 }, { opacity: 0, transform: 'scaleX(1)' }], { duration: 1500, delay: 480 });
        D.a($('.copied', e), [{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'none', offset: 0.18 }, { opacity: 1, transform: 'none', offset: 0.8 }, { opacity: 0, transform: 'none' }], { duration: 1100, delay: 900, easing: 'ease-out' });
        D.a(gh, [
            { opacity: 0, transform: 'none' },
            { opacity: 1, transform: 'translate(0,-6px)', offset: 0.12 },
            { opacity: 1, transform: 'translate(' + (dx * 0.45) + 'px,' + (dy * 0.35 - 20) + 'px) scale(' + ((1 + sc) / 2) + ')', offset: 0.5 },
            { opacity: 1, transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sc + ')', offset: 0.88 },
            { opacity: 0, transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sc + ')' }
        ], { duration: 900, delay: 1250, easing: 'cubic-bezier(.4,0,.2,1)' });
        $$('.doc-in > *, .doc-in li', page).forEach(function (el, i) { if (el.tagName !== 'UL') rise(D, el, 2000 + i * 70, 6, 300); });
        D.a(page, [{ transform: 'none' }, { transform: 'translateY(-3px)', offset: 0.4 }, { transform: 'none' }], { duration: 360, delay: 2050 });
        var muted = getComputedStyle(dts[0]).color, prim = getComputedStyle(e).getPropertyValue('--primary').trim();
        [480, 1250, 2000].forEach(function (t, i) { /* each step's row lights up while it happens */
            D.a(dts[i], [{ color: muted }, { color: prim, offset: 0.15 }, { color: prim, offset: 0.75 }, { color: muted }], { duration: i === 2 ? 1200 : 900, delay: t, easing: 'linear' });
        });
    }

    /* ---------- 06 Find ---------- */
    var findChars = splitChars($('#d-find .qt'));
    function find(D) {
        var e = D.el, caret = $('.qcaret', e);
        D.a(caret, [{ opacity: 1 }, { opacity: 1, offset: 0.95 }, { opacity: 0 }], { duration: 1400, delay: 150, easing: 'linear' });
        var T = typeIn(D, findChars, caret, 250, 70);
        $$('.results li', e).forEach(function (li, i) {
            rise(D, li, T + 60 + i * 90, 10, 320);
            D.a($('.mk', li), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 380, delay: T + 340 + i * 90, easing: 'cubic-bezier(.6,0,.3,1)' });
        });
        $$('.find-stage .chips .chip', e).forEach(function (c, i) { rise(D, c, T + 420 + i * 60, 8, 260); });
    }

    /* ---------- 07 Sunset ---------- */
    function sunset(D) {
        var e = D.el, box = rect($('.ss-sunbox', e)), sun = $('.sun', e), S = rect(sun).width;
        var w = box.width, h = box.height, kf = [], n = 14;
        var P0 = [0.18 * w, 0.42 * h], P1 = [0.5 * w, -0.2 * h], P2 = [0.8 * w, h + S * 0.8];
        for (var i = 0; i <= n; i++) {
            var t = i / n, u = 1 - t;
            var x = u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0], y = u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1];
            kf.push({ transform: 'translate(' + (x - S / 2).toFixed(1) + 'px,' + (y - S / 2).toFixed(1) + 'px)', opacity: i === n ? 0 : 1 });
        }
        kf[n - 1].opacity = 1;
        D.a(sun, kf, { duration: 1700, delay: 200, easing: 'cubic-bezier(.35,0,.6,1)' });
        var night = $('.ss-night', e);
        D.a(night, [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: 1000, delay: 1250, easing: 'cubic-bezier(.45,0,.2,1)' });
        $$('.star', e).forEach(function (s, i) { D.a(s, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1.6)', offset: 0.5 }, { opacity: 1, transform: 'scale(1)' }], { duration: 420, delay: 1900 + i * 80, easing: 'ease-out' }); });
    }

    /* ---------- 08 Lock ---------- */
    function lock(D) {
        var e = D.el, main = $('.sweep-main', e), dot = $('.sweep-main .dot', e);
        var r = rect(main), o = rect(dot), cx = o.left - r.left + o.width / 2, cy = o.top - r.top + o.height / 2, at = ' at ' + cx + 'px ' + cy + 'px';
        D.a(main, [{ clipPath: 'circle(' + (o.width / 2) + 'px' + at + ')' }, { clipPath: 'circle(150%' + at + ')' }], { duration: 1500, delay: 150, easing: 'cubic-bezier(.5,0,.2,1)' });
        $$('.sweep-main .lid', e).forEach(function (lid) {
            D.a(lid, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 420, delay: 1450, easing: 'cubic-bezier(.5,0,.3,1)' });
        });
        var pl = $('.padlock', e);
        D.a(pl, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 1600 });
        D.a($('.sh', pl), [{ transform: 'translateY(-6px)' }, { transform: 'translateY(-6px)', offset: 0.5 }, { transform: 'none' }], { duration: 620, delay: 1600, easing: POP });
        D.a($('.kh', pl), [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 320, delay: 2150, easing: POP });
    }

    /* ---------- 09 Journey: margin rail + payoff ---------- */
    var rail = $('.rail'), railDot = $('.rail-dot'), payoffEl = $('#d-payoff');
    function railOn() { return rail && getComputedStyle(rail).display !== 'none'; }
    function railMove() {
        if (!railOn()) return;
        var target = payoffEl.offsetTop + rect($('.payoff', payoffEl)).height * 0 - window.innerHeight * 0.4;
        var p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, target)));
        railDot.style.transform = 'translateY(' + (p * rail.clientHeight).toFixed(1) + 'px)';
    }
    function payoff(D) {
        var e = D.el, dot = $('.stop .dot', e), stop = $('.stop', e), s = rect(stop);
        if (!D.firing) { D.a(dot, [{ opacity: 0 }, { opacity: 0 }], { duration: 1 }); return; } /* waiting: just hidden */
        if (railOn()) { /* fly from the margin rail into the full stop */
            var rd = rect(railDot), sx = rd.left - s.left, sy = rd.top - s.top;
            var path = 'path("M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' C ' + (sx * 0.55).toFixed(1) + ' ' + (sy - 140).toFixed(1) + ', ' + (sx * 0.1).toFixed(1) + ' -150, 0 0")';
            dot.style.offsetPath = path; dot.style.offsetRotate = '0deg'; dot.style.offsetAnchor = '0 0';
            D.a(railDot, [{ opacity: 1 }, { opacity: 0 }], { duration: 1, delay: 1, easing: 'linear' });
            D.a(dot, [{ offsetDistance: '0%', transform: 'scale(' + (rd.width / s.width).toFixed(3) + ')' }, { offsetDistance: '100%', transform: 'none' }], { duration: 1100, delay: 0, easing: 'cubic-bezier(.45,0,.2,1)' });
            D.a(dot, [{ transform: 'none' }, { transform: 'scale(1.4, .7)', offset: 0.35 }, { transform: 'none' }], { duration: 260, delay: 1080, easing: 'ease-out', composite: 'add' });
        } else { /* phones: the drop from above, as on the live site */
            dot.style.offsetPath = innerWidth <= 640 ? 'path("M -90 -120 C -90 -50, -40 -8, 0 0")' : 'path("M -170 -190 C -170 -70, -70 -12, 0 0")';
            dot.style.offsetRotate = '0deg'; dot.style.offsetAnchor = '0 0';
            D.a(dot, [{ offsetDistance: '0%', opacity: 0 }, { opacity: 1, offset: 0.12 }, { offsetDistance: '100%', opacity: 1 }], { duration: 1100, delay: 200 });
        }
    }

    /* ---------- Wire up ---------- */
    var builders = { hero: hero, print: print, arabic: arabic, cards: cards, ai: ai, find: find, sunset: sunset, lock: lock, payoff: payoff };
    $$('[data-demo]').forEach(function (el) {
        var name = el.getAttribute('data-demo'), D = new Demo(el, builders[name]);
        if (name === 'payoff') D.fresh = true; /* measure at the moment it plays: the rail dot moves */
        demos.push(D);
    });

    /* flip cards on tap / Enter / Space */
    $$('#d-cards .flip').forEach(function (f) {
        function tog() { f.parentNode.classList.toggle('flipped'); }
        f.addEventListener('click', function () { if (!matchMedia('(hover: hover)').matches) tog(); });
        f.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tog(); } });
    });

    if (!motionOK) return;
    function start() {
        R.classList.remove('lab-wait');
        window.addEventListener('scroll', queue, { passive: true });
        window.addEventListener('resize', queue);
        check();
    }
    var started = false;
    function go() { if (!started) { started = true; start(); } }
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(go); else go();
    setTimeout(go, 1000); /* never wait longer than this for fonts */
})();
