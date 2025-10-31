AFRAME.registerComponent('skybox-box', {
  schema: {
    path:       {type: 'string', default: './skybox/'},
    ext:        {type: 'string', default: '.jpg'},
    rotTop:     {type: 'number', default: 0},     // radians for +Y face
    rotBottom:  {type: 'number', default: 0},     // radians for -Y face
    size:       {type: 'number', default: 1000},  // cube size
    swapUpDown: {type: 'boolean', default: false}
  },

  init() {
    this._onSceneLoaded = () => {
      const scene = this.el.sceneEl.object3D;
      const loader = new THREE.TextureLoader();
      const center = new THREE.Vector2(0.5, 0.5);
      const data = this.data;
      const {path, ext, rotTop, rotBottom, size, swapUpDown} = data;

      // Filenames for each cube face
      const names = {
        px: 'bluecloud_rt', // +X (right)
        nx: 'bluecloud_lf', // -X (left)
        py: 'bluecloud_up', // +Y (top)
        ny: 'bluecloud_dn', // -Y (bottom)
        pz: 'bluecloud_bk', // +Z (front)
        nz: 'bluecloud_ft'  // -Z (back)
      };

      // swap top/bottom if needed
      if (swapUpDown) {
        [names.py, names.ny] = [names.ny, names.py];
      }

      const makeFace = (filename, rotation = 0) => {
        const tex = loader.load(path + filename + ext);
        tex.center.copy(center);
        tex.rotation = rotation;
        tex.needsUpdate = true;
        return new THREE.MeshBasicMaterial({
          map: tex,
          side: THREE.BackSide
        });
      };

      // Materials go in this order for BoxGeometry:
      //  [px, nx, py, ny, pz, nz]
      const mats = [
        makeFace(names.px, 0),         // +X
        makeFace(names.nx, 0),         // -X
        makeFace(names.py, rotTop),    // +Y (top)
        makeFace(names.ny, rotBottom), // -Y (bottom)
        makeFace(names.pz, 0),         // +Z
        makeFace(names.nz, 0)          // -Z
      ];

      const geo = new THREE.BoxGeometry(size, size, size);
      this.mesh = new THREE.Mesh(geo, mats);
      scene.add(this.mesh);
    };

    // run now or wait for scene load
    if (this.el.sceneEl.hasLoaded) {
      this._onSceneLoaded();
    } else {
      this.el.sceneEl.addEventListener('loaded', this._onSceneLoaded);
    }
  },

  remove() {
    // clean up listener
    if (this._onSceneLoaded) {
      this.el.sceneEl.removeEventListener('loaded', this._onSceneLoaded);
    }

    if (!this.mesh) return;

    this.el.sceneEl.object3D.remove(this.mesh);

    // dispose resources
    this.mesh.geometry.dispose();
    this.mesh.material.forEach(m => {
      if (m.map) {
        m.map.dispose();
      }
      m.dispose();
    });

    this.mesh = null;
  }
});
