// import * as THREE from "three";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Scene } from "three/src/scenes/Scene";
import { PointLight } from "three/src/lights/PointLight";
import { BoxGeometry } from "three/src/geometries/BoxGeometry";
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial";
import { Mesh } from "three/src/objects/Mesh";
import { MathUtils } from "three/src/math/MathUtils";
import { Vector2 } from "three/src/math/Vector2";

class Canvas {
  constructor(container, scrollContainerHeading1) {
    this.mouse = new Vector2(0, 0);
    this.w = container.clientWidth;
    this.h = container.clientHeight;
    this.scrollY = 0;
    this.element = document.getElementById(scrollContainerHeading1);
    const rect = this.element.getBoundingClientRect();

    this.renderer = new WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    if (container) {
      container.appendChild(this.renderer.domElement);
    } else {
      return;
    }

    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);
    const halfHeight = this.h / 2;
    const dist = halfHeight / Math.tan(fovRad);

    this.camera = new PerspectiveCamera(fov, this.w / this.h, 1, dist * 2);
    this.camera.position.z = dist;

    this.scene = new Scene();

    this.light = new PointLight(
      0x00ffff,
      100, // 光の強度（intensity）
      0, // 光の届く距離（distance）
      1 // 光の減衰率（decay）
    );
    this.light.position.set(0, 0, 400);

    this.scene.add(this.light);

    const depth = 300;
    const geo = new BoxGeometry(rect.width, rect.height, depth);
    const mat = new MeshLambertMaterial({ color: 0xffffff });
    this.mesh = new Mesh(geo, mat);

    const center = new Vector2(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );
    const diffX = center.x - this.w / 2;
    const diffY = center.y - this.h / 2;
    const diff = new Vector2(diffX, diffY);

    this.mesh.position.set(diff.x, -(diff.y + window.scrollY), -depth / 2);
    this.offsetY = this.mesh.position.y;

    // ラジアンを使用した指定方法
    // this.mesh.rotation.x = Math.PI / 4;
    // this.mesh.rotation.y = Math.PI / 4;

    // 度数を使用した指定方法
    // this.mesh.rotation.x = MathUtils.DEG2RAD * 45;
    // this.mesh.rotation.y = MathUtils.DEG2RAD * 45;

    this.scene.add(this.mesh);
    this.isRendering = true;
    this.render();
  }
  render() {
    if (!this.isRendering) return;
    requestAnimationFrame(() => this.render());

    // requestAnimationFrameがブラウザによって処理感覚が異なるためperformance.now()を使用して処理を統一
    const sec = performance.now() / 1000;

    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.01;

    // 時間で制御
    // this.mesh.rotation.x = sec * (Math.PI / 4);
    // this.mesh.rotation.y = sec * (Math.PI / 4);

    // this.mesh.position.x = Math.cos(sec);
    // this.mesh.position.y = Math.sin(sec);

    // this.mesh.scale.x = Math.cos(sec);
    // this.mesh.scale.y = Math.sin(sec * 0.1);

    // scrolledオブジェクトと連動
    // this.mesh.position.y = this.scrollY * 0.5;
    // this.mesh.rotation.y = MathUtils.DEG2RAD * 45 + this.scrollY * 0.01;

    this.mesh.position.y = this.offsetY + this.scrollY;
    this.renderer.render(this.scene, this.camera);
  }
  mouseMoved(x, y) {
    this.mouse.x = x - this.w / 2;
    this.mouse.y = -y + this.h / 2;

    this.light.position.x = this.mouse.x;
    this.light.position.y = this.mouse.y;
  }
  scrolled(y) {
    this.scrollY = y;
  }
  dispose() {
    this.isRendering = false;
    this.renderer.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(
          this.renderer.domElement
        );
      }
    }
    if (this.scene) {
      this.scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry.dispose();
        if (object.material.isMaterial) {
          object.material.dispose();
        }
      });
    }
    this.scene = null;
    this.camera = null;
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;
    this.light = null;
  }
}

export default Canvas;
