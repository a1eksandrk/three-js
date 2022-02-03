import Three from '@/Three';
import Cannon from '@/Cannon';

class Engine {
  _display = null;
  _physic = null;

  _dynamicObjects = [];

  _lastTime = 0;
  _zoom = 1;
  _newZoom = 1;

  get camera() {
    return this._display.camera;
  }

  constructor( display, physic ) {
    this._display = display;
    this._physic = physic;
  }

  init( displaySetting, physicSetting ) {
    const displayDefaultSetting = {
      antialiasSetting: true,
      ambientLightSetting: {
        color: '#ffffff',
        intensity: 0.6
      },
      directionalLightSetting: {
        color: '#ffffff',
        intensity: 0.6,
        position: { x: 10, y: 20, z: 0 }
      },
      cameraSetting: {
        width: 10,
        near: 0,
        far: 100,
        position: { x: 4, y: 4, z: 4 },
        look: { x: 0, y: 0, z: 0 }
      }
    };

    const physicDefaultSetting = {
      gravitySetting: { x: 0, y: -10, z: 0 },
      solverSetting: { iteration: 40 }
    };

    this._display.init( displaySetting ?? displayDefaultSetting );
    this._physic.init( physicSetting ?? physicDefaultSetting );
  }

  loop( callback ) {
    this._display.startAnimation( ( time ) => {
      callback && callback( time );
      const step = ( time - this._lastTime ) / 1000;
      this._updatePhysics( step );
      this._updateCamera( step );
      this._lastTime = time;
    } );
  }

  generateBox( x, y, z, width, height, depth, color, isDynamic = false, mass = 0 ) {
    const box = { width, depth };
    box.mesh = this._display.generateMesh( x, y, z, width, height, depth, color );

    if ( isDynamic ) {
      box.body = this._physic.generateBody( x, y, z, width, height, depth, mass );
      this._dynamicObjects.push( box );
    }

    return box;
  }

  destroyBox( box ) {
    const { mesh, body } = box;

    this._display.removeMesh( mesh );
    this._physic.removeBody( body );
  }

  clear() {
    this._display.clear();
    this._physic.clear();
  }

  zoom( scale ) {
    this._newZoom = scale;
  }

  _updatePhysics( step = 1 / 60 ) {
    this._physic.world.step( step );

    this._dynamicObjects.forEach( ( object ) => {
      object.mesh.position.copy( object.body.position );
      object.mesh.quaternion.copy( object.body.quaternion );
    } );
  }

  _updateCamera( step ) {
    const delta = this._zoom - this._newZoom;

    if ( Math.abs( delta ) < 0.001 ) {
      return;
    }

    this._zoom = this._zoom + ( -Math.sign( delta ) * step );
    this._display.scaleCamera( this._zoom );
  }
}

const engine = new Engine( new Three(), new Cannon() );

export default engine;
