import { useEffect } from "react";
import { THREE, OrbitControls, generateCanvas, GLTFLoader } from "./Setting.js";

const ThreeCanvas01 = () => {
  useEffect(() => {
    const canvas = generateCanvas();
    let renderer, scene, camera, controls;

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.shadowMap.enabled = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      32,
      window.innerWidth / window.innerHeight
    );
    camera.position.set(0, 0, 10);
    controls = new OrbitControls(camera, canvas);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    directionalLight.castShadow = true;

    const sphere = new THREE.SphereGeometry();
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(sphere, material);
    // scene.add(mesh);

    const loader = new GLTFLoader();
    loader.load("/src/assets/three/Catalina_Clay_Product.glb", (gltf) => {
      const model = gltf.scene;
      model.traverse((obj) => {
        if (obj.isMesh) {
          console.log(obj);
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
      scene.add(model);
    });

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      controls.update();
    };

    render();

    return () => {
      document.body.removeChild(canvas);
    };
  }, []);
  return null;
};

export default ThreeCanvas01;
