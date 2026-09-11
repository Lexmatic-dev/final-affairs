/* Final Record chapter tabs (mobile).
 *
 * The mobile record is one chapter at a time: a sticky strip of nine tabs
 * over nine panels. The desktop layout has no tabs — it stacks every section
 * down one column — so this only ever finds work to do in the mobile markup.
 *
 * Every panel ships in the page, and the `hidden` attribute does the hiding,
 * so with no JavaScript the record still reads: all nine chapters render in
 * order. Nothing here can leave content permanently invisible — the script
 * only starts hiding once it knows it can show panels again.
 *
 * Keyboard: the strip follows the tabs pattern — arrows move between tabs,
 * Home/End jump to the ends.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var list = document.querySelector('[role="tablist"]');
    if (!list) return;

    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function panelFor(tab) {
      return document.getElementById(tab.getAttribute('aria-controls'));
    }

    /* Only hide panels once we know we can unhide them again. */
    var panels = tabs.map(panelFor);
    if (panels.some(function (p) { return !p; })) return;

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panelFor(t).hidden = !on;
      });
      if (focus) tab.focus();
      /* a chapter change starts at the top of that chapter */
      var strip = list.getBoundingClientRect();
      if (strip.top < 0) list.scrollIntoView({ block: 'start' });
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    tabs.forEach(function (tab, i) {
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var j = null;
        if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = tabs.length - 1;
        if (j === null) return;
        e.preventDefault();
        select(tabs[j], true);
      });
    });

    /* Hide everything but the selected panel — the first thing that proves
       the script is running. */
    var current = tabs.filter(function (t) {
      return t.getAttribute('aria-selected') === 'true';
    })[0] || tabs[0];
    tabs.forEach(function (t) { panelFor(t).hidden = t !== current; });
  });
})();
