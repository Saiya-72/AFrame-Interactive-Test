AFRAME.registerComponent('smooth-look', {
  schema: {
    yawFactor:   {type: 'number', default: 0.4}, // lower = slower horizontal turn
    pitchFactor: {type: 'number', default: 0.4}, // lower = slower vertical turn
    pitchClamp:  {type: 'number', default: 80}   // prevent flipping upside down
  },

  init: function () {
    // We'll take over mousemove handling from look-controls, but still use its yaw/pitch objects.
    this.lookControls = this.el.components['look-controls'];
    if (!this.lookControls) {
      console.warn('[smooth-look] needs look-controls on same entity');
      return;
    }

    this._onMouseMove = this._onMouseMove.bind(this);
    this.mouseDown = false;

    window.addEventListener('mousedown', () => { this.mouseDown = true; });
    window.addEventListener('mouseup',   () => { this.mouseDown = false; });
    window.addEventListener('mousemove', this._onMouseMove);
  },

  _onMouseMove: function (evt) {
    // only rotate when mouse is down OR pointer locked
    const lc = this.lookControls;
    if (!lc || !lc.yawObject || !lc.pitchObject) return;

    // pointerLockEnabled defaults to true -> if pointer is locked, always rotate.
    const pointerLocked = document.pointerLockElement === this.el.sceneEl.canvas;
    if (!pointerLocked && !this.mouseDown) return;

    const dx = evt.movementX || evt.mozMovementX || evt.webkitMovementX || 0;
    const dy = evt.movementY || evt.mozMovementY || evt.webkitMovementY || 0;

    // scale by our factors
    const yaw   = lc.yawObject.rotation;
    const pitch = lc.pitchObject.rotation;

    yaw.y   -= dx * 0.002 * this.data.yawFactor;
    pitch.x -= dy * 0.002 * this.data.pitchFactor;

    // clamp pitch to avoid going upside down
    const clampRad = this.data.pitchClamp * (Math.PI/180);
    if (pitch.x < -clampRad) pitch.x = -clampRad;
    if (pitch.x >  clampRad) pitch.x =  clampRad;
  },

  remove: function () {
    window.removeEventListener('mousemove', this._onMouseMove);
  }
});

