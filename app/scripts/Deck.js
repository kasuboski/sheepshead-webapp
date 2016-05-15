let suits = ["clubs", "spades", "hearts", "diamonds"];
class Deck {
  constructor() {
    this.cards = [];
    this.createCards();
  }

  createCards() {
    for(let suit=0; suit < 4; suit++) {
      for(let i=2; i <= 13; i++) {
        this.cards.push(new Card(i, suits[suit], i+suit, i-suit, `images/playingcards/PNG-cards-1.3/${Card.getName(i)}_of_${suits[suit]}.png`));
      }
    }
  }

  draw() {
    let randIndex = Math.round(Math.random()*(this.cards.length-1));
    return this.cards.splice(randIndex, 1)[0];
  }

}