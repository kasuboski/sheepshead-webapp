/*
  States of the game
  - Dealing
  - Picking
  - Each Player plays turn
  - Trick Over
  - Game Over

  Dealing => Picking => (Each player plays turn => Trick Over) #cards times => Game Over
*/
let states = {
  DEALING: 1,
  PICKING: 2,
  PLAYERTURN: 3, 
  TRICKOVER: 4,
  GAMEOVER: 5
};

class Game {
  constructor(players, deck) {
    this.players = players;
    this.currPlayer = players[0];
    this.deck = deck;
    this.blind = [];
    this.trick = [];
    this.state = states.DEALING;
  }

  _deal() {
    this.players.forEach(player => {
      for(let i=0; i < 10; i++) {
        player.hand.push(this.deck.draw());
      }
    });
  }

  startGame() {
    this._deal();
    this.state = states.PICKING;
  }
}