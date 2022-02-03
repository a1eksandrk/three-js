import * as THREE from 'three';

import Background from '@/components/Background';
import Spaceship from '@/components/Spaceship';
import Missile from '@/components/Missile';

import { placeCoins } from '@/helpers';
import { placeEnemies } from '@/helpers';

export default class SceneManager {
  _spaceship = null;
  _dynamicSubjects = [];
  _missiles = [];
  _keyMap = {};

  constructor(canvas) {
    this._canvas = canvas;

    this._screenDimensions = {
      width: canvas.width,
      height: canvas.height
    };

    this._scene = this._buildScene();
    this._renderer = this._buildRender(this._screenDimensions);
    this._camera = this._buildCamera(this._screenDimensions);

    this._scene.add(new THREE.AmbientLight('#ffffff', 1.5));

    this._createSceneSubjects();
  }

  update() {
    if (this._camera.position.y < 2000) {
      this._camera.position.y += 1;

      this._dynamicSubjects.forEach((subject) => {
        subject.update();
      });
    }

    this._spaceship.handleInput(this._keyMap, this._camera);

    if (this._keyMap[32]) {

      const x = this._spaceship.spaceship.position.x;
      const y = this._spaceship.spaceship.position.y + this._spaceship.height/2;

      const m = new Missile(this._scene, x, y);

      this._dynamicSubjects.push(m);
      this._missiles.push(m);
      this._keyMap[32] = false;
    }

    this._renderer.render(this._scene, this._camera);
  }

  onWindowResize() {
    const { width, height } = this._canvas;

    this._screenDimensions.width = width;
    this._screenDimensions.height = height;

    this._renderer.setSize(width, height);

    this._camera.left = -width / 2;
    this._camera.right = width / 2;
    this._camera.top = height / 2;
    this._camera.bottom = -height / 2;
    this._camera.updateProjectionMatrix();
  }

  handleInput(keyCode, isDown) {
    this._keyMap[keyCode] = isDown;
  }

  _buildScene() {
    return new THREE.Scene();
  }

  _buildRender({ width, height }) {
    const renderer = new THREE.WebGLRenderer({ canvas: this._canvas, antialias: true, alpha: true });

    renderer.setClearColor('#222222');
    renderer.setSize(width, height);

    return renderer;
  }

  _buildCamera({ width, height }) {
    const nearPlane = 1;
    const farPlane = 1000;
    const camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, nearPlane, farPlane);

    camera.position.z = 30;

    return camera;
  }

  _createSceneSubjects() {
    new Background(this._scene);
    placeCoins(this._scene);
    placeEnemies(this._scene);
    this._spaceship = new Spaceship(this._scene);

    this._dynamicSubjects.push(this._spaceship);
  }
}
