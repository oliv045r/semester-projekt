// src/directives/v-gesture.js
import Hammer from 'hammerjs';

export default {
  mounted(el, binding) {
    const hammer = new Hammer(el);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammer.on('swipeleft', () => {
      binding.value('left');
    });

    hammer.on('swiperight', () => {
      binding.value('right');
    });
  },
  unmounted(el) {
    Hammer(el).off('swipeleft swiperight');
  }
};