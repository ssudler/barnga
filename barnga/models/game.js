//
//  models/game.js
//  Barnga
//
//  Created by Robert May on 5/3/19.
//  Copyright © 2019 Robert May. All rights reserved.
//

const Player = require('./player.js');
const Card = require('./card.js');
const RuleManager = require('./rule_manager.js');
const config = require('../config');

var Game = class {

  constructor(gameId, numberOfCards = 7, owner, filter, removeGame) {
    // Use a short code to identify a game
    this.id = gameId;

    // Number of cards per player
    this.numberOfCards = numberOfCards;

    // Filter inappropriate names
    this.filter = filter;

    // List of players
    this.players = {};
    this.playerCount = 0;

    // Player that initiated the game
    this.owner = owner;

    // Secret code passed to owner so that they can set themselves as the owner
    this.ownerCode = Math.floor(Math.random() * Math.floor(100000));

    // Has the game been started
    this.started = false;

    if (config.oneDeckPerGame) {
      this.deck = new Array(52);
      for (var i = 0; i < 52; i++) { this.deck[i] = new Card(Math.floor(i / 13), i); }
    }

    // A callback which can be used to self destruct the game
    this.destructionCallback = removeGame;

    // Start constantly updating players
    setInterval(()=>{ this.update() }, 1000/config.fps)

  }

  // Set the owner if owner code is correct and there is not already an owner
  setOwner(ownerId, code) {
    if (!this.owner && this.ownerCode == code) { this.owner = ownerId; }
  }

  // Add a player to the game
  addPlayer(socket, name) {
    this.players[socket.id] = (new Player(name, socket, this.numberOfCards, this.deck));
    var player = this.players[socket.id];
    var self = this;

    // set up socket interactions with player
    player.setUpSocket();

    // set up socket interactions with game
    socket.on('setOwner', function(ownerCode) {
      self.setOwner(player.socket.id, ownerCode);
    });

    socket.on('disconnect', function() {
      self.removePlayer(player.socket.id)
    });

    // The owner has permission to start the game
    if (socket.id === this.owner) {
      socket.on('startGame', function() {
        self.startGame();
      })
    }

    // Increment count
    this.playerCount++;
  }

  startGame() {
    this.started = true;

    // Rule sharing
    this.ruleManager = new RuleManager(players, config.drawingTime * 1000);
    let ruleManager = this.ruleManager;
    ruleManager.requestRules(()=> {
      ruleManager.shareRules();
    });
  }

  addPlayerSpectator(socket, name) {
    // Create a spectator; no game data, just gets updates
    this.players[socket.id] = {
      socket: socket,
      name: name,
      getCompressed: () => { return null }
    }
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
    var compressedPlayers = {
      owner: this.owner,
      started: this.started
    };

    for (var key in this.players) {
      if (this.players[key]) compressedPlayers[key] = this.players[key].getCompressed();
    }

    for (key in this.players) {
      if (this.players[key]) this.players[key].socket.emit('update', compressedPlayers);
    }
  }

};

module.exports = Game;
