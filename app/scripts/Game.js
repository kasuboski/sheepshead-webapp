/*
  States of the game
  - Dealing
  - Picking
  - Each Player plays turn
  - Trick Over
  - Game Over

  Dealing => Picking => (Each player plays turn => Trick Over) #cards times => Game Over
*/
const states = {
  DEALING: 1,
  PICKING: 2,
  PLAYERTURN: 3, 
  TRICKOVER: 4,
  GAMEOVER: 5
};

const events = {
  PICK: 'pick',
  UPDATE_HAND: 'updateHand'
}

class Game {
  constructor(players, deck) {
    this.players = players;
    this.currPlayerIndex = 0;
    this.deck = deck;
    this.blind = [];
    this.trick = [];
    this.state = states.DEALING;
  }

  _deal() {
    this.players.forEach(player => {
      for(let i=0; i < 10; i++) {
        player.addCard(this.deck.draw());
      }
      player.sortHand();
    });

    for(let i=0; i < 2; i++) {
      this.blind.push(this.deck.draw());
    }
  }

  startGame() {
    this._deal();
    this.state = states.PICKING;
    this._pick();
  }

  _pick() {
    let currPlayer = this.players[this.currPlayerIndex]
    //if player with option to pick is human ask if they want to pick
    if(currPlayer.isPlayer) {
      PubSub.publish(events.PICK, 'Find out if human wants to pick');
    } else {
      //if computer player wants to pick
      if(_compWantsToPick(currPlayer)) {
        //pick
      } else {
        //try the next player unless at last player
      }
    }
  }

  _pickBlind(player) {
    player.addCards(this.blind);
    this.blind = [];

    //sort hand again
    player.sortHand();

    if(player.isPlayer) {
      PubSub.publish(events.UPDATE_HAND, "Update player hand after picking blind");
    } else {
      player.compBury();
    }
  }

  _doesCompWantToPick(player) {
    //won't pick unless has more than 6 'good' cards
    let goodCardCount = 0;
    player.hand.forEach(card => {
      if(card.isTrump() || Card.getName(card.identifier) == 'ace') {
        goodCardCount++;
      }
    });
    
    return goodCardCount > 6;
  }
}