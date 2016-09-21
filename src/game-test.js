/* eslint-disable */
import { update, model, defaultOptions } from './game';
import u from 'updeep';

describe('game logic', function() {
  it('moves the projectile forward', function() {
    const actual = update(model, { type: 'TICK' });

    expect(actual.projectile.x).to.eql(model.projectile.x + model.projectile.dx);
    expect(actual.projectile.y).to.eql(model.projectile.y + model.projectile.dy);
  });

  it('knows when to bounce the projectile off a wall', function() {
    const state = u({
      projectile: {
        x: 270,
        y: 10,
      }
    }, model);

    const actual = update(state, { type: 'TICK' });

    expect(actual.projectile.x).to.eql(269);
    expect(actual.projectile.dx).to.eql(-1);
  });

  it('starts with the paddle in the center', function() {
    expect(model.paddle.x).to.equal((model.boardSize / 2) - (model.paddle.w / 2));
    expect(model.paddle.y).to.equal(model.boardSize - model.paddle.h);
  });

  it('redirects the projectile after colliding with the paddle', function() {
    const state = u({
      projectile: {
        // Send the projectile towards the center (the default paddle location)
        x: model.boardSize / 2,
        y: model.boardSize - model.projectile.size - model.paddle.h,
        dx: 1,
        dy: 1,
      },
    }, model);

    const actual = update(state, { type: 'TICK' });

    expect(actual.projectile.dy).to.eql(-1);
  });

  it('knows that the projectile hitting the bottom of the game field ends in crushing defeat', function() {
    const state = u({
      projectile: {
        x: model.boardSize / 2,
        y: model.boardSize - model.projectile.size,
        dx: 1,
        dy: 1,
        size: 30
      },
      paddle: {
        x: 0 // Move the paddle out of the way
      }
    }, model);

    const actual = update(state, { type: 'TICK' });

    expect(actual.gameOver).to.be.true;
  });

  it('moves the paddle left or right in response to key presses');
  it('starts with some bricks');
  it('removes a brick if the projectile collides with it');
  it('redirects the projectile after colliding with a block')

  it('keeps track of which keys are pressed', function() {
    const actual = update(model, {
      type: 'UPDATE_KEYS',
      payload: {
        key: 'left',
        value: true
      }
    });

    expect(actual.keys).to.eql({
      left: true,
      right: false
    })
  });
});

/* eslint-enable */
