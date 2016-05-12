class Card {
  constructor(identifier, suit, rank, points, image) {
    this.identifier = identifier;
    this.suit = suit;
    this.rank = rank;
    this.points = points;
    this.image = image;
  }

  toString() {
    return `${Card.getName(this.identifier)} of ${this.suit}`;
  }

  static getName(identifier) {
    switch(identifier) {
      case 10:
        return "jack";
      case 11:
        return "queen";
      case 12:
        return "king";
      case 13:
        return "ace";
      default:
        return identifier;
    }
  }
}