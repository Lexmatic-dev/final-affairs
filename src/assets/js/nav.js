/* Mobile navigation drawer.
 *
 * The drawer markup ships in every page, hidden. This opens and closes it,
 * keeps focus inside while open, and restores focus to the hamburger on
 * close. Desktop never shows it — CSS hides it above the breakpoint — so the
 * script also closes it if the viewport grows past that point.
 */
(function () {
  'use strict';

  var DESKTOP = 1280;

  document.addEventListener('DOMContentLoaded', function () {
    var drawer = document.querySelector('.fa-drawer');
    var burger = document.querySelector('.fa-burger');
    if (!drawer || !burger) return;

    var panel = drawer.querySelector('.fa-drawer__panel');
    var scrim = drawer.querySelector('.fa-drawer__scrim');
    var closeBtn = drawer.querySelector('.fa-drawer__close');

    function focusable() {
      return panel.querySelectorAll('a[href], button:not([disabled])');
    }

    function open() {
      drawer.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var f = focusable();
      if (f.length) f[0].focus();
      document.addEventListener('keydown', onKey);
    }

    function close() {
      drawer.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      burger.focus();
    }

    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = focusable();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    burger.addEventListener('click', function () {
      if (drawer.hidden) open(); else close();
    });
    if (scrim) scrim.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);

    window.addEventListener('resize', function () {
      if (!drawer.hidden && window.innerWidth >= DESKTOP) close();
    });
  });
})();
