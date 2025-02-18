// src/components/ThreeCanvas.jsx
import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

function ThreeCanvas() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;

    const scene = new THREE.Scene();

    const loader = new RGBELoader();
    loader.load("/src/assets/three/three01.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

    const camera = new THREE.PerspectiveCamera(
      32,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    const controls = new OrbitControls(camera, canvas);
    const geometry = new THREE.SphereGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("white"),
      roughness: 0.1,
      metalness: 0.5,
      // emissive: new THREE.Color("rgb(20, 20, 20)"),
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 直接光源
    const directionalLight = new THREE.DirectionalLight(
      new THREE.Color("white"),
      0.75
    );
    directionalLight.position.set(2, 2, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.blurSamples = 30;
    directionalLight.shadow.radius = 12;
    scene.add(directionalLight);

    const dirHelper = new THREE.DirectionalLightHelper(directionalLight);
    // scene.add(dirHelper);

    // 点光源
    const pointLight = new THREE.PointLight(0xffffff, 0.1);
    pointLight.position.set(2, 0, 2);
    // scene.add(pointLight);

    const pointHelper = new THREE.PointLightHelper(pointLight);
    // scene.add(pointHelper);

    // 環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    // scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.25);
    // scene.add(hemisphereLight);

    const hemiHelper = new THREE.HemisphereLightHelper(hemisphereLight);
    scene.add(hemiHelper);

    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const plane = new THREE.Mesh(planeGeo, material);
    plane.position.set(0, -1, 0);
    plane.rotation.set(Math.PI * -0.5, 0, 0);
    scene.add(plane);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    plane.receiveShadow = true;
    plane.castShadow = true;

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

  return null; // 直接DOMに追加するので、JSXとして何も描画しない
}

export default ThreeCanvas;
