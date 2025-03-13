import { useEffect } from "react";
import { THREE, OrbitControls, generateCanvas, GLTFLoader } from "./Setting.js";

const ThreeCanvas01 = () => {
  useEffect(() => {
    const canvas = generateCanvas();
    let renderer, scene, camera, controls, gltfModel;

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
    camera.position.set(5, 5, 5);
    controls = new OrbitControls(camera, canvas);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.radius = 8;

    const sphere = new THREE.SphereGeometry();
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(sphere, material);
    // scene.add(mesh);

    const loader = new GLTFLoader();
    loader.load("/src/assets/three/glb/Catalina_Clay_Product.glb", (gltf) => {
      const model = gltf.scene;
      console.log(gltf);
      model.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
          obj.material.metalness = 0;
        }
      });
      gltfModel = model;
      scene.add(model);

      // pattern2 ファイル自体にアニメーション処理を加えている場合
      // mixer = new THREE.AnimationMixer(model);
      // gltf.animations.forEach((clip) => {
      //   mixer.clipAction(clip).play();
      // });

      render();
    });

    const animate = () => {
      // pattern1 ファイル自体にアニメーション処理を加えていない場合
      gltfModel.rotation.x += 0.01;
      gltfModel.rotation.y += 0.01;
      gltfModel.rotation.z += 0.01;

      // pattern2 ファイル自体にアニメーション処理を加えている場合
      // if (mixer) {
      //   mixer.update(1 / 60);
      // }
    };

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      controls.update();

      animate();
    };

    return () => {
      document.body.removeChild(canvas);
    };
  }, []);
  return null;
};

export default ThreeCanvas01;
