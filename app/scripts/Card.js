let suits = ['clubs', 'spades', 'hearts', 'diamonds'];
class Card {
  constructor(identifier, suit, rank, points, image) {
    this.identifier = identifier;
    this.suit = suit;
    this.rank = rank;
    this.points = points;
    this.image = image;
    this.owner = null;
  }

  toString() {
    return `${Card.getName(this.identifier)} of ${this.suit}`;
  }

  static getName(identifier) {
    switch(identifier) {
      case 11:
        return 'jack';
      case 12:
        return 'queen';
      case 13:
        return 'king';
      case 14:
        return 'ace';
      default:
        return identifier;
    }
  }
}