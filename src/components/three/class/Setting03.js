import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { OrthographicCamera } from "three/src/cameras/OrthographicCamera";
import { Scene } from "three/src/scenes/Scene";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { Mesh } from "three/src/objects/Mesh";
import { Vector2 } from "three/src/math/Vector2";
import { TextureLoader } from "three/src/loaders/TextureLoader";

class Canvas {
  constructor(container) {
    this.w = container.clientWidth;
    this.h = container.clientHeight;

    this.mouse = new Vector2(0.5, 0.5);
    this.targetRadius = 0.005;

    this.targetPercent = 0.0;

    const loader = new TextureLoader();
    const texture = loader.load("/src/assets/three/img/image.png");

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

    this.uniforms = {
      uAspect: {
        value: this.w / this.h,
      },
      uTime: {
        value: 0.0,
      },
      uMouse: {
        value: new Vector2(0.5, 0.5),
      },
      uRadius: {
        value: this.targetRadius,
      },
      uFixAspect: {
        value: this.h / this.w,
      },
      uTex: {
        value: texture,
      },
      uPercent: {
        value: this.targetPercent,
      },
    };

    // 頂点シェーダーのソース
    const vertexSource = `
      varying vec2 vUv;
      uniform float uFixAspect;
      void main() {
        vUv = uv - .5;
        vUv.y *= uFixAspect;
        vUv += .5;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // ピクセルシェーダーのソース
    const fragmentSource = `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uPercent;
      uniform sampler2D uTex;

      void main() {
      // 色反転
      // vec3 color = texture2D( uTex, vUv ).rgb;
      //   vec3 invert = 1. - color;
      //   color = mix( color, invert, uPercent );
      //   gl_FragColor = vec4( color, 1.0 );

      // チャンネルシフト
      // float shift = uPercent * .01;
      // float r = texture2D( uTex, vUv + vec2( shift, 0.0 ) ).r;
      // float g = texture2D( uTex, vUv ).g;
      // float b = texture2D( uTex, vUv - vec2( shift, 0.0 ) ).b;
      // vec3 color = vec3( r, g, b );
      // gl_FragColor = vec4( color, 1.0 );

      // モザイク
      // vec2 uv = vUv;
      // float moz = uPercent * 0.02;
      // if( moz > 0. ) {// 0では割れないので、if文で保護
      //   uv = floor( uv / moz ) * moz + ( moz * .5 );
      // }
      // vec3 color = texture2D( uTex, uv ).rgb;
      // gl_FragColor = vec4( color, 1.0 );

      // ゆらゆら
      vec2 uv = vUv;
      float t = uTime * 6.;
      float amount = uPercent * 0.02;
      vec2 uvOffset = vec2( cos( uv.y * 20. + t ), sin( uv.x * 10. - t ) ) * amount;
      vec3 color = texture2D( uTex, uv + uvOffset ).rgb;
      gl_FragColor = vec4( color, 1.0 );
      }
    `;

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
    this.uniforms.uMouse.value.lerp(this.mouse, 0.1);

    this.uniforms.uPercent.value +=
      (this.targetPercent - this.uniforms.uPercent.value) * 0.1;

    this.renderer.render(this.scene, this.camera);
  }
  mouseMoved(x, y) {
    this.mouse.x = x / this.w;
    this.mouse.y = 1.0 - y / this.h;
  }
  mousePressed(x, y) {
    this.mouseMoved(x, y);
    this.targetPercent = 1;
  }
  mouseReleased(x, y) {
    this.mouseMoved(x, y);
    this.targetPercent = 0.0;
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
