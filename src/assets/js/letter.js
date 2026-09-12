/* Write a letter dialog.
 *
 * The envelope on the wall and the mobile action-bar button both open it.
 * Same shape as the nav drawer: the markup ships hidden, this opens and
 * closes it, keeps focus inside while open, and restores focus to whichever
 * trigger was used.
 *
 * The dialog is hidden with the `hidden` attribute rather than opacity, so
 * with no JavaScript the page is simply the wall — nothing is left invisible
 * but present, and the triggers are real buttons that just do nothing.
 *
 * NOTE: there is no submit backend. `send()` below is where a real POST
 * belongs; until then the letter is not delivered anywhere.
 */
(function () {
  'use strict';

  var WORD_LIMIT = 25;

  function words(s) {
    var t = s.trim();
    return t ? t.split(/\s+/).length : 0;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var dialog = document.getElementById('fa-letter');
    var triggers = document.querySelectorAll('[data-letter-open]');
    if (!dialog || !triggers.length) return;

    var panel = dialog.querySelector('.fa-letter__panel');
    var form = dialog.querySelector('.fa-letter__form');
    var sent = dialog.querySelector('.fa-letter__sent');
    var body = document.getElementById('fa-letter-body');
    var count = document.getElementById('fa-letter-count');
    var submit = form.querySelector('.fa-letter__submit');
    var opener = null;

    function focusable() {
      return panel.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea'
      );
    }

    function tally() {
      var n = words(body.value);
      var over = n > WORD_LIMIT;
      count.textContent = n + ' / ' + WORD_LIMIT + ' words';
      count.setAttribute('data-over', over ? 'true' : 'false');
      submit.disabled = over;
    }

    function open(trigger) {
      opener = trigger;
      form.hidden = false;
      sent.hidden = true;
      dialog.setAttribute('aria-labelledby', 'fa-letter-title');
      dialog.hidden = false;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
      var f = focusable();
      /* skip the close button: land on the first real field */
      if (f.length > 1) f[1].focus(); else if (f.length) f[0].focus();
    }

    function close() {
      dialog.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      form.reset();
      tally();
      form.hidden = false;
      sent.hidden = true;
      if (opener) opener.focus();
      opener = null;
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

    function send() {
      /* No backend yet. A real submission goes here; until it exists the
         letter is not stored or delivered. */
      form.hidden = true;
      sent.hidden = false;
      dialog.setAttribute('aria-labelledby', 'fa-letter-sent-title');
      var b = sent.querySelector('button');
      if (b) b.focus();
    }

    Array.prototype.forEach.call(triggers, function (t) {
      t.addEventListener('click', function () { open(t); });
    });

    Array.prototype.forEach.call(
      dialog.querySelectorAll('[data-letter-close]'),
      function (el) { el.addEventListener('click', close); }
    );

    body.addEventListener('input', tally);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (words(body.value) > WORD_LIMIT) return;
      send();
    });

    tally();
  });
})();
