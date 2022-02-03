import * as CANNON from 'cannon';

export default class Cannon {
  _world;

  get world() {
    return this._world;
  }

  constructor() {
    this._world = new CANNON.World();
  }

  init( settings ) {
    this._setupWorld( settings );
  }

  generateBody( x, y, z, width, height, depth, mass ) {
    const shape = new CANNON.Box(
      new CANNON.Vec3( width / 2, height / 2, depth / 2 )
    );
    const body = new CANNON.Body( { mass, shape } );

    body.position.set( x, y, z );

    this._world.addBody( body );

    return body;
  }

  removeBody( body ) {
    this._world.removeBody( body );
  }

  clear() {
    while ( this._world.bodies.length > 0 ) {
      this._world.remove( this._world.bodies[0] );
    }
  }

  _setupWorld( { gravitySetting, solverSetting } ) {
    this._world = new CANNON.World();
    this._world.gravity.set( ...Object.values( gravitySetting ) );
    this._world.broadphase = new CANNON.NaiveBroadphase();
    this._world.solver.iterations = solverSetting.iteration;
  }
}
