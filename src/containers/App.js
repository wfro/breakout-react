import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { incrementCounter } from '../actions';

class App extends Component {
  render() {
    return (
      <div>
        <h1>This is most certainly a counter</h1>
        <p>counter: {this.props.counter}</p>
        <button onClick={this.props.incrementCounter}>click me plox</button>
      </div>
    );
  }
}

App.propTypes = {
  counter: PropTypes.number.isRequired,
  incrementCounter: PropTypes.func.isRequired
};

export default connect((state) => {
  return {
    counter: state.counter
  };
}, (dispatch) => {
  return {
    incrementCounter: () => {
      dispatch(incrementCounter());
    }
  };
})(App);
