import { useEffect } from "react";
import {
  THREE,
  OrbitControls,
  generateCanvas,
  GLTFLoader,
  RGBELoader,
  CreateParticles,
} from "./class/Setting.js";

const ThreeCanvas02 = () => {
  useEffect(() => {
    const canvas = generateCanvas();
    let renderer, scene, camera, controls, model;

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

    scene.fog = new THREE.Fog(new THREE.Color(0x000000), 100, 300);

    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 30, 70);

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

    let pointLight = new THREE.PointLight(0xffffff, 5, 50);
    pointLight.position.set(0, 30, 0);
    scene.add(pointLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.position.set(-0.5, 1, 0);
    scene.add(directionalLight);

    // particle
    const particleTextureCount = 17;
    const index = Math.floor(Math.random() * particleTextureCount);

    const textures = [];
    for (let i = 0; i < particleTextureCount; i++) {
      textures.push(`/src/assets/three/particle/circle${i}.png`);
    }
    const particleTextures = textures.map((texture) =>
      new THREE.TextureLoader().load(texture)
    );

    const particles = new CreateParticles(
      scene,
      3,
      30,
      1000,
      new THREE.Color("gray"),
      `/src/assets/three/particle/circle${index}.png`,
      1
    );
    particles.particleSystem.material.transparent = true;
    particles.particleSystem.material.blending = THREE.AdditiveBlending;
    particles.particleSystem.material.alphaTest = 0.5;
    particles.particleSystem.material.sizeAttenuation = true;

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      controls.update();
      particles.update();
    };

    document.body.style.height = "500vh";
    document.body.style.overflow = "auto";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "1";

    const handleScroll = () => {
      const currentScrollPosition =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const currentScrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const maxScrollArea = currentScrollHeight - windowHeight;

      const scrollProgress = Math.min(
        Math.max(currentScrollPosition / maxScrollArea, 0),
        1
      );

      const particlesMaterialIndex = Math.floor(
        scrollProgress * (particleTextureCount - 1)
      );

      const textureProgress = scrollProgress * (particleTextureCount - 1);
      const currentIndex = Math.floor(textureProgress);

      // テクスチャの更新
      particles.updateTexture(particleTextures[particlesMaterialIndex]);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

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
