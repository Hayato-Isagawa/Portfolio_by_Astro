// src/components/ThreeCanvas.jsx
import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function ThreeCanvas() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      32,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    const controls = new OrbitControls(camera, canvas);
    const geometry = new THREE.SphereGeometry();
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const directionalLight = new THREE.DirectionalLight(
      new THREE.Color("white"),
      0.75
    );
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);
    scene.add(new THREE.DirectionalLightHelper(directionalLight));

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.25);
    scene.add(hemisphereLight);
    scene.add(new THREE.HemisphereLightHelper(hemisphereLight));

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
