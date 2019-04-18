(() => {
  var socket = io()

  socket.on('broadcast', function(message) {
    console.log(message);
  })

  window.broadcast = function() {
    socket.emit('broadcast', 'howdy')
    console.log("howdy")
  }
})();
