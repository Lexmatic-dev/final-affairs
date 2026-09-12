/* Final Record search — Your Memories page.
 *
 * The site is static, so there is no search backend. RECORDS below is the
 * list of published Final Records; a name match sends the visitor to that
 * record's page. Add an entry here when a new Final Record page is added.
 *
 * Matching is loose on purpose: a visitor looking for "Eleanor Vance" or just
 * "eleanor" should find the record without typing it exactly.
 *
 * The page carries the search twice — once in the desktop markup, once in
 * the mobile markup — so this binds every [data-record-search] it finds
 * rather than a single pair of ids. Ids are unique per document, so the old
 * id-based lookup only ever wired the desktop copy and the mobile search did
 * nothing at all. Any further copy of the search works by marking it up:
 *
 *   [data-record-search]   the block holding one search
 *     [data-record-name]     the name input
 *     [data-record-submit]   the button or link that runs it
 *     [data-record-status]   optional: where a miss is reported
 */
(function () {
  'use strict';

  var RECORDS = [
    { names: ['eleanor', 'eleanor vance', 'eleanor ruth vance', 'vance'],
      href: 'final-record.html' }
  ];

  function normalise(s) {
    return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function findRecord(query) {
    var q = normalise(query);
    if (!q) return null;
    for (var i = 0; i < RECORDS.length; i++) {
      var names = RECORDS[i].names;
      for (var j = 0; j < names.length; j++) {
        if (names[j].indexOf(q) !== -1 || q.indexOf(names[j]) !== -1) {
          return RECORDS[i];
        }
      }
    }
    return null;
  }

  function wire(root) {
    var name = root.querySelector('[data-record-name]');
    var button = root.querySelector('[data-record-submit]');
    var status = root.querySelector('[data-record-status]');
    if (!name || !button) return;

    function search(event) {
      if (event) event.preventDefault();
      var hit = findRecord(name.value);
      if (hit) {
        window.location.href = hit.href;
        return;
      }
      if (status) {
        status.textContent = name.value.trim()
          ? 'No Final Record found for that name.'
          : 'Enter a name to search for a Final Record.';
        status.hidden = false;
      }
    }

    button.addEventListener('click', search);
    name.addEventListener('input', function () {
      if (status) status.hidden = true;
    });
    name.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') search(e);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('[data-record-search]');
    Array.prototype.forEach.call(forms, wire);
  });
})();
