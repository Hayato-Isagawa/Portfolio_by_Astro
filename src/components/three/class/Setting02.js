import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { OrthographicCamera } from "three/src/cameras/OrthographicCamera";
import { Scene } from "three/src/scenes/Scene";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from "three/src/objects/Mesh";
import { Vector2 } from "three/src/math/Vector2";

class Canvas {
  constructor(container) {
    this.w = container.clientWidth;
    this.h = container.clientHeight;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    if (container) {
      container.appendChild(this.renderer.domElement);
    } else {
      return;
    }

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, -1);

    this.scene = new Scene();

    const geo = new PlaneGeometry(2, 2, 1, 1);

    // 頂点シェーダーのソース
    const vertexSource = `
varying vec2 vUv;
void main() {
  vec3 pos = position;
  gl_Position = vec4(pos, 1.0);
  vUv = uv;
}
`;

    // ピクセルシェーダーのソース
    const fragmentSource = `
varying vec2 vUv;
uniform float uAspect;
uniform float uTime;

void main() {
  vec2 uv = vec2(vUv.x * uAspect, vUv.y);
  vec2 center = vec2(.5 * uAspect, .5);
  float radius = 0.05 + sin(uTime * 2.0) * 0.05;
  float lightness =  radius / length(uv - center);
  // lightness = clamp(lightness, 0.0, 1.0);
  vec4 color = vec4(vec3(lightness), 1.0);
  color *= vec4(.2, 1.0, .5, 1.0);
  gl_FragColor = color;
}
`;

    this.uniforms = {
      uAspect: {
        value: this.w / this.h,
      },
      uTime: {
        value: 0.0
      }
    };

    const mat = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
      wireframe: false,
    });

    this.mesh = new Mesh(geo, mat);

    this.scene.add(this.mesh);
    this.isRendering = true;
    this.render();
  }
  render() {
    if (!this.isRendering) return;
    requestAnimationFrame(() => this.render());

    const sec = performance.now() / 1000;

    this.uniforms.uTime.value = sec;

    this.renderer.render(this.scene, this.camera);
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
