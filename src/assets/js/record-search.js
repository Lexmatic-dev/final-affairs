/* Final Record search — Your Memories page.
 *
 * The site is static, so there is no search backend. RECORDS below is the
 * list of published Final Records; a name match sends the visitor to that
 * record's page. Add an entry here when a new Final Record page is added.
 *
 * Matching is loose on purpose: a visitor looking for "Eleanor Vance" or just
 * "eleanor" should find the record without typing it exactly.
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

  document.addEventListener('DOMContentLoaded', function () {
    var name = document.getElementById('record-search-name');
    var button = document.getElementById('record-search-submit');
    var status = document.getElementById('record-search-status');
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
  });
})();
