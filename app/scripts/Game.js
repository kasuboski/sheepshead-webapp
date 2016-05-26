import {Player} from './Player.js';
import {Deck} from './Deck.js';
import {SheepsheadCard} from './SheepsheadCard.js';

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
  DEALING: 1,
  PICKING: 2,
  PLAYERTURN: 3, 
  TRICKOVER: 4,
  GAMEOVER: 5
};

export const events = {
  ASK_TO_PICK: 'askToPick',
  PICKED: 'userPicked',
  UPDATE_HAND: 'updateHand'
}

export class Game {
  constructor(players, deck) {
    this.players = players;
    this.currPlayerIndex = 0;
    this.playersToPlay = this.players.length;
    this.deck = deck;
    this.blind = [];
    this.trick = [];
    this.state = states.DEALING;

    this._subscribeToEvents();
  }

  _subscribeToEvents() {
    this.pickedToken = PubSub.subscribe(events.PICKED, (msg, data) => {
      this._handlePlayerPickingResponse(data);
    });
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
    this.playersToPlay--; //keep track of how many we've asked to pick
    let currPlayer = this.players[this.currPlayerIndex]

    if(this.playersToPlay == 0) {
      //this is the last player
      //they must pick
      this._pickBlind(currPlayer);
      this.state = states.PLAYERTURN;
    }
    //if player with option to pick is human ask if they want to pick
     else if(currPlayer.isPlayer) {
      PubSub.publish(events.ASK_TO_PICK, 'Find out if human wants to pick');
    } else {
      //if computer player wants to pick
      if(this._compWantsToPick(currPlayer)) {
        //pick
        this._pickBlind(currPlayer);
        this.state = states.PLAYERTURN;
      } else {
        //try the next player
        this._nextPlayer();
        this._pick();
      }
    }
  }

  _handlePlayerPickingResponse(response) {
    if(response == 'yes') {
        this._pickBlind(this.players[this.currPlayerIndex]);
        //find out which cards they want to bury
        
    } else if(response == 'no') {
      //ask the next player
      this._nextPlayer();
      this._pick();
    } else {
      throw "Player response wasn't valid";
    }
  }

  _pickBlind(player) {
    player.addCards(this.blind);
    this.blind = [];

    if(player.isPlayer) {
      //sort hand again
      player.sortHand();
      PubSub.publish(events.UPDATE_HAND, {reason: "Update player hand after picking blind", cards: player.hand});
    } else {
      player.compBury();
    }
  }

  _compWantsToPick(player) {
    //won't pick unless has more than 6 'good' cards
    let goodCardCount = 0;
    player.hand.forEach(card => {
      if(card.isTrump() || SheepsheadCard.getName(card.identifier) == 'ace') {
        goodCardCount++;
      }
    });
    
    return goodCardCount > 6;
  }

  _nextPlayer() {
    this.currPlayerIndex = (this.currPlayerIndex + 1) % this.players.length;
  }
}