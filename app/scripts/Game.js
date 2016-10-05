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

let startToken = EventHelper.subscribe(EventHelper.events.START_GAME, (msg, data) => {
  let game = new Game(data.players);
  game.startGame();
});

export class Game {
  constructor(players) {
    this.players = players;
    this.currPlayerIndex = 0;
    this.lastWinIndex = 0;
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
      this._handlePlayerBury(data.player, data.cards);
    });

    this.playedCardToken = EventHelper.subscribe(EventHelper.events.PLAYED_CARD, (msg, data) => {
      console.log("player played: " + data.card);
      this._handlePlayerPlayed(data.player, data.card);
    });

    this.compPlayerUpdatedToken = EventHelper.subscribe(EventHelper.events.COMP_PLAYER_UPDATED, (msg, data) => {
      this._nextPlayer();
      this._playTurn();
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
    //TODO: Fix this so human player isn't assumed to be the first in the array
    EventHelper.publish(EventHelper.events.UPDATE_HAND, {reason: "Update player hand after dealing", cards: this.players[0].hand});
    this.stateManager.nextState();
    this._determinePicker();
  }

  _determinePicker() {
    this.playersToPlay--; //keep track of how many we've asked to pick
    let currPlayer = this.players[this.currPlayerIndex]

    if(this.playersToPlay == 0) {
      //TODO: If human player tell them they were forced to pick
      //this is the last player
      //they must pick
      this._pickBlind(currPlayer);

      this.stateManager.nextState();
      this._getReadyToPlayTrick();
    }
    //if player with option to pick is human ask if they want to pick
     else if(currPlayer.isPlayer) {
      EventHelper.publish(EventHelper.events.ASK_TO_PICK, 'Find out if human wants to pick');
    } else {
      //if computer player wants to pick
      if(GameUtil.compWantsToPick(currPlayer)) {
        //pick
        this._pickBlind(currPlayer);

        this.stateManager.nextState();
        this._getReadyToPlayTrick();
      } else {
        //try the next player
        this._nextPlayer();
        this._determinePicker();
      }
    }
  }

  _getReadyToPlayTrick() {
    console.log('Starting new trick');
    this.playersToPlay = this.players.length;
    //person to go first is whoever won last initially the human player
    this.currPlayerIndex = this.lastWinIndex;

    this._playTurn();
  }

  _playTurn() {
    this.playersToPlay--;
    let currPlayer = this.players[this.currPlayerIndex];

    console.log(`It is ${currPlayer.name}'s turn`);

    if(this.playersToPlay < 0) {
      //the trick is over
      if(this.players[0].hand.length > 0) {
        //there are still cards to play
        //start next trick
        this._getReadyToPlayTrick();
      } else {
        //the game is over
        //TODO: handle game over
      }
    } else {
      //some players still need to play
      if(currPlayer.isPlayer) {
        //handle human player
        //find out which card they want to play
        EventHelper.publish(EventHelper.events.ASK_TO_PLAY, 'Find out which card the user wants to play');
      } else {
        //handle computer player
        let playedCard = GameUtil.compPlayCard(this.trick, currPlayer);
        EventHelper.publish(EventHelper.events.COMP_PLAYER_PLAYED, {player: currPlayer, card: playedCard});
      }
    }
  }

  _handlePlayerPlayed(player, card) {
    //assume UI validated card already
    // this.trick.push(card);
    // player.playCard(card);

    GameUtil.playCard(this.trick, player, card);
    EventHelper.publish(EventHelper.events.UPDATE_HAND, {reason: "Update player hand after playing a card", cards: player.hand});

    this._nextPlayer();
    this._playTurn();
  }

  _handlePlayerPickingResponse(response) {
    if(response == 'yes') {
        this._pickBlind(this.players[this.currPlayerIndex]);
        //find out which cards they want to bury
        EventHelper.publish(EventHelper.events.ASK_TO_BURY, 'Find out which cards the user wants to bury');
    } else if(response == 'no') {
      //ask the next player
      this._nextPlayer();
      this._determinePicker();
    } else {
      throw "Player response wasn't valid";
    }
  }

  _handlePlayerBury(player, cards) {
      console.log("User burying");
      player.buryAll(cards);

      EventHelper.publish(EventHelper.events.UPDATE_HAND, {reason: "Update player hand after picking burying", cards: player.hand});

      this.stateManager.nextState();
      this._getReadyToPlayTrick();
  }

  _pickBlind(player) {
    console.log(`${player.name} picked`);
    player.addCards(this.blind);
    this.blind = [];

    player.isPicker = true;

    if(player.isPlayer) {
      //sort hand again
      player.sortHand();
      EventHelper.publish(EventHelper.events.UPDATE_HAND, {reason: "Update player hand after picking blind", cards: player.hand});
    } else {
      player.compBury();
    }
  }

  _nextPlayer() {
    this.currPlayerIndex = (this.currPlayerIndex + 1) % this.players.length;
  }
}