AFRAME.registerComponent('arrow-look', {
  schema: {
    yawSpeed:   {type: 'number', default: 180}, // deg/sec left-right
    pitchSpeed: {type: 'number', default: 180}  // deg/sec up-down
  },

  init: function () {
    this.state = { left:false, right:false, up:false, down:false };

    this.onKeyDown = e => {
      if (e.code === 'ArrowLeft')  { e.preventDefault(); this.state.left  = true; }
      if (e.code === 'ArrowRight') { e.preventDefault(); this.state.right = true; }
      if (e.code === 'ArrowUp')    { e.preventDefault(); this.state.up    = true; }
      if (e.code === 'ArrowDown')  { e.preventDefault(); this.state.down  = true; }
    };

    this.onKeyUp = e => {
      if (e.code === 'ArrowLeft')  { e.preventDefault(); this.state.left  = false; }
      if (e.code === 'ArrowRight') { e.preventDefault(); this.state.right = false; }
      if (e.code === 'ArrowUp')    { e.preventDefault(); this.state.up    = false; }
      if (e.code === 'ArrowDown')  { e.preventDefault(); this.state.down  = false; }
    };

    window.addEventListener('keydown', this.onKeyDown, {passive:false});
    window.addEventListener('keyup',   this.onKeyUp,   {passive:false});
  },

  tick: function (time, dt) {
    const dsec = dt / 1000;
    const rigEl = this.el.parentEl;
    if (!rigEl) return;

    // ----- YAW (left/right): turn the rig -----
    // Read rig yaw in degrees.
    const rigRot = rigEl.getAttribute('rotation'); // {x,y,z}
    const yawDeltaDeg =
      (this.state.left  ?  this.data.yawSpeed  * dsec : 0) +
      (this.state.right ? -this.data.yawSpeed  * dsec : 0);

    rigRot.y += yawDeltaDeg;
    rigEl.setAttribute('rotation', rigRot);

    // ----- PITCH (up/down): tilt ONLY the camera -----
    // Work directly in radians for camera pitch.
    const camRotObj = this.el.object3D.rotation; // {x,y,z} in radians
    const pitchDeltaDeg =
      (this.state.down ?  this.data.pitchSpeed * dsec : 0) +
      (this.state.up   ? -this.data.pitchSpeed * dsec : 0);

    const pitchDeltaRad = pitchDeltaDeg * (Math.PI / 180);

    camRotObj.x += pitchDeltaRad;
    // NOTE: no clamp at all now
  },

  remove: function () {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup',   this.onKeyUp);
  }
});
