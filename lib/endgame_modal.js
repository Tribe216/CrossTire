class EndGameModal {
  constructor(message) {
    this.domModal = document.getElementById('myModal');
    this.messagePara = document.getElementById('endgameMessage');

  }

  close() {
    this.domModal.style.display = "none";
  }

  display(message) {
    this.messagePara.innerHTML = message;
    this.domModal.style.display = "block";
  }

}

window.onclick = function(event) {
  const modal = document.getElementById('myModal');
  const newGameArea = document.getElementById('newGameMessage');
    if (event.target == newGameArea) {
        window.gameView.game.resetGame();
        modal.style.display = "none";
    }
};

module.exports = EndGameModal;
