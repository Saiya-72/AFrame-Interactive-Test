AFRAME.registerComponent('toggle-target-on-click', {
  schema: { target: { type: 'selector' } },

  init: function () {
    const el = this.el;

    el.addEventListener('click', () => {
      const targetEl = this.data.target;
      if (!targetEl) {
        console.warn('[toggle-target-on-click] No target found for', el);
        return;
      }

      const isVisible = targetEl.getAttribute('visible');
      targetEl.setAttribute('visible', !isVisible);
      console.log('Toggled visibility. Was:', isVisible, 'Now:', !isVisible);
    });
  }
});
