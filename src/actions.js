export default {
  startGame: {
    type: 'START_GAME'
  },

  tick: {
    type: 'TICK'
  },

  updateKeys(key, value) {
    return {
      type: 'UPDATE_KEYS',
      payload: {
        key,
        value
      }
    };
  }
};
