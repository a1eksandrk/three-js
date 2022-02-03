import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export default class Spaceship {
  spaceship;
  width;
  height;

  _fire;

  constructor(scene) {
    const modelLoader = new OBJLoader();

    const textureLoader = new THREE.TextureLoader();
    const texMap = textureLoader.load('../assets/textures/spaceship.png');
    const modelMaterial = new THREE.MeshBasicMaterial({ map: texMap });

    this._fire = this._createFire(5);

    modelLoader.load(
      '../assets/models/spaceship.obj',
      (model) => {
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = modelMaterial;
          }
        });
        model.rotation.x = Math.PI / 2;
        model.rotation.y = Math.PI;

        this.spaceship = new THREE.Group();
        this.spaceship.add(model);
        this.spaceship.add(this._fire);

        scene.add(this.spaceship);

        const planeBndBox = new THREE.Box3().setFromObject(this.spaceship);
        this.width = Math.abs(planeBndBox.min.x) + planeBndBox.max.x;
        this.height = Math.abs(planeBndBox.min.y) + planeBndBox.max.y;
      }
    );
  }

  update() {
    if (this.spaceship) {
      this.spaceship.position.y += 1;
    }
  }

  handleInput(keyMap, camera) {
    if (!keyMap[87] && this._fire.position.y < 0) {
      this._fire.position.y += 1;
    }

    if (keyMap[87] && (this.spaceship.position.y + this.height / 2 < camera.position.y + camera.top)) {
      this.spaceship.position.y += 5;

      if (Math.abs(this._fire.position.y) < 10) {
        this._fire.position.y -= 1;
      }
    }

    if (!keyMap[83] && this._fire.position.y > 0) {
      this._fire.position.y -= 1;
    }

    if (keyMap[83] && (this.spaceship.position.y - this.height / 2 > camera.position.y + camera.bottom)) {
      this.spaceship.position.y -= 5;

      if (Math.abs(this._fire.position.y) < 15) {
        this._fire.position.y += 1;
      }
    }

    if (!keyMap[68] && !keyMap[65] && this.spaceship) {
      if (this.spaceship.rotation.y > 0) {
        this.spaceship.rotation.y -= Math.PI / 100;
      } else if (this.spaceship.rotation.y < 0) {
        this.spaceship.rotation.y += Math.PI / 100;
      }
    }

    if (keyMap[68] && (this.spaceship.position.x + this.width / 2 < camera.right)) {
      this.spaceship.position.x += 5;

      this.spaceship.rotation.y += Math.PI / 100;

      if (Math.abs(this.spaceship.rotation.y) > Math.PI / 6) {
        this.spaceship.rotation.y = Math.PI / 6;
      }
    }
    if (keyMap[65] && (this.spaceship.position.x - this.width / 2 > camera.left)) {
      this.spaceship.position.x -= 5;

      this.spaceship.rotation.y -= Math.PI / 100;

      if (Math.abs(this.spaceship.rotation.y) > Math.PI / 6) {
        this.spaceship.rotation.y = -Math.PI / 6;
      }
    }
  }

  _createFire(size) {
    const geometry = new THREE.CylinderGeometry(10, 1, 50);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: new THREE.Color('orange')
        },
        color2: {
          value: new THREE.Color('red')
        }
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;

        varying vec2 vUv;

        void main() {
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
      `,
    });

    const mid = Math.ceil(size / 2);
    const base = {
      x: 0,
      y: -90
    };
    const offset = {
      x: 6,
      y: 5,
    };

    const fire = new THREE.Group();

    for (let i = mid - size; i < mid; i++) {
      const firePart = new THREE.Mesh(new THREE.CylinderGeometry().copy(geometry), material);
      firePart.position.x = i * offset.x + base.x;
      firePart.position.y = Math.abs(i) * offset.y + base.y;
      firePart.position.z = -10;

      fire.add(firePart);
    }

    return fire;
  }
}

