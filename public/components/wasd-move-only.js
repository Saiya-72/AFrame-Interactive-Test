AFRAME.registerComponent('wasd-move-only', {
  schema: { speed: {type: 'number', default: 10} }, // meters/sec

  init: function () {
    this.state = {w:false, a:false, s:false, d:false};

    this.onKeyDown = e => {
      if (e.code === 'KeyW') this.state.w = true;
      if (e.code === 'KeyA') this.state.a = true;
      if (e.code === 'KeyS') this.state.s = true;
      if (e.code === 'KeyD') this.state.d = true;
    };

    this.onKeyUp = e => {
      if (e.code === 'KeyW') this.state.w = false;
      if (e.code === 'KeyA') this.state.a = false;
      if (e.code === 'KeyS') this.state.s = false;
      if (e.code === 'KeyD') this.state.d = false;
    };

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup',   this.onKeyUp);

    this._moveDir = new THREE.Vector3();
  },

  tick: function (time, dt) {
    const dsec = dt / 1000;
    const rigObj = this.el.object3D;

    // Get current yaw (degrees -> radians)
    const rot = this.el.getAttribute('rotation'); // {x,y,z}
    const yawRad = THREE.MathUtils.degToRad(rot.y);

    // Forward (-Z in camera space) projected to ground:
    //   forward = (-sin(yaw), 0, -cos(yaw))
    const fwdX   = -Math.sin(yawRad);
    const fwdZ   = -Math.cos(yawRad);

    // Right is +90deg from forward:
    //   right = (cos(yaw), 0, -sin(yaw))
    // BUT notice we had this slightly mirrored before. Let's force:
    //   A = strafe LEFT  = -right
    //   D = strafe RIGHT = +right
    const rightX =  Math.cos(yawRad);
    const rightZ = -Math.sin(yawRad);

    // Build desired move dir in world XZ
    let x = 0;
    let z = 0;

    if (this.state.w) { x += fwdX;   z += fwdZ;   } // forward
    if (this.state.s) { x -= fwdX;   z -= fwdZ;   } // backward
    if (this.state.d) { x += rightX; z += rightZ; } // strafe right
    if (this.state.a) { x -= rightX; z -= rightZ; } // strafe left

    this._moveDir.set(x, 0, z);

    if (this._moveDir.lengthSq() === 0) return;

    this._moveDir.normalize(); // consistent speed in any direction

    const step = this.data.speed * dsec;
    rigObj.position.x += this._moveDir.x * step;
    rigObj.position.z += this._moveDir.z * step;
  },

  remove: function () {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup',   this.onKeyUp);
  }
});
