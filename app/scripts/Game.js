import {Player} from './Player.js';
import {Deck} from './Deck.js';
import {SheepsheadCard} from './SheepsheadCard.js';
import {states, StateManager} from './StateManager.js';

export const events = {
  ASK_TO_PICK: 'askToPick',
  ASK_TO_BURY: 'askToBury',
  USER_BURY: 'userBury',
  PICKED: 'userPicked',
  UPDATE_HAND: 'updateHand'
}

export const GameConstants = {
  NUM_PLAYERS: 3,
  NUM_CARDS: 10,
  NUM_BLIND: 2
}

export class Game {
  constructor(players, deck) {
    this.players = players;
    this.currPlayerIndex = 0;
    this.playersToPlay = this.players.length;
    this.deck = deck;
    this.blind = [];
    this.trick = [];
    this.stateManager = new StateManager();

    this._subscribeToEvents();
  }

  _subscribeToEvents() {
    this.pickedToken = PubSub.subscribe(events.PICKED, (msg, data) => {
      this._handlePlayerPickingResponse(data);
    });

    this.buriedToken = PubSub.subscribe(events.USER_BURY, (msg, data) => {
      console.log("User burying");
      data.player.buryAll(data.cards);

      this.stateManager.nextState();
    });
  }

  _deal() {
    this.players.forEach(player => {
      for(let i=0; i < GameConstants.NUM_CARDS; i++) {
        player.addCard(this.deck.draw());
      }
      player.sortHand();
    });

    for(let i=0; i < GameConstants.NUM_BLIND; i++) {
      this.blind.push(this.deck.draw());
    }
  }

  getState() {
    return this.stateManager.state;
  }

  startGame() {
    this._deal();
    this.stateManager.nextState();
    this._pick();
  }

  _pick() {
    this.playersToPlay--; //keep track of how many we've asked to pick
    let currPlayer = this.players[this.currPlayerIndex]

    if(this.playersToPlay == 0) {
      //this is the last player
      //they must pick
      this._pickBlind(currPlayer);
      this.stateManager.nextState();
    }
    //if player with option to pick is human ask if they want to pick
     else if(currPlayer.isPlayer) {
      PubSub.publish(events.ASK_TO_PICK, 'Find out if human wants to pick');
    } else {
      //if computer player wants to pick
      if(this._compWantsToPick(currPlayer)) {
        //pick
        this._pickBlind(currPlayer);
        this.stateManager.nextState();
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
        PubSub.publish(events.ASK_TO_BURY, 'Find out which cards the user wants to bury');
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