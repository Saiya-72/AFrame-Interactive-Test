AFRAME.registerComponent('toggle-target-on-click', {
schema: { target: { type: 'selector' } },

init: function () {
    const el = this.el;
    const targetEl = this.data.target;

    el.addEventListener('click', function () {
    const isVisible = targetEl.getAttribute('visible');
    targetEl.setAttribute('visible', !isVisible);
    });
}
});

