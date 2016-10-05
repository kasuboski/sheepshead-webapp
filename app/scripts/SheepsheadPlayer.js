import {Player} from './Player.js';
export class SheepsheadPlayer extends Player {
  constructor(isPlayer, name) {
    super(isPlayer, name);
    this.isPicker = false;

    this.points = 0;
  }

  compBury() {
    if(this.isPlayer) {
      throw "Can only call compBury on computer player";
    }

    this.sortHand();
    //use two lowest cards
    this.bury(this.hand[0]);
    this.bury(this.hand[0]);
  }

  bury(card) {
    this.points += card.points;
    this.hand.splice(this.hand.indexOf(card), 1);
  }

  buryAll(cards) {
    cards.forEach(card => {
      this.bury(card);
    });
  }

  playCard(card) {
    this.hand.splice(this.hand.indexOf(card), 1);
  }
}