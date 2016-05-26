export class Player {
  constructor(isPlayer, name) {
    this.isPlayer = isPlayer;
    this.name = name;
    this.score = 0; //points for the game
    this.points = 0; //points for the hand
    this.hand = [];
  }

  addCard(card) {
    card.owner = this;
    this.hand.push(card);
  }

  addCards(cards) {
    cards.forEach(card => {
      this.addCard(card);
    })
  }

  sortHand() {
    //can only call if have at least one card in hand
    this.hand.sort(this.hand[0].compare);
  }
}