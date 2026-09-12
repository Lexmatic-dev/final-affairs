/* Final Record — mobile chapters.
 *
 * On a phone the record is split into nine chapters behind a sticky tab
 * strip, one chapter showing at a time. The tabs ship as plain anchor links
 * to each chapter, so with no JavaScript every chapter simply stacks down the
 * page and the links jump between them. This script upgrades that: one
 * chapter at a time, arrow keys along the strip, and the hash kept in sync so
 * a chapter can be linked to.
 *
 * It also drives the small bits of state inside the chapters — the
 * expand/collapse rows, the share-a-memory forms, "show more memories" and
 * the family tree's selected person. Same rule as the tabs and as reveal.js:
 * nothing is hidden until this script is running and can show it again.
 */
(function () {
  'use strict';

  var HEADER = 84; /* .fa-header-m is sticky and this tall; the strip sits under it */

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  function init() {
    var root = document.querySelector('.fa-rm');
    if (!root) return;
    tabs(root);
    toggles(root);
    compose(root);
    more(root);
    family(root);
  }

  /* ---- Chapters ---------------------------------------------------------- */

  function tabs(root) {
    var list = root.querySelector('[role="tablist"]');
    if (!list) return;
    var tabEls = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    var panels = tabEls.map(function (t) {
      return document.getElementById(t.getAttribute('aria-controls'));
    });
    if (!tabEls.length || panels.indexOf(null) !== -1) return;
    var hero = root.querySelector('.fa-rm-hero');

    function activate(i, scroll) {
      tabEls.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      /* The portrait only heads the first chapter, as in the design. */
      if (hero) hero.hidden = i !== 0;

      /* Keep the chosen tab in view along the strip. */
      var r = tabEls[i].getBoundingClientRect();
      var l = list.getBoundingClientRect();
      if (r.left < l.left || r.right > l.right) {
        list.scrollLeft += r.left - l.left - (l.width - r.width) / 2;
      }

      if (!scroll) return;
      if (i === 0) { window.scrollTo(0, 0); return; }
      var top = list.getBoundingClientRect().top + window.pageYOffset - HEADER;
      window.scrollTo(0, Math.max(0, top));
    }

    function fromHash() {
      var id = window.location.hash.slice(1);
      for (var i = 0; i < panels.length; i++) {
        if (panels[i].id === id) return i;
      }
      return -1;
    }

    function go(i) {
      activate(i, true);
      tabEls[i].focus();
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#' + panels[i].id);
      }
    }

    tabEls.forEach(function (tab, i) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        go(i);
      });
    });

    list.addEventListener('keydown', function (e) {
      var cur = tabEls.indexOf(document.activeElement);
      if (cur === -1) return;
      var next;
      if (e.key === 'ArrowRight') next = (cur + 1) % tabEls.length;
      else if (e.key === 'ArrowLeft') next = (cur - 1 + tabEls.length) % tabEls.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabEls.length - 1;
      else return;
      e.preventDefault();
      go(next);
    });

    window.addEventListener('hashchange', function () {
      var i = fromHash();
      if (i !== -1) activate(i, true);
    });

    var start = fromHash();
    activate(start === -1 ? 0 : start, false);
  }

  /* ---- Expand / collapse rows ------------------------------------------- */

  function toggles(root) {
    each(root.querySelectorAll('[data-toggle][aria-controls]'), function (btn) {
      var body = document.getElementById(btn.getAttribute('aria-controls'));
      if (!body) return;
      body.hidden = btn.getAttribute('aria-expanded') !== 'true';
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        body.hidden = open;
      });
    });
  }

  /* ---- Share a memory / note to the family ------------------------------ */

  function compose(root) {
    each(root.querySelectorAll('.fa-rm-compose'), function (box) {
      var choices = box.querySelector('.fa-rm-compose__choices');
      var forms = box.querySelectorAll('.fa-rm-compose__form');
      if (!choices || !forms.length) return;
      each(forms, function (f) { f.hidden = true; });

      box.addEventListener('click', function (e) {
        var open = e.target.closest('[data-compose-open]');
        var close = e.target.closest('[data-compose-close]');
        if (open) {
          var want = open.getAttribute('data-compose-open');
          var target = null;
          each(forms, function (f) {
            var hit = f.getAttribute('data-compose') === want;
            f.hidden = !hit;
            if (hit) target = f;
          });
          if (!target) return;
          choices.hidden = true;
          var field = target.querySelector('textarea');
          if (field) field.focus();
        } else if (close) {
          each(forms, function (f) { f.hidden = true; });
          choices.hidden = false;
        }
      });
    });
  }

  /* ---- Show more memories ------------------------------------------------ */

  function more(root) {
    each(root.querySelectorAll('[data-more]'), function (btn) {
      var target = document.getElementById(btn.getAttribute('data-more'));
      if (!target) return;
      var lessLabel = btn.getAttribute('data-more-less');
      var moreLabel = btn.textContent;
      target.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function () {
        var open = target.hidden;
        target.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (lessLabel) btn.textContent = open ? lessLabel : moreLabel;
      });
    });
  }

  /* ---- Family tree: tap a name ------------------------------------------- */

  function family(root) {
    var tree = root.querySelector('.fa-rm-tree');
    if (!tree) return;
    var chips = tree.querySelectorAll('.fa-rm-chip[data-person]');
    var cards = tree.querySelectorAll('.fa-rm-person[data-person]');
    if (!chips.length || !cards.length) return;

    function select(key) {
      each(chips, function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-person') === key ? 'true' : 'false');
      });
      each(cards, function (c) {
        c.hidden = c.getAttribute('data-person') !== key;
      });
    }

    var first = tree.querySelector('.fa-rm-chip[aria-pressed="true"]') || chips[0];
    select(first.getAttribute('data-person'));
    each(chips, function (c) {
      c.addEventListener('click', function () { select(c.getAttribute('data-person')); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
