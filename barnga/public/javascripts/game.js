(() => {
  var gameId, nickname, ownerCode

  var socket = io();

  window.setGameVars = function(id, name, oc) {
    console.log('called');
    gameId = id;
    nickname = name;
    ownerCode = oc;

    // Join game
    socket.emit('joinGame', nickname, gameId);

    // Try to set owner if owner code
    if (ownerCode) socket.emit('setOwner', ownerCode);
  }

  socket.on('joinUnsuccessful', function() {
    console.log('join failed');
    window.location.replace('/?e=true');
  });

  socket.on('update', function(data) {
    document.getElementById('data').innerHTML = JSON.stringify(data);
  })
})();
