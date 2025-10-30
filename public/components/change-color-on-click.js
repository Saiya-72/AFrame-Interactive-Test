AFRAME.registerComponent('change-color-on-click', {
init: function () {
    const el = this.el;

    el.addEventListener('click', function () {
    // Pick a random color
    const newColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    el.setAttribute('material', 'color', newColor);
    console.log('Box clicked, color set to', newColor);
    });
}
});