const Game = require('./game.js');
const config = require('../config');

var gameManager = class {

  constructor() {
    // All games
    this.games = {}
  }

  // Create a new game, return gameId
  createGame(numberOfCards) {
    // Random number with correct number of digits
    var id = Math.floor(Math.random() * Math.floor(10 * config.gameIdDigits));

    this.games[id] = new Game(id, numberOfCards, (gameId) => { this.removeGame(gameId) });
    return id;
  }

  // Add a player to a game
  addPlayerToGame(gameId, socket, name) {
    // If game does not exist, join is unsuccessful
    if (this.games[gameId] !== null) {
      this.games[gameId].addPlayer(socket, name);
      return true;
    } else {
      return false;
    }
  }

  // End a game
  removeGame(gameId) {
    this.games[id] = null;
  }

}

module.exports = gameManager;
