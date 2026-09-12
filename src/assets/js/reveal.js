/* Scroll reveal.
 *
 * The designs fade sections in as they scroll into view. The CSS that does it
 * parks elements at opacity 0, which means that without this script the
 * content is invisible — permanently, not just until it scrolls into view.
 *
 * So the hiding is opt-in: the CSS only hides while `js-reveal` is on <html>,
 * and this script adds that class only once it knows it can take them back
 * out again. No JavaScript, an old browser, or a script error, and everything
 * simply renders visible.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  /* `in` is not enough — the property can exist but be unusable. */
  if (typeof window.IntersectionObserver !== 'function') return;

  root.classList.add('js-reveal');

  /* The mission headline rises a word at a time. Each word waits on an `on`
     class; without it the whole statement stays at opacity 0, so every
     typewriter that gets hidden must also get played. */
  function play(tw) {
    tw.querySelectorAll('[data-w]').forEach(function (w, i) {
      window.setTimeout(function () { w.classList.add('on'); }, i * 55);
    });
  }

  function show(el) {
    if (el.hasAttribute('data-typewriter')) play(el);
    else el.setAttribute('data-reveal', 'in');
  }

  function start() {
    var targets = document.querySelectorAll('[data-reveal], [data-typewriter]');
    if (!targets.length) { root.classList.remove('js-reveal'); return; }

    var io;
    try {
      io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      targets.forEach(function (el) { io.observe(el); });
    } catch (e) {
      /* anything unexpected: stop hiding, show the page */
      root.classList.remove('js-reveal');
      return;
    }

    /* Safety net: if anything goes wrong, show everything after 3s rather
       than leave the page half-empty. A display:none block (the markup for
       the other breakpoint) measures as 0 and so is played too — harmless,
       and it means a resize past 1280px never uncovers hidden words. */
    window.setTimeout(function () {
      document.querySelectorAll('[data-reveal]:not([data-reveal="in"]), [data-typewriter]').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.5) show(el);
      });
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
