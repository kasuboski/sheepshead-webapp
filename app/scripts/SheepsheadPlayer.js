class SheepsheadPlayer extends Player {
  constructor(isPlayer, name) {
    super(isPlayer, name);
  }

  compBury() {
    if(!this.isPlayer) {
      throw "Can only call compBury on computer player";
    }

    this.sortHand();
    //use two lowest cards
    bury(this.hand[0]);
    bury(this.hand[0]);
  }

  bury(card) {
    this.points += card.points;
    this.hand.remove(card);
  }
}