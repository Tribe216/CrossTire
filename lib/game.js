const Tire = require("./tire");
const Bearing = require("./bearing");

class Game {
  constructor() {
    this.gamePieces = [];
    this.initialPLacement();
  }

  initialPLacement() {
    this.gamePieces.push(new Tire({color: "red"}));
    this.gamePieces.push(new Bearing({color: "pink"}));
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.TOTAL_WIDTH, Game.TOTAL_HEIGHT);
    ctx.fillStyle = Game.BG_COLOR;
    // ctx.fillRect(0, 0, Game.TOTAL_WIDTH, Game.TOTAL_HEIGHT);
    this.gamePieces.forEach( (piece) => {
      piece.draw(ctx);
    });
  }

  step(delta) {
    this.moveObjects(delta);

    for (let i = 0; i < (this.gamePieces.length - 1); i++) {
      const p1 = this.gamePieces[i];
      for (let j = i + 1; j < this.gamePieces.length; j++) {
        let p2 = this.gamePieces[j];
        if (p1.isCollidingWith(p2)) {
          p1.handleCollision(p2);
          break;
        }
      }
    }
  }

  moveObjects(delta) {
    this.gamePieces.forEach( (piece) => {
      piece.move(delta);
    });
  }

}

Game.TOTAL_WIDTH = 1000;
Game.TOTAL_HEIGHT = 600;
Game.BG_COLOR = "beige";

module.exports = Game;
