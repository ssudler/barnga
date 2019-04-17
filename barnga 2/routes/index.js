
var express = require('express');
var socket = require('socket.io');
var router = express.Router();

var io = socket();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var users = {};

io.on('connection', function(socket) {
  users[socket.id] = socket
  console.log(socket.id + ' has connected');
  socket.on('broadcast', function(message) {
    console.log(`${socket.id} says \'${message}\'`)
    io.emit('broadcast', message)
  })

  socket.on('disconnect', function() {
    console.log(socket.id + ' has disconnected');
  });
});

router.io = io;

module.exports = router;
