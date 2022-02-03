import * as THREE from 'three';

export default class Background {
  constructor(scene, height) {
    const geometry = new THREE.PlaneGeometry(3000, 3000);

    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshBasicMaterial({ map: textureLoader.load('../assets/textures/bg.png') });
    const bg = new THREE.Mesh(geometry, material);

    bg.rotation.z = -Math.PI / 2;
    bg.position.z = -900;
    bg.position.y = 1000;

    scene.add(bg);
  }

  update() {}
}
