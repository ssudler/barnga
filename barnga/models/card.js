var card = class {

  constructor(suit, number) {
    /*
      0 - Hearts
      1 - Diamonds
      2 - Clubs
      3 - Spades
    */
    this.suit = suit;
    // 1-13
    this.number = number;

    // Whether or not the card is showing to everyone
    this.revealed = false;
  }

  // Flip the card over so others can see it
  flip() {
    this.revealed = 1 - this.revealed;
  }

  // Gives the name as a string
  getName() {
    let name = this.number;

    switch (name) {
      case 11:
        name = "Jack"
        break
      case 12:
        name = "Queen"
        break
      case 13:
        name = "King"
        break
      case 1:
        name = "Ace"
        break
      default:
        name = this.number;
    }

    return name + " of " + ["Hearts", "Diamonds", "Clubs", "Spades"][this.suit];
  }

  // Get a compressed version of the object
  getCompressed() {
    return {
      suit: this.suit,
      number: this.number,
      revealed: this.revealed,
      toString: this.getName
    }
  }

  toString() {
    return this.getName();
  }

}

module.exports = card;
