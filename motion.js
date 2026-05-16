/* ── Motion / reveal helpers ──────────────────────────────────
 * Three effects:
 *   1. Count-up for [data-countup] (number in text node)
 *   2. Width fill for [data-fill]   (target width, e.g. "93%")
 *   3. Fade-up reveal for [data-reveal] (opacity + 16px translate)
 *
 * All effects are triggered when the element first enters the viewport.
 * Respects prefers-reduced-motion: applies final state immediately.
 *
 * Stagger: any child of a [data-reveal-stagger] container gets
 *   `--reveal-delay: ${i * 70}ms` set on it, used by the CSS transition.
 * ─────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    const target = parseFloat(el.dataset.countup);
    if (isNaN(target)) return;
    const duration = 1100;
    const start = performance.now();
    const isInt = Number.isInteger(target);
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const v = target * eased;
      el.textContent = isInt ? String(Math.round(v)) : (Math.round(v * 10) / 10).toString();
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = String(target);
    }
    requestAnimationFrame(tick);
  }

  function fillBar(el) {
    const target = el.dataset.fill;
    // Reflow to lock starting width, then transition to target.
    el.style.width = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.width = target;
    }));
  }

  function applyStaggerDelays() {
    document.querySelectorAll('[data-reveal-stagger]').forEach(container => {
      const step = parseInt(container.dataset.revealStep || '70', 10);
      let idx = 0;
      container.querySelectorAll(':scope > [data-reveal]').forEach(el => {
        if (!el.style.getPropertyValue('--reveal-delay')) {
          el.style.setProperty('--reveal-delay', (idx * step) + 'ms');
        }
        idx++;
      });
    });
  }

  function init() {
    applyStaggerDelays();

    const countEls = document.querySelectorAll('[data-countup]');
    const fillEls  = document.querySelectorAll('[data-fill]');
    const revealEls = document.querySelectorAll('[data-reveal]');

    if (reduce) {
      countEls.forEach(el => { el.textContent = el.dataset.countup; });
      fillEls.forEach(el => { el.style.width = el.dataset.fill; });
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }

    // Initial state for fills: collapse to 0 before observer fires
    fillEls.forEach(el => { el.style.width = '0%'; });
    // Initial state for countup: zero out the visible number
    countEls.forEach(el => { el.textContent = '0'; });

    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        el.classList.add('is-visible');
        if (el.hasAttribute('data-countup')) countUp(el);
        if (el.hasAttribute('data-fill'))    fillBar(el);
        io.unobserve(el);
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    countEls.forEach(el => io.observe(el));
    fillEls.forEach(el => io.observe(el));
    revealEls.forEach(el => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
