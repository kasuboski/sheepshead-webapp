import {Player} from './Player.js';
import {Deck} from './Deck.js';
import {SheepsheadCard} from './SheepsheadCard.js';
import {states, StateManager} from './StateManager.js';
import {EventHelper} from './EventHelper.js';
import {GameUtil} from './GameUtil.js';

export const GameConstants = {
  NUM_PLAYERS: 3,
  NUM_CARDS: 10,
  NUM_BLIND: 2
}

export class Game {
  constructor(players) {
    this.players = players;
    this.currPlayerIndex = 0;
    this.playersToPlay = this.players.length;
    this.deck = new Deck(GameUtil.loadCards);;
    this.blind = [];
    this.trick = [];
    this.stateManager = new StateManager();

    this._subscribeToEvents();
  }

  _subscribeToEvents() {
    this.pickedToken = EventHelper.subscribe(EventHelper.events.PICKED, (msg, data) => {
      this._handlePlayerPickingResponse(data);
    });

    this.buriedToken = EventHelper.subscribe(EventHelper.events.USER_BURY, (msg, data) => {
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
      EventHelper.publish(EventHelper.events.ASK_TO_PICK, 'Find out if human wants to pick');
    } else {
      //if computer player wants to pick
      if(Game._compWantsToPick(currPlayer)) {
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
        EventHelper.publish(EventHelper.events.ASK_TO_BURY, 'Find out which cards the user wants to bury');
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
      EventHelper.publish(EventHelper.events.UPDATE_HAND, {reason: "Update player hand after picking blind", cards: player.hand});
    } else {
      player.compBury();
    }
  }

  static _compWantsToPick(player) {
    //won't pick unless has more than 6 'good' cards
    let goodCardCount = 0;
    player.hand.forEach(card => {
      if(Game._isGoodCard(card)) {
        goodCardCount++;
      }
    });
    
    return goodCardCount > 6;
  }

  static _isGoodCard(card) {
    return card.isTrump() || SheepsheadCard.getName(card.identifier) == 'ace';
  }

  _nextPlayer() {
    this.currPlayerIndex = (this.currPlayerIndex + 1) % this.players.length;
  }
}