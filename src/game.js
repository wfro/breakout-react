import u from 'updeep';

// TODO: Where can i find persistent data structures?
// TODO: how can i make sure they work?
const options = {
  projectileSize: 20,
  projectileSpeed: 2,
  paddleSize: {
    w: 80,
    h: 15
  },
  paddleSpeed: 3,
  boardSize: 300
};
const defaultOptions = options;

const flatten = require('lodash/flatten');


// this is so gnarly
function generateBlocks() {
  const padding = 10;
  const rows = 3;
  const blocksInRow = 4;
  const w = Math.floor((options.boardSize - (padding * (blocksInRow + 1))) / blocksInRow);
  const h = 20;
  const blocks = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    let y;
    if (i === 0) {
      y = padding;
    } else {
      // USe the previous row's y position to more easily calculate where this row
      // starts. It doens't matter which element we use (all rows will share a y
      // value), so just use the first.
      const prev = blocks[i - 1];
      y = prev[0].y + h + padding;
    }

    for (let j = 0; j < blocksInRow; j++) {
      let x;
      if (j === 0) {
        x = padding;
      } else {
        const prev = row[j - 1];
        x = prev.x + w + padding;
      }

      row.push({ x, y, w, h });
    }

    blocks.push(row);
  }
}

// Represents all game state.
const model = {
  boardSize: options.boardSize,

  blocks: flatten(generateBlocks()),

  projectile: {
    x: (options.boardSize / 2) - (options.projectileSize / 2),
    y: options.boardSize - (options.paddleSize.h + options.projectileSize) - 1,
    dx: options.projectileSpeed,
    dy: -options.projectileSpeed,
    size: options.projectileSize
  },

  paddle: {
    x: (options.boardSize / 2) - (options.paddleSize.w / 2),
    y: options.boardSize - options.paddleSize.h,
    dx: options.paddleSpeed,
    w: options.paddleSize.w,
    h: options.paddleSize.h
  },

  keys: {
    left: false,
    right: false
  },

  inGame: false
};

function update(state, action = {}) {
  if (action.type === 'UPDATE_KEYS') {
    const { key, value } = action.payload;
    const nextKeys = Object.assign({}, state.keys, {
      [key]: value
    });
    return Object.assign({}, state, {
      keys: nextKeys
    });
  }

  if (action.type === 'TICK') {
    const updates = Object.assign({}, state, {
      projectile: updateProjectile(state),
      paddle: updatePaddle(state)
    });

    // Game ends if the projectile hits the bottom of the game field.
    if (updates.projectile.y + updates.projectile.size >= updates.boardSize) {
      return u({ gameOver: true }, state);
    }

    // If we make it through, return the new game state!
    return updates;
  }

  if (action.type === 'START_GAME') {
    return Object.assign({}, state, {
      inGame: true
    });
  }

  return state;
}

function updateProjectile(state) {
  const { projectile } = state;
  const { x, y, dx, dy, size } = projectile;

  const updates = Object.assign({}, projectile);

  if (x >= state.boardSize - size || x < 0) {
    updates.dx = -dx;
  }

  // Check if the projectile is hitting the paddle
  const inBetweenPaddles = ((x + size > state.paddle.x) &&
                            (x < state.paddle.x + state.paddle.w));
  const isHittingPaddle = ((y + size) >= (state.boardSize - state.paddle.h));

  // Check if the projectile is hitting a block
  state.blocks.some(block => {
    // do we need to check each individual side?
    // could we just
    // only one x range to check
    // only one y range to check
  });

  if (inBetweenPaddles && isHittingPaddle || y < 0) {
    updates.dy = -dy;
  }

  updates.x = projectile.x + updates.dx;
  updates.y = projectile.y + updates.dy;

  // return u(updates, state);
  return Object.assign({}, state, updates);
}

function updatePaddle(state) {
  const { paddle } = state;

  if (state.keys.left) {
    // Nowhere left to go!
    if (paddle.x <= 0) {
      return paddle;
    }

    return Object.assign({}, paddle, {
      x: paddle.x - paddle.dx
    });
  }

  if (state.keys.right) {
    // Nowhere left to go!
    if (paddle.x + paddle.w >= state.boardSize) {
      return paddle;
    }

    return Object.assign({}, paddle, {
      x: paddle.x + paddle.dx
    });
  }

  // If we've made it past all of the above the conditions,
  // the paddle doesn't need to be updated.
  return paddle;
}

export {
  model,
  update,
  defaultOptions
};
