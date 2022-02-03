import * as THREE from 'three';

export default class Three {
  _scene = null;

  _camera = null;

  get camera() {
    return this._camera;
  }

  _baseCameraScale = null;

  _renderer = null;

  constructor() {
    this._scene = new THREE.Scene();
    this._camera = new THREE.OrthographicCamera();
    this._renderer = new THREE.WebGLRenderer();
  }

  init( settings ) {
    this._setupScene( settings );
    this._setupCamera( settings );
    this._setupRenderer( settings );
    this._setupResizeEvent( settings );
  }

  startAnimation( callback ) {
    this._renderer.setAnimationLoop( ( time ) => {
      callback && callback( time );
      this._renderer.render( this._scene, this._camera );
    } );
  }

  generateMesh( x, y, z, width, height, depth, color ) {
    const geometry = new THREE.BoxGeometry( width, height, depth );
    const threeColor = new THREE.Color( color );
    const material = new THREE.MeshLambertMaterial( { color: threeColor } );
    const mesh = new THREE.Mesh( geometry, material );

    mesh.position.set( x, y, z );

    this._scene.add( mesh );

    return mesh;
  }

  removeMesh( mesh ) {
    mesh.geometry.dispose();
    mesh.material.dispose();

    this._scene.remove( mesh );
    this._renderer.renderLists.dispose();
  }

  clear() {
    while ( this._scene.children.length > 0 ) {
      this._scene.remove( this._scene.children[0] );
    }
  }

  scaleCamera( scale ) {
    this._camera.left = this._baseCameraScale.left * scale;
    this._camera.right = this._baseCameraScale.right * scale;
    this._camera.top = this._baseCameraScale.top * scale;
    this._camera.bottom = this._baseCameraScale.bottom * scale;

    this._camera.updateProjectionMatrix();
  }

  _setupScene( { ambientLightSetting, directionalLightSetting } ) {
    const ambientLight = new THREE.AmbientLight( ...Object.values( ambientLightSetting ) );
    this._scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight(
      directionalLightSetting.color,
      directionalLightSetting.intensity
    );
    directionalLight.position.set( ...Object.values( directionalLightSetting.position ) );
    this._scene.add( directionalLight );
  }

  _setupCamera( { cameraSetting } ) {
    const aspect = window.innerWidth / window.innerHeight;
    const { width } = cameraSetting;
    const height = width / aspect;

    this._camera.left = width / -2;
    this._camera.right = width / 2;
    this._camera.top = height / 2;
    this._camera.bottom = height / -2;
    this._camera.near = cameraSetting.near;
    this._camera.far = cameraSetting.far;

    this._baseCameraScale = {
      left: width / -2,
      right: width / 2,
      top: height / 2,
      bottom: height / -2
    };

    this._camera.position.set( ...Object.values( cameraSetting.position ) );
    this._camera.lookAt( ...Object.values( cameraSetting.look ) );

    this._camera.updateProjectionMatrix();
  }

  _setupRenderer( { parent, antialiasSetting } ) {
    this._renderer.antialias = antialiasSetting;
    this._renderer.setSize( window.innerWidth, window.innerHeight );
    this._renderer.render( this._scene, this._camera );

    if ( parent && 'appendChild' in parent ) {
      parent.appendChild( this._renderer.domElement );
    } else {
      document.body.appendChild( this._renderer.domElement );
    }
  }

  _setupResizeEvent( { cameraSetting } ) {
    window.addEventListener( 'resize', () => {
      const aspect = window.innerWidth / window.innerHeight;
      const { width } = cameraSetting;
      const height = width / aspect;

      this._camera.top = height / 2;
      this._camera.bottom = height / -2;

      this._camera.updateProjectionMatrix();

      this._renderer.setSize( window.innerWidth, window.innerHeight );
      this._renderer.render( this._scene, this._camera );
    } );
  }
}
