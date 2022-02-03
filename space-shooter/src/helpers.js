import Coin from '@/components/Coin';
import Enemy from '@/components/Enemy';

export const placeCoins = (scene) => {

  const theCoins = [];
  [...Array(10).keys()].map((y) => {

    getRandomPositions().map((x) => {
      const c = new Coin(scene, 100*(x-7), 200*(y+1));
      theCoins.push(c);
    });

  });

  return theCoins;

  function getRandomPositions() {

    const noCoins = Math.floor((Math.random() * 6));

    const arr = [...Array(15).keys()];

    for (let i = arr.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * i);
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }

    return arr.slice(0, noCoins);
  }
};

export const placeEnemies = (scene) => {
  const theEnemies = [];

  [...Array(5).keys()].map((y) => {
    getRandomPositions().map((x) => {
      const e = new Enemy(scene, 200*(x-4), 400*(y+1));
      theEnemies.push(e);
    });
  });

  return theEnemies;

  function getRandomPositions() {

    const noEnemies = Math.floor((Math.random() * 4));

    const arr = [...Array(9).keys()];

    for (let i = arr.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * i);
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }

    return arr.slice(0, noEnemies);
  }
};
