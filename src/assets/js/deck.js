/* Your Memories — swipe card deck (mobile).
 *
 * The design stacks the notes as a fanned deck: the top three are visible,
 * the rest sit behind at zero opacity. Tapping or swiping the top card sends
 * it to the back and brings the next one forward.
 *
 * The per-depth transforms are lifted from the design rather than derived, so
 * the fan matches it exactly. Depth is the card's distance from the top of
 * the stack, not its position in the DOM.
 */
(function () {
  'use strict';

  /* rotation by depth, in degrees — from the design */
  var ROTATE = [-0.84, 1.54, -2.52, 3.08, -4.2, 4.62, -5.88, 6.16, -7.56];
  var VISIBLE = 3;        /* how many cards are shown at once */
  var SWIPE_PX = 60;      /* drag distance that counts as a swipe */

  function styleFor(depth, total) {
    var rot = ROTATE[Math.min(depth, ROTATE.length - 1)];
    return {
      transform: 'translate(' + (depth * 3) + 'px, ' + (depth * 12) + 'px) ' +
                 'rotate(' + rot + 'deg) scale(' + (1 - depth * 0.03).toFixed(2) + ')',
      opacity: depth < VISIBLE ? '1' : '0',
      zIndex: String(Math.max(1, total + 11 - depth))
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    var deck = document.querySelector('.fa-deck');
    if (!deck) return;
    var cards = [].slice.call(deck.querySelectorAll('.fa-deck__card'));
    if (cards.length < 2) return;

    var top = 0;

    function render() {
      cards.forEach(function (card, i) {
        var depth = (i - top + cards.length) % cards.length;
        var s = styleFor(depth, cards.length);
        card.style.transform = s.transform;
        card.style.opacity = s.opacity;
        card.style.zIndex = s.zIndex;
        card.style.pointerEvents = depth === 0 ? 'auto' : 'none';
        card.setAttribute('aria-hidden', depth === 0 ? 'false' : 'true');
      });
    }

    function advance() {
      top = (top + 1) % cards.length;
      render();
    }

    /* tap anywhere on the top card */
    deck.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;   /* let real links work */
      advance();
    });

    /* drag / swipe */
    var startX = null, startY = null, dragging = false;
    deck.addEventListener('pointerdown', function (e) {
      startX = e.clientX; startY = e.clientY; dragging = true;
    });
    deck.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var card = cards[top];
      if (Math.abs(dx) > 4) {
        card.style.transition = 'none';
        card.style.transform = 'translate(' + dx + 'px, 0) rotate(' + (dx / 24) + 'deg)';
      }
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      var dx = (e.clientX || 0) - startX;
      var dy = (e.clientY || 0) - startY;
      cards[top].style.transition = '';
      if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) advance();
      else render();
    }
    deck.addEventListener('pointerup', endDrag);
    deck.addEventListener('pointercancel', endDrag);
    deck.addEventListener('pointerleave', endDrag);

    /* keyboard: the deck is focusable so it can be advanced without a pointer */
    deck.setAttribute('tabindex', '0');
    deck.setAttribute('role', 'group');
    deck.setAttribute('aria-label', 'Shared notes — press the right arrow for the next note');
    deck.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' ||
          e.key === ' ' || e.key === 'Enter') { e.preventDefault(); advance(); }
    });

    render();
  });
})();
