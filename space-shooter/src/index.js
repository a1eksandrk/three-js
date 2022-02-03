import SceneManager from '@/SceneManager';

// create SceneManager
const canvas = document.getElementById('canvas');
const sceneManager = new SceneManager(canvas);

const handleResizeCanvas = () => {
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  sceneManager.onWindowResize();
};

const handleKeyDown = (event) => {
  const keyCode = event.which;
  sceneManager.handleInput(keyCode, true);
};

const handleKeyUp = (event) => {
  const keyCode = event.which;
  sceneManager.handleInput(keyCode, false);
};

const bindEventListeners = () => {
  window.addEventListener('resize', handleResizeCanvas);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  handleResizeCanvas();
};

const render = () => {
  requestAnimationFrame(render);
  sceneManager.update();
};

// handle DOM events
bindEventListeners();

// Render Loop
render();
