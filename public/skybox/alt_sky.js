AFRAME.registerComponent('skybox-box', {
schema: {
path: {type: 'string', default: './skybox/'},
ext:  {type: 'string', default: '.jpg'},
// per-face rotation (radians)
rotTop:    {type: 'number', default: 0},            // +Y
rotBottom: {type: 'number', default: 0},            // -Y
size:      {type: 'number', default: 1000},         // cube size
// If your pack mislabeled up/down, flip them:
swapUpDown:{type: 'boolean', default: false}
},

init() {
const scene = this.el.sceneEl.object3D;
const loader = new THREE.TextureLoader();
const center = new THREE.Vector2(0.5, 0.5);
const {path, ext, rotTop, rotBottom, size, swapUpDown} = this.data;

// Expected file names (you can change these if your pack uses other names)
const names = {
px: 'graycloud_rt', // +X (right)
nx: 'graycloud_lf', // -X (left)
py: 'graycloud_up', // +Y (top)
ny: 'graycloud_dn', // -Y (bottom)
pz: 'graycloud_bk', // +Z (front)
nz: 'graycloud_ft'  // -Z (back)
};

// Optionally swap up/down if mislabeled
if (swapUpDown) {
[names.py, names.ny] = [names.ny, names.py];
}

const makeFace = (filename, rotation=0) => {
const tex = loader.load(path + filename + ext);
tex.center.copy(center);
tex.rotation = rotation;
tex.needsUpdate = true;
return new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide });
};

// Materials order for BoxGeometry: [px, nx, py, ny, pz, nz]
const mats = [
makeFace(names.px, 0),          // +X
makeFace(names.nx, 0),          // -X
makeFace(names.py, rotTop),     // +Y (top)    ← rotate here
makeFace(names.ny, rotBottom),  // -Y (bottom) ← and here
makeFace(names.pz, 0),          // +Z
makeFace(names.nz, 0)           // -Z
];

const geo = new THREE.BoxGeometry(size, size, size);
this.mesh = new THREE.Mesh(geo, mats);
scene.add(this.mesh);
},

remove() {
if (!this.mesh) return;
this.el.sceneEl.object3D.remove(this.mesh);
this.mesh.geometry.dispose();
this.mesh.material.forEach(m => m.map && m.map.dispose());
}
});

