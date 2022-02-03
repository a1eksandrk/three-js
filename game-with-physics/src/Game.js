import engine from '@/Engine';
import { getHslColor, createOverview } from '@/utils/helpers';
import { ORIGINAL_BOX_SIZE, BOX_HEIGHT, SPEED_INCREMENT } from '@/utils/constants';

class Game {
  _engine = null;
  _camera = null;

  _scoreElement = null;
  _overview = null;

  _gameStarted = false;
  _gameOver = false;

  _stack = [];
  _speed = 0.1;

  constructor( engine ) {
    this._engine = engine;
    this._camera = this._engine.camera;

    this._engine.init();
  }

  start( scoreElement ) {
    this._engine.zoom( 1 );

    const message = 'To start the game, just click on the screen!';
    this._overview = createOverview( message );

    this._scoreElement = scoreElement;

    this._addLayer( 0, 0, ORIGINAL_BOX_SIZE, ORIGINAL_BOX_SIZE );
    this._addLayer( -10, 0, ORIGINAL_BOX_SIZE, ORIGINAL_BOX_SIZE, 'x' );

    this._addClickHandler();

    this._engine.loop();
  }

  _update() {
    this._scoreElement.innerText = this._stack.length - 2;
    this._speed += SPEED_INCREMENT;
  }

  _addLayer( x, z, width, depth, direction ) {
    const height = BOX_HEIGHT;
    const y = height * this._stack.length;
    const color = getHslColor( 30 + this._stack.length * 4 );

    const layer = this._engine.generateBox( x, y, z, width, height, depth, color, true );
    layer.direction = direction;

    this._stack.push( layer );
  }

  _addOverhang( x, z, width, depth ) {
    const height = BOX_HEIGHT;
    const y = height * ( this._stack.length - 1 );
    const color = getHslColor( 30 + this._stack.length * 4 );

    this._engine.generateBox( x, y, z, width, height, depth, color, true, 5 );
  }

  _cutBox( topLayer, overhangSize, overlap, size, delta ) {
    this._stack.pop();
    this._engine.destroyBox( topLayer );

    const { direction } = topLayer;

    const newX = direction === 'x' ? topLayer.mesh.position.x - delta / 2 : topLayer.mesh.position.x;
    const newZ = direction === 'z' ? topLayer.mesh.position.z - delta / 2 : topLayer.mesh.position.z;
    const newWidth = direction === 'x' ? overlap : topLayer.width;
    const newDepth = direction === 'z' ? overlap : topLayer.depth;

    this._addLayer( newX, newZ, newWidth, newDepth );

    const overhangShift = ( overlap / 2 + overhangSize / 2 ) * Math.sign( delta );
    const overhangX =
      direction === 'x'
        ? newX + overhangShift
        : newX;
    const overhangZ =
      direction === 'z'
        ? newZ + overhangShift
        : newZ;
    const overhangWidth = direction === 'x' ? overhangSize : newWidth;
    const overhangDepth = direction === 'z' ? overhangSize : newDepth;

    this._addOverhang( overhangX, overhangZ, overhangWidth, overhangDepth );

    return this._stack[this._stack.length - 1];
  }

  _addClickHandler() {
    const clickHandler = () => {
      if ( !this._gameStarted ) {
        this._overview.remove();
        this._gameStarted = true;
        this._engine.loop( this._gameLoop );
      } else {
        const topLayer = this._stack[this._stack.length - 1];
        const previousLayer = this._stack[this._stack.length - 2];

        const { direction } = topLayer;

        const delta =
          topLayer.mesh.position[direction] -
          previousLayer.mesh.position[direction];

        const overhangSize = Math.abs( delta );

        const size = direction === 'x' ? topLayer.width : topLayer.depth;

        const overlap = size - overhangSize;

        if ( overlap < 0 ) {
          this._gameOver = true;
          window.removeEventListener( 'click', clickHandler );
          return;
        }

        const updatedTopLayer = this._cutBox( topLayer, overhangSize, overlap, size, delta );

        const newWidth = updatedTopLayer.width;
        const newDepth = updatedTopLayer.depth;
        const nextX = direction === 'x' ? updatedTopLayer.mesh.position.x : -10;
        const nextZ = direction === 'z' ? updatedTopLayer.mesh.position.z : -10;

        const nextDirection = direction === 'x' ? 'z' : 'x';

        this._addLayer( nextX, nextZ, newWidth, newDepth, nextDirection );

        this._update();
      }
    };

    window.addEventListener( 'click', clickHandler );
  }

  _resetGame() {
    this._overview.remove();

    this._gameStarted = false;
    this._gameOver = false;

    this._stack = [];
    this._speed = 0.1;

    this._engine.clear();
    this._engine.init();

    this.start( this._scoreElement );
  }

  _addResetHandler() {
    const keyDownHandler = ( event ) => {
      const keyName = event.key;
      if ( keyName !== 'r' ) {
        return;
      }

      this._resetGame();
      window.removeEventListener( 'keydown', keyDownHandler );
    };

    window.addEventListener( 'keydown', keyDownHandler );
  }

  _gameLoop = () => {
    if ( this._gameOver ) {
      this._engine.zoom( 2 );
      const message = `Game Over!<br>Your score is ${this._stack.length - 2}<br>Press the R button to try again`;
      this._overview = createOverview( message );
      this._addResetHandler();
      this._engine.loop();
      return;
    }

    const topLayer = this._stack[this._stack.length - 1];
    topLayer.mesh.position[topLayer.direction] += this._speed;
    topLayer.body && ( topLayer.body.position[topLayer.direction] += this._speed );

    if ( this._camera.position.y < BOX_HEIGHT * ( this._stack.length - 2 ) + 4 ) {
      this._camera.position.y += this._speed;
    }
  };
}

const game = new Game( engine );

export default game;
