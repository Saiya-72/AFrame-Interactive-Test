AFRAME.registerComponent('video-toggle-on-click', {
init: function () {
    const el = this.el;
    const videoEl = document.querySelector('#Video');

    el.addEventListener('click', function () {
    if (videoEl.paused) {
        videoEl.play();
        console.log('Video playing');
    } else {
        videoEl.pause();
        console.log('Video paused');
    }
    });
}
});