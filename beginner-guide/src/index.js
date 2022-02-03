import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer( { antialias: true } );

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let material = new THREE.MeshStandardMaterial( { color: '#ff0051' } );
const cube = new THREE.Mesh ( geometry, material );

scene.add( cube );

geometry = new THREE.BoxGeometry( 3, 3, 3 );
material = new THREE.MeshBasicMaterial( { color: '#dadada', wireframe: true, transparent: true } );
const wireframeCube = new THREE.Mesh ( geometry, material );

scene.add( wireframeCube );

camera.position.z = 5;

const ambientLight = new THREE.AmbientLight ( '#ffffff', 0.5 );
scene.add( ambientLight );

const pointLight = new THREE.PointLight( '#ffffff', 1 );
pointLight.position.set( 25, 50, 25 );
scene.add( pointLight );

function animate() {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.04;
  cube.rotation.y += 0.04;
  wireframeCube.rotation.x -= 0.01;
  wireframeCube.rotation.y -= 0.01;

  renderer.render( scene, camera );
}

animate();
