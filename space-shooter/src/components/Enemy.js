import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class Enemy {
  _model;
  _height;
  _width;

  constructor(scene, x, y) {
    const modelLoader = new GLTFLoader();

    modelLoader.load(
      '../assets/models/enemy/enemy.gltf',
      (model) => {
        this._model = model.scene;

        this._model.rotation.x = Math.PI / 2;
        this._model.rotation.y = -Math.PI / 2;

        this._model.position.set(x, y, -100);
        this._model.scale.set(0.2,0.2,0.2);

        scene.add(this._model);

        const planeBndBox = new THREE.Box3().setFromObject(this._model);
        this._width = Math.abs(planeBndBox.min.x) + planeBndBox.max.x;
        this._height = Math.abs(planeBndBox.min.y) + planeBndBox.max.y;
      }
    );
  }
}
