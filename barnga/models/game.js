const Player = require('./player.js');
const Card = require('./card.js')
const config = require('../config');

var game = class {

  constructor(gameId, numberOfCards = 7, removeGame) {
    // Like kahoot or Jackbox, use a short code to identify a game
    this.id = gameId;

    // Number of cards per player
    this.numberOfCards = numberOfCards

    // List of players
    this.players = {};
    this.playerCount = 0;

    if (config.oneDeckPerGame) {
      this.deck = new Array(52);
      for (var i = 0; i < 52; i++) { this.deck[i] = new Card(i / 13, i); }
    }

    // A callback which can be used to self destruct the game
    this.destructionCallback = removeGame

  }

  // Add a player to the game
  addPlayer(socket, name) {
    this.players[socket.id] = (new Player(name, socket, this.numberOfCards, this.deck));
    var player = this.players[socket.id];

    // set up socket interactions
    socket.on('moveCardToHand', function(cardIndex) {
      player.moveCardToHand(cardIndex);
    });

    socket.on('moveCardToTable', function(cardIndex) {
      player.moveCardToTable(cardIndex);
    });

    socket.on('revealCard', function(cardIndex) {
      player.revealCard(cardIndex);
    });

    socket.on('moveCard', function(cardIndex, x, y) {
      player.moveCard(cardIndex, x, y);
    });

    socket.on('disconnect', function() {
      removePlayer(socket.id)
    });

    // Increment count
    this.playerCount++;
  }

  // Remove a player from the game
  removePlayer(id) {
    this.players[id] = null;

    this.playerCount--;

    // If game is empty, destroy the game
    if (this.playerCount === 0) {
      this.destructionCallback(this.id);
    }
  }


  // Emit to all sockets current game info
  update() {
    var compressedPlayers = {};

    for (key in this.players) {
      compressedPlayers[key] = this.players[key].getCompressed();
    }

    for (key in this.players) {
      this.players[key].socket.emit('gameUpdate', compressedPlayers);
    }
  }

}

module.exports = game;
