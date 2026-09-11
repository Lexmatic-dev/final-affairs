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

  function start() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) { root.classList.remove('js-reveal'); return; }

    var io;
    try {
      io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-reveal', 'in');
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
       than leave the page half-empty. */
    window.setTimeout(function () {
      document.querySelectorAll('[data-reveal]:not([data-reveal="in"])').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.5) el.setAttribute('data-reveal', 'in');
      });
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
