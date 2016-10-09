import {EventHelper} from './EventHelper.js';
import {createStore} from 'redux';

/*
  States of the game
  - Dealing
  - Picking
  - Each Player plays turn
  - Trick Over
  - Game Over

  Dealing => Picking => (Each player plays turn => Trick Over) #cards times => Game Over
*/
export const states = {
  DEALING: 'dealing',
  PICKING: 'picking',
  PLAYERTURN: 'playerTurn', 
  TRICKOVER: 'trickOver',
  GAMEOVER: 'gameOver'
};

function reducer(state = {stateString: states.DEALING}, action) {
  var newState = '';
  const stateString = state.stateString;
  if(action.type == 'NEXT_STATE') {
    switch (stateString) {
    case states.DEALING:
      newState = states.PICKING;
      break;
    case states.PICKING:
      newState = states.PLAYERTURN;
      break;
    case states.PLAYERTURN:
      newState = states.GAMEOVER;
      break;
    case states.TRICKOVER:
      newState = states.GAMEOVER;
      break;
    case states.GAMEOVER:
      newState = states.DEALING;
      break;
    default:
      newState = state.stateString
      break;
    }

    return {stateString: newState};
  }
  return state;
}

let store = createStore(reducer);

store.subscribe(() => {
  const stateString = store.getState().stateString;
  EventHelper.publish(EventHelper.events.UPDATE_STATE, {state: stateString});
    console.log(`State is now ${stateString}`);
});

export class StateManager {

  getState() {
    return store.getState().stateString;
  }

  nextState() {
    store.dispatch({type: 'NEXT_STATE'});
  }

}