const Game = require('./game.js');
const config = require('../config');

var gameManager = class {

  constructor() {
    // All games
    this.games = {}
  }

  // Create a new game, return gameId
  createGame(numberOfCards, owner, filter) {
    // Random number with correct number of digits
    var id = Math.floor(Math.random() * Math.floor(Math.pow(10, config.gameIdDigits)));

    while (this.games.hasOwnProperty(id)) {
      id = Math.floor(Math.random() * Math.floor(Math.pow(10, config.gameIdDigits)));
    }

    this.games[id] = new Game(id, numberOfCards, owner, filter, (gameId) => { this.removeGame(gameId) });
    return this.games[id];
  }

  // Add a player to a game
  addPlayerToGame(gameId, socket, name) {
    // If game does not exist, join is unsuccessful
    if (this.games[gameId] != null) {
      if (this.games[gameId].started) {
        this.games[gameId].addPlayerSpectator(socket, name);
      } else {
        this.games[gameId].addPlayer(socket, name);
      }
      return true;
    } else {
      return false;
    }
  }

  // End a game
  removeGame(gameId) {
    delete this.games[gameId];
  }

}

module.exports = gameManager;
