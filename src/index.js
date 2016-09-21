// Some serious major perf issues with this approach.
// why are they happening? how can we stop creating so many objects?
import { model, update } from './game';
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
  const menu = document.createElement('p');
  const text = document.createTextNode('Press start.');
  menu.appendChild(text);
  const menuContainer = document.getElementById('menu');
  menuContainer.appendChild(menu);

  window.addEventListener('keydown', startGame);

  function startGame(e) {
    if (e.keyCode !== KEYS.space) {
      return;
    }

    // Keep in mind, you're starting to get away from pure declarative (maybe it doesn't matter)
    // But some game state now (inGame) only matters at the very beginning

    // is the inGame action necessary? do we care about that state except at the very beginning?
    //  - optional, with react you could use it to declaratively render the end screen
    menuContainer.innerHTML = '';
    start();

    window.removeEventListener('keydown', startGame);
  }
}

function start() {
  let store = createStore(update, model);

  store.dispatch(actions.startGame);

  const intervalId = window.setInterval(() => {
    store.dispatch(actions.tick);

    const state = store.getState();

    render(ctx, state);

    // TODO: other game states to account for:
    //   - in menu, but not started
    //   - game over, show score screen + button to restart
    if (state.gameOver) {
      clearInterval(intervalId);
      ctx.clearRect(0, 0, 300, 300);
      renderStartMenu();
    }
  }, 1000 / 60);

  window.addEventListener('keyup', handleKeys.bind(this, false));
  window.addEventListener('keydown', handleKeys.bind(this, true));

  // We didn't *have* to store the key state in the store (we could pass it in i guess), but it's nice
  // to have everything in one place (is it? That's the real question methinks)
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

  // Add the start button listener here, and rely on game state to know what to do?
  // This makes ense as part of main game loop because...
  //   - we hve to render te pause menu continuously?  that's the hold point of canvas right?
  // window.addEventListener('keydown')
  // if state.isPaused
  //   dispatch to unpause?
  // if state.isInStartMenu
  //   render the start menu
}

renderStartMenu();
