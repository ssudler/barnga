var GameManager = require('../models/game_manager.js');
var config = require('../config');
var express = require('express');
var socket = require('socket.io');
var router = express.Router();

var io = socket();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Barnga', error: req.query.e });
});

router.get('/b/', function(req, res, next) {
  res.render('game', { title: 'Barnga', gameId: req.query.g });
});

io.on('connection', function(socket) {
  console.log(socket.id + ' has connected');

  function addPlayerToGame(gameId, playerSocket, name) {
    var success = gameManager.addPlayerToGame(gameId, socket, name);
    playerSocket.emit(success ? 'joinSuccessful' : 'joinUnsuccessful', gameId);
  }

  socket.on('joinGame', function(name, gameId) {
    addPlayerToGame(gameId, socket, name);
  });

  socket.on('createGame', function(name, numberOfCards) {
    var id = gameManager.createGame(numberOfCards);
    addPlayerToGame(id, socket, name);
  })

});

router.io = io;

module.exports = router;
