import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Missile {
  _model;
  _height;
  _width;

  constructor(scene, x, y) {
    const modelLoader = new GLTFLoader();

    modelLoader.load(
      '../assets/models/missile/missile.gltf',
      (model) => {
        this._model = model.scene;

        this._model.rotation.y = -Math.PI;

        this._model.position.set(x, y, -100);
        this._model.scale.set(0.3, 0.3, 0.3);

        scene.add(this._model);

        const planeBndBox = new THREE.Box3().setFromObject(this._model);
        this._width = Math.abs(planeBndBox.min.x) + planeBndBox.max.x;
        this._height = Math.abs(planeBndBox.min.y) + planeBndBox.max.y;
      }
    );
  }

  update() {
    if (this._model) {
      this._model.position.y += 10;
    }
  }
}
