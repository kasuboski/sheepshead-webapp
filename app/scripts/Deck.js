class Deck {
  constructor(createCards) {
    this.cards = [];

    if(!createCards) {
      createCardsDefault(this.cards);
    } else {
      createCards(this.cards);
    }
  }

  draw() {
    let randIndex = Math.round(Math.random()*(this.cards.length-1));
    return this.cards.splice(randIndex, 1)[0];
  }

}

let createCardsDefault = function (cards) {
  for(let suit=0; suit < 4; suit++) {
    for(let i=2; i <= 14; i++) {
      cards.push(new SheepsheadCard(i, suits[suit], i, i, `images/playingcards/PNG-cards-1.3/${Card.getName(i)}_of_${suits[suit]}.png`));
    }
  }
}