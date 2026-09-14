/*
  LeelineSports site behaviour — shared by every page.
  Vanilla JS, no framework runtime. Handles: scroll reveal, hero entrance,
  eased stat counters, nav scroll state, hero watermark parallax, mobile menu.
*/
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('cw-js');

  // ── scroll reveal ───────────────────────────────────────
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  const done = (el) => el.classList.add('is-done');

  if (reduce) {
    revealEls.forEach((el) => { el.classList.add('is-in'); done(el); });
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add('is-in');
          const finish = () => done(el);
          el.addEventListener('animationend', finish, { once: true });
          setTimeout(() => done(el), 1800);
          io.unobserve(el);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ── hero entrance ───────────────────────────────────────
  // will-change is granted for the duration of the entrance and handed back
  // afterwards — leaving it on the elements permanently pins a compositor
  // layer for the whole session.
  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const heroItems = Array.from(hero.querySelectorAll('.cw-hero-item'));
    const release = () => heroItems.forEach((el) => { el.style.willChange = ''; });

    if (reduce) {
      hero.classList.add('is-in');
    } else {
      heroItems.forEach((el) => { el.style.willChange = 'opacity, transform'; });
      requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-in')));
      setTimeout(release, 1500);
      heroItems[heroItems.length - 1]?.addEventListener('transitionend', release, { once: true });
    }
  }

  // ── eased stat counters ─────────────────────────────────
  const counters = Array.from(document.querySelectorAll('[data-count]'));
  const fmt = (n, d) => (d > 0 ? n.toFixed(d) : Math.round(n).toLocaleString('en-US'));
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const d = parseInt(el.dataset.decimals || '0', 10);
    const dur = 1500;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(target * eased, d);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target, d);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (reduce) {
      counters.forEach((el) => {
        el.textContent = fmt(parseFloat(el.dataset.count), parseInt(el.dataset.decimals || '0', 10));
      });
    } else {
      const cIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCount(entry.target);
            cIO.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => cIO.observe(el));
    }
  }

  // ── nav scroll state ────────────────────────────────────
  const nav = document.getElementById('site-nav');
  const onScroll = () => nav && nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── hero watermark parallax ─────────────────────────────
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  if (parallaxEls.length && !reduce) {
    let ticking = false;
    const apply = () => {
      const y = window.scrollY;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0.1');
        el.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(apply); ticking = true; }
    }, { passive: true });
  }

  // ── showcase ring ───────────────────────────────────────
  // Cards sit on an arc; the buttons under the rail rotate it one step at a
  // time. Without this the markup is a plain row.
  const stage = document.querySelector('[data-showcase-stage]');
  const ring = document.querySelector('[data-showcase-ring]');
  if (stage && ring) {
    const items = Array.from(ring.children);
    const total = items.length;
    const prevBtn = document.querySelector('[data-showcase-prev]');
    const nextBtn = document.querySelector('[data-showcase-next]');

    if (total > 1) {
      // 30° per card on a radius of two card widths keeps the arc open enough
      // that no card is ever partly hidden behind the one in front of it.
      const stepAngle = 30;
      const EASE = 0.14;
      let target = 0;
      let current = 0;
      let frame = 0;
      let last = 0;

      const radius = () => Math.round((items[0].offsetWidth || 240) * 2);

      const render = (pos) => {
        const r = radius();
        items.forEach((item, i) => {
          let delta = ((i - pos) % total + total) % total;
          if (delta > total / 2) delta -= total;
          const away = Math.abs(delta);
          // Faded out by ~2.8 cards, so the two cards on the far side of the arc
          // are gone before their foreshortened shapes can cross each other.
          const opacity = Math.max(0, 1 - away * 0.36);
          const scale = Math.max(0.55, 1.06 - away * 0.2);
          item.style.transform = `rotateY(${delta * stepAngle}deg) translateZ(${r}px) scale(${scale})`;
          item.style.opacity = String(opacity);
          item.style.zIndex = String(100 - Math.round(away));
          item.style.pointerEvents = opacity > 0.01 ? '' : 'none';
        });
      };

      const tick = (now) => {
        const dt = Math.min(48, now - (last || now));
        last = now;
        const gap = target - current;
        if (Math.abs(gap) < 0.002) {
          current = target;
          render(current);
          frame = 0;
          last = 0;
          return;
        }
        // time-based so the easing feels the same on a 60Hz and a 120Hz display
        current += gap * (reduce ? 1 : 1 - Math.pow(1 - EASE, dt / 16.7));
        render(current);
        frame = requestAnimationFrame(tick);
      };
      const run = () => { if (!frame) frame = requestAnimationFrame(tick); };

      // Position every card before switching the layout to 3D, so the first
      // paint is already a ring instead of animating out of a flat row.
      render(0);
      stage.classList.add('is-3d');

      if (prevBtn) prevBtn.addEventListener('click', () => { target = Math.round(target) - 1; run(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { target = Math.round(target) + 1; run(); });
      window.addEventListener('resize', () => render(current));
    }
  }

  // ── process step selection ──────────────────────────────
  // The cream plate + berry hairline is a selection, not decoration: it starts
  // on Sampling and moves to whichever stage is clicked, so exactly one row
  // carries the accent at a time.
  const rows = Array.from(document.querySelectorAll('[data-process-row]'));
  if (rows.length) {
    const select = (row) => {
      rows.forEach((r) => {
        const on = r === row;
        r.classList.toggle('cw-process-row--accent', on);
        if (on) r.setAttribute('aria-current', 'true');
        else r.removeAttribute('aria-current');
      });
    };
    rows.forEach((row) => {
      row.addEventListener('click', () => select(row));
      row.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        select(row);
      });
    });
  }

  // ── mobile menu ─────────────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.parentElement.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        menu.parentElement.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
