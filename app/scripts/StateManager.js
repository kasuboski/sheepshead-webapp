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

export class StateManager {

  constructor() {
    this.state = states.DEALING;
  }

  nextState() {
    switch(this.state) {
      case states.DEALING:
        this.state = states.PICKING;
        break;
      case states.PICKING:
        this.state = states.PLAYERTURN;
        break;
      case states.PLAYERTURN:
        this.state = states.TRICKOVER;
        break;
      case states.TRICKOVER:
        this.state = states.GAMEOVER;
        break;
      case states.GAMEOVER:
        this.state = DEALING;
        break;
      default: throw "Invalid State";
    }
    console.log("State is now " + this.state);
  }

}