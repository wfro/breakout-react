import flatten from 'lodash/flatten';

// TODO: Bring in immutable
//   - define record types
//   - use them
// TODO: do some actual perf checks out of curiousity -- does using persistent data structues really make a big difference?
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

// this is so gnarly
// TODO: organize our constants
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
        // Calculate a block's starting x position by using the previous block.
        const prev = row[j - 1];
        x = prev.x + w + padding;
      }

      row.push({ x, y, w, h });
    }

    blocks.push(row);
  }
  return blocks;
}

// Represents all game state.
const initialState = {
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
    const { projectile, blocks } = updateProjectileAndBlocks(state);
      const updates = Object.assign({}, state, {
      projectile,
      blocks,
      paddle: updatePaddle(state)
    });

    // Game ends if the projectile hits the bottom of the game field.
    if (updates.projectile.y + updates.projectile.size >= updates.boardSize) {
      return Object.assign({}, state, { gameOver: true });
    }

    if (updates.blocks.every(block => !block)) {
      return Object.assign({}, state, { isWon: true });
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

function updateProjectileAndBlocks(state) {
  const { projectile } = state;
  const { x, y, dx, dy, size } = projectile;

  const updates = Object.assign({}, projectile);

  // Is the projectile hitting the sides of the game field?
  if (x >= state.boardSize - size || x < 0) {
    updates.dx = -dx;
  }

  const nextBlocks = state.blocks.concat();
  for (let i = 0; i < nextBlocks.length; i++) {
    let block = nextBlocks[i];

    // No need to detect collisions on a block that's been destroyed.
    if (!block) {
      continue;
    }

    if ((x + size > block.x) && (x < block.x + block.w) && y <= block.y + block.h) {
      updates.dy = -dy;
      nextBlocks[i] = null;
      // break; // TODO: can only one block be removed in a single frame? If not, don't break the loop once a block is destroyed
    }
  }

  // Blocks and projectile are coupled -- what is the best way to update them?
  //   - General issue is with two distinct 'entities', you'd like to keep them
  //     as separate as possible to keep things neat and tidy, but they both ask
  //     the same questions around game state. Is it ok to ask them twice? Or should
  //     the work to update the projectile/blocks live in the same place?

  const inBetweenPaddles = ((x + size > state.paddle.x) &&
                            (x < state.paddle.x + state.paddle.w));
  const isHittingPaddle = ((y + size) >= (state.boardSize - state.paddle.h));
  if (inBetweenPaddles && isHittingPaddle || y < 0) {
    updates.dy = -dy;
  }

  // After updating the x/y velocity, move the projectile forward.
  updates.x = projectile.x + updates.dx;
  updates.y = projectile.y + updates.dy;

  return {
    projectile: Object.assign({}, state,projectile, updates),
    blocks: nextBlocks
  };
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
  initialState,
  update,
  defaultOptions
};
