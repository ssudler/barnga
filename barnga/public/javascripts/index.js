(() => {
  window.joinGame = function () {
    let name = document.getElementById('name').value;
    let gameId = document.getElementById('gameId').value;

    window.location.replace('/b?g='+gameId+'&n='+name+'/');
  }

  window.createGame = function () {
    let name = document.getElementById('name').value;
    let numberOfCards = document.getElementById('numberOfCards').value;
    let gameFilter = document.getElementById('gameFilter').value;

    window.location.replace('/c?n='+name+'&cn='+numberOfCards+'&f='+gameFilter+'/');
  }
})();
