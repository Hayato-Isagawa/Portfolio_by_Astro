import { THREE, OrbitControls, generateCanvas } from "./Setting.js";

const canvas = generateCanvas();
let renderer, scene, camera, controls;

const init = () => {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight);
  camera.position.set(0, 0, 10);
  controls = new OrbitControls(camera, canvas);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  const sphere = new THREE.SphereGeometry();
  const material = new THREE.MeshStandardMaterial();
  const mesh = new THREE.Mesh(sphere, material);
  scene.add(mesh);

  render();
}

const render = () => {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update();
};

init();

