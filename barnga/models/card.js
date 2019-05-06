//
//  models/card.js
//  Barnga
//
//  Created by Robert May on 5/3/19.
//  Copyright © 2019 Robert May. All rights reserved.
//

var Card = class {

  constructor(suit, number) {
    /*
      0 - hearts
      1 - diamonds
      2 - clubs
      3 - spades
    */
    this.suit = suit;
    // 1-13
    this.number = number;

    // Whether or not the card is showing to everyone
    this.revealed = false;

    // Coordinates of cards on table
    this.x = 0;
    this.y = 0;
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
        name = "Jack";
        break;
      case 12:
        name = "Queen";
        break;
      case 13:
        name = "King";
        break;
      case 1:
        name = "Ace";
        break;
      default:
        name = this.number;
    }

    return name + " of " + ["Hearts", "Diamonds", "Clubs", "Spades"][this.suit];
  }

  // Move card
  moveCardOnTable(x, y) {
    this.x = x,
    this.y = y
  }

  // Get a compressed version of the object
  getCompressed() {
    return {
      suit: this.suit,
      number: this.number,
      revealed: this.revealed,
      toString: this.getName,
      x: this.x,
      y: this.y
    }
  }

  toString() {
    return this.getName();
  }

};

module.exports = Card;
