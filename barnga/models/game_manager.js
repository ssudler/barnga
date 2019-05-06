//
//  models/game_manager.js
//  Barnga
//
//  Created by Robert May on 5/3/19.
//  Copyright © 2019 Robert May. All rights reserved.
//

const Game = require('./game.js');
const config = require('../config');

var GameManager = class {

  constructor() {
    // All games
    this.games = {}
  }

  // End a game
  removeGame(gameId) {
    delete this.games[gameId];
  }

  // Create a new game, return gameId
  createGame(numberOfCards, owner, filter) {
    // Random number with correct number of digits
    var id = Math.floor(Math.random() * Math.floor(Math.pow(10, config.gameIdDigits)));

    while (this.games.hasOwnProperty(id)) {
      id = Math.floor(Math.random() * Math.floor(Math.pow(10, config.gameIdDigits)));
    }

    var self = this;
    this.games[id] = new Game(id, numberOfCards, owner, filter, (gameId) => { self.removeGame(gameId) });
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

};

module.exports = GameManager;
