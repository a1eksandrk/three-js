import { element } from 'three/examples/jsm/renderers/nodes/ShaderNode';

export const getHslColor = ( hue, saturation = 100,lightness = 50 ) => {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const createOverview = ( text ) => {
  const prevOverview = document.querySelectorAll( '.overview' );
  prevOverview && prevOverview.forEach( ( element ) => element.remove() );

  const overview = document.createElement( 'div' );
  overview.className = 'overview';
  overview.innerHTML = `<div class="overview__text">${text}</div>`;

  document.body.appendChild( overview );

  return overview;
};
