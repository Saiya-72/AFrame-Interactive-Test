AFRAME.registerComponent('slide-on-click', {
  schema: { to: { type: 'vec3' } },

  init: function () {
    const el = this.el;

    el.addEventListener('click', () => {
      const dest = this.data.to;
      console.log('[slide-on-click] click, dest = ', dest);

      if (!dest || dest.x === undefined) {
        console.warn('[slide-on-click] Invalid or missing "to" vec3 on', el);
        return;
      }

      // remove + re-add so repeated clicks retrigger
      el.removeAttribute('animation__slide');

      el.setAttribute('animation__slide', {
        property: 'position',
        to: `${dest.x} ${dest.y} ${dest.z}`,
        dur: 800,
        easing: 'easeOutQuad'
      });
    });
  }
});
