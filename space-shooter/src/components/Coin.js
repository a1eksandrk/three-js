import * as THREE from 'three';

export default class Coin {
  constructor(scene, x, y) {
    const radius = 20;
    const geometry = new THREE.CircleGeometry( radius, 16 );
    const material = new THREE.MeshBasicMaterial( { color: '#fbb000' } );

    this._model = new THREE.Mesh( geometry, material );
    this._model.position.set(x, y, -500);

    scene.add(this._model);

    this._height = 2 * radius;
    this._width = 2 * radius;
  }
}
