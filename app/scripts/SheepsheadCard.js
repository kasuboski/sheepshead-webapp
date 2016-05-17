class SheepsheadCard extends Card {
  constructor(identifier, suit, rank, points, image) {
    super(identifier, suit, rank, points, image);
  }

  isTrump() {
    return this.rank >= 7;
  }

  compare(a, other) {
    //if both trump sort by rank
    if (a.isTrump() && other.isTrump()) {
      return a.rank - other.rank;
    }
    else if (a.isTrump() && !other.isTrump()) {
      return 1;
    }
    else if (!a.isTrump() && other.isTrump()) {
      return -1;
    }
    //if same suit sort by rank
    else if (a.suit == other.suit) {
      return a.rank - other.rank;
    }
    else {
      return suits.indexOf(a.suit) - suits.indexOf(other.suit);
    }
  }
}