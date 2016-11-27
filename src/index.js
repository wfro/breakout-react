import { initialState, update } from './game';
import { render } from './render';
import { createStore } from 'redux';
import actions from './actions';

const KEYS = {
  left: 37,
  right: 39,
  space: 32
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function renderStartMenu() {
  renderMenuText('Press spacebar to play.');

  window.addEventListener('keydown', startGame);

  function startGame(e) {
    if (e.keyCode !== KEYS.space) {
      return;
    }

    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = '';
    start();

    window.removeEventListener('keydown', startGame);
  }
}

function renderGameOverSCreen() {
  renderMenuText('Game Over.');
}

function renderWinMessage() {
  renderMenuText('You win.');
}

function renderMenuText(text) {
  const menu = document.createElement('p');
  const textNode = document.createTextNode(text);
  menu.appendChild(textNode);
  const menuContainer = document.getElementById('menu');
  menuContainer.appendChild(menu);
}

function start() {
  let store = createStore(update, initialState);

  store.dispatch(actions.startGame);

  const intervalId = window.setInterval(() => {
    store.dispatch(actions.tick);

    const state = store.getState();

    render(ctx, state);

    if (state.gameOver) {
      reset();
      renderGameOverSCreen();
    }

    // TODO: levels
    if (state.isWon) {
      reset();
      renderWinMessage();
    }
  }, 1000 / 60);

  window.addEventListener('keyup', handleKeys.bind(this, false));
  window.addEventListener('keydown', handleKeys.bind(this, true));

  function handleKeys(value, e) {
    if (e.keyCode === KEYS.left) {
      store.dispatch({
        type: 'UPDATE_KEYS',
        payload: {
          key: 'left',
          value
        }
      });
    }

    if (e.keyCode === KEYS.right) {
      store.dispatch({
        type: 'UPDATE_KEYS',
        payload: {
          key: 'right',
          value
        }
      });
    }
  }

  function reset() {
    clearInterval(intervalId);
    ctx.clearRect(0, 0, 300, 300);
    renderStartMenu();
  }
}

renderStartMenu();
