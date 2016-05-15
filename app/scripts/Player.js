class Player {
  constructor(isPlayer, name) {
    this.isPlayer = isPlayer;
    this.name = name;
    this.score = 0; //points for the game
    this.points = 0; //points for the hand
    this.hand = [];
  }
}