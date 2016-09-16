import { combineReducers } from 'redux';

function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT_COUNTER': {
      return state + 1;
    }
  }
  return state;
}

const rootReducer = combineReducers({
  counter
});

export default rootReducer;
