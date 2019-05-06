const Card = require('./card.js');
const config = require('../config');

var player = class {

  constructor(name, socket, numberOfCards, deck=[]) {
    // Display name and unique identifier for code
    this.name = name;
    this.id = socket.id;

    // Socket.io socket
    this.socket = socket;

    // Helper function for generation of hand
    function randInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    // The cards in the player's hand. Only the player can see these
    this.hand = new Array(numberOfCards);

    if (config.oneDeckPerGame) {
      // Randomly pick cards from deck
      for (var i = 0; i < numberOfCards; i++) {
        this.hand[i] = deck.pop(randInt(deck.length));

        // Refill deck if empty
        if (deck.length === 0) {
          for (var j = 0; j < 52; j++) { deck[j] = new Card(j / 13, j); }
        }
      }
    } else {
      // Randomly generate the cards
      for (var i = 0; i < numberOfCards; i++) { this.hand[i] = new Card(randInt(3), randInt(13) + 1); }
    }

    /* Card the player has put on the table.
      * Player can choose to reveal cards on the table
      * Player can see the card name but not the card unless revealed
      * All other players cannot see card or card name unless revealed
      */
    this.table = []
  }

  // Move a card from the hand to the table
  moveCardToTable(cardIndex) {
    if (cardIndex < this.hand.length) this.table.push(this.hand.pop(cardIndex));
  }

  // Move a card from the table to the hand
  moveCardToHand(cardIndex) {
    if (cardIndex < this.table.length) this.hand.push(this.table.pop(cardIndex));
  }

  // Reveal a card on the table
  revealCard(cardIndex) {
    if (cardIndex < this.table.length) this.table[cardIndex].flip();
  }

  moveCard(cardIndex, x, y) {
    if (cardIndex < this.table.length) {
      this.table[cardIndex].x = x;
      this.table[cardIndex].y = y;
    }
  }

  // Get a compressed version of the object
  getCompressed() {
    return {
      name: this.name,
      id: this.id,
      hand: this.hand.map(card => card.getCompressed()),
      table: this.table.map(card => card.getCompressed())
    }
  }

}

module.exports = player
