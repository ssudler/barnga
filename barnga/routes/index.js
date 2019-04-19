var GameManager = require('../models/game_manager.js');
var config = require('../config');
var express = require('express');
var socket = require('socket.io');
var router = express.Router();

var io = socket();

let gameManager = new GameManager();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Barnga', error: req.query.e });
});

router.get('/b/', function(req, res, next) {
  res.render('game', { title: 'Barnga', gameId: req.query.g, nickname: req.query.n, ownerCode: req.query.oc });
});

router.get('/c/', function (req, res, next) {
  var game = gameManager.createGame(req.query.cn, null, req.query.f);
  res.redirect('/b?g='+game.id+'&n='+req.query.n+'&oc='+game.ownerCode);
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

});

router.io = io;

module.exports = router;
