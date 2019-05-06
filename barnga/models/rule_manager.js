//
//  models/rule_manager.js
//  Barnga
//
//  Created by Robert May on 5/3/19.
//  Copyright © 2019 Robert May. All rights reserved.
//

const config = require('../config');
const Player = require('./player.js');


var RuleManager = class {

	constructor(players, drawingTime) {
		// Hash of player types, players in the game. No particular order necessary
		this.players = players;

		// Time limit for drawing rule
		this.drawingTime = drawingTime;

		// List of base64 images  (drawn rules)
		this.rules = {};
	}

	requestRules(completion) {

		// Set timeout to complete
		var completionTimeout = setTimeout(()=>{
			completion();
		}, this.drawingTime + 3000);

		// Request rules from each player
		var self = this;
		for (var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			var socket = player.socket;

			// Request rules
			var message = `Draw a rule, ${player.name}!`;
			var timeLimit = this.drawingTime * 1000;
			socket.emit('requestRule', message, timeLimit);

			// Set timeout to force sending rule after time limit
			setTimeout(()=> {
				if (self.rules[socket.id] == null) {
					// Get rules if rules ont sent already
					var timeoutMessage = `Time's up!`;
					socket.emit('forceRequestRule', timeoutMessage);
				}
			}, timeLimit);

			// Set up socket interaction for receiving rule
			player.socket.on('sendRule', (base64)=>{
				// Set rule
				self.rules[socket.id] = base64;

				// If all players have sent rules, kill the start game interval and start the game
				let allSent = true;
				for (var socketId in self.players) {
					if (self.rules[socketId] == null) {
						allSent = false;
					}
				}

				if (allSent) {
					clearTimeout(completionTimeout);
					completion();
				}
			});
		}
	}

	shareRules() {
		// Send rules json to each client
		for (var socketId in this.players) {
			if (this.players[socketId] == null) return;
			this.players[socketId].socket.emit('shareRules', this.rules);
		}
	}

};