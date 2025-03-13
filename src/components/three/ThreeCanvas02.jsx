import { useEffect } from "react";
import {
  THREE,
  OrbitControls,
  generateCanvas,
  GLTFLoader,
  RGBELoader,
} from "./Setting.js";

const ThreeCanvas02 = () => {
  useEffect(() => {
    const canvas = generateCanvas();
    let renderer, scene, camera, controls, model;

    const dark = new THREE.Color(0x000000);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    scene = new THREE.Scene();

    // HDR背景画像の設定
    const hdrLoader = new RGBELoader();
    hdrLoader.load("/src/assets/three/hdr/three01.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

    scene.fog = new THREE.Fog(dark, 100, 300);

    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 100);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.minDistance = 50;
    controls.maxDistance = 500;
    controls.enableZoom = false;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.dampingFactor = 0.05;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.PAN,
    };

    let modelLoader = new GLTFLoader();
    modelLoader.load(
      "/src/assets/three/glb/Catalina_Clay_Product.glb",
      (gltf) => {
        model = gltf.scene;
        const ratio = 0.15;
        model.scale.set(ratio, ratio, ratio);
        model.position.set(0, -40, 0);
        model.rotation.set(0, 0, 0);
        scene.add(model);

        model.traverse((obj) => {
          if (obj.isMesh) {
            let mat = new THREE.MeshPhysicalMaterial({
              color: 0xffffff,
              roughness: 0.8,
              bumpMap: obj.material.normalMap,
              bumpScale: 0.1,
            });
            obj.material = mat;
          }
        });
        render();
      }
    );

    let rimLight = new THREE.DirectionalLight(0xffffff, 1);
    rimLight.position.set(-0.1, 0, -1);
    scene.add(rimLight);

    let pointLight = new THREE.PointLight("hsl(180, 50%, 60%)", 5, 50);
    pointLight.position.set(0, 30, 0);
    scene.add(pointLight);

    let directionalLight = new THREE.DirectionalLight(
      "hsl(200, 50%, 50%)",
      0.1
    );
    directionalLight.position.set(-0.5, 1, 0);
    scene.add(directionalLight);

    let position = [];
    for (let i = 0; i < 1000; i++) {
      const radius = 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      position.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }
    const particlePosition = new THREE.BufferGeometry();
    particlePosition.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(position, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 5,
      map: new THREE.TextureLoader().load(
        "/src/assets/three/particle/circle0.png"
      ),
      color: new THREE.Color("gray"),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      alphaTest: 0.5,
      sizeAttenuation: true,
    });
    const particle = new THREE.Points(particlePosition, particleMaterial);
    scene.add(particle);

    let time = 0;

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      controls.update();

      time += 0.002;
      particle.rotation.y += 0.001;
      particle.rotation.x += 0.001;
    };

    document.body.style.height = "200vh";
    document.body.style.overflow = "auto";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "1";

    render();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.removeChild(canvas);
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);
  return null;
};

export default ThreeCanvas02;
