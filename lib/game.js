const Tire = require("./tire");
const Bearing = require("./bearing");
const Pit = require("./pit");
const Gun = require("./gun");
const Aimbot = require("./aimbot");
const EndGameModal = require("./endgame_modal");

class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.gamePieces = [];
    this.resetBoard = this.resetBoard.bind(this);
    this.leftPit = new Pit({ lives: Game.STARTING_LIVES});
    this.rightPit = new Pit({pos: Game.TOTAL_WIDTH-this.leftPit.width, lives: Game.STARTING_LIVES});
    this.difficulty = 20;

    this.leftGun = new Gun({
      mountPoint: [0, Game.TOTAL_HEIGHT / 2],
      angle: 0
    });

    this.rightGun = new Gun({
      mountPoint: [Game.TOTAL_WIDTH, Game.TOTAL_HEIGHT / 2],
      angle: Math.PI,
      gunshotFile: './assets/gun_2.mp3'
    });

    this.fireRight = this.fireRight.bind(this);

    this.resetBoard();
    this.initMusic();
    this.modal = new EndGameModal();
    this.modal.reset = this.resetGame;
  }

  resetBoard() {
    this.leftPit.bearingStore = Game.STARTING_BEARINGS;
    this.rightPit.bearingStore = Game.STARTING_BEARINGS;
    this.rightGun.angle = this.rightGun.startAngle;
    this.leftGun.angle = this.leftGun.startAngle;

    this.gamePieces = [];
    this.setTire();
    this.aimbot = new Aimbot(
      this.rightGun,
      this.tires(),
      this.fireRight,
      Game.TOTAL_HEIGHT,
      this.difficulty);
  }

  initMusic() {
    this.bgMusic = new Audio("./assets/bg_dance.mp3");
    this.syncBgVolume();
    this.bgMusic.loop = true;
    this.bgMusic.play();
  }

  syncBgVolume() {
    this.bgMusic.volume = window.bgVolume;
  }

  resetGame() {

    this.leftPit.lives = Game.STARTING_LIVES;
    this.rightPit.lives = Game.STARTING_LIVES;
    this.unpause();
  }

  updateDifficulty() {
    this.aimbot.setStats(this.difficulty);
  }

  tires() {
    return this.gamePieces.filter( (el) => { return (el instanceof Tire); });
  }

  setTire() {
    this.gamePieces.push(new Tire({
      pos: [
        Math.floor(Game.TOTAL_WIDTH / 2),
        Math.floor((Game.TOTAL_HEIGHT / 2) + (Math.random() * 10))
      ],
      radius: Math.floor(Game.TOTAL_WIDTH / 30),
    }));
  }

  draw() {
    this.ctx.clearRect(0, 0, Game.TOTAL_WIDTH, Game.TOTAL_HEIGHT);
    this.ctx.fillStyle = Game.BG_COLOR;
    // this.ctx.fillRect(0, 0, Game.TOTAL_WIDTH, Game.TOTAL_HEIGHT);
    this.gamePieces.forEach( (piece) => {
      piece.draw(this.ctx);
    });
    this.leftPit.draw(this.ctx);
    this.rightPit.draw(this.ctx);

    this.leftGun.draw(this.ctx);
    this.rightGun.draw(this.ctx);
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkWallCollisions();
    this.checkPieceCollisions();
  }

  fireBearing(pit, gun) {
    if (pit.bearingStore > 0) {
      this.gamePieces.push(gun.fire());
      pit.bearingStore--;
    }
  }

  fireLeft() {
    this.fireBearing(this.leftPit, this.leftGun);
  }

  fireRight() {
    this.fireBearing(this.rightPit, this.rightGun);
  }

  checkPieceCollisions() {
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

  checkWallCollisions() {
    for (let i = 0; i < (this.gamePieces.length); i++) {
      const p = this.gamePieces[i];
      let offset = null;

      if (p.pos[0] + p.radius > Game.TOTAL_WIDTH) {
        this.gamePieces.splice(this.gamePieces.indexOf(p), 1);
        this.rightPit.receivePiece(p, this.resetBoard);
        continue;
      }

      if (p.pos[0] - p.radius < 0) {
        this.gamePieces.splice(this.gamePieces.indexOf(p), 1);
        this.leftPit.receivePiece(p, this.resetBoard);
        continue;
      }

      if (p.pos[1] + p.radius > Game.TOTAL_HEIGHT) {
        offset = p.pos[1] + p.radius - Game.TOTAL_HEIGHT;
        p.pos[1] -= offset;
        p.vel[1] = -p.vel[1];
      }

      if (p.pos[1] - p.radius < 0) {
        offset = p.radius - p.pos[1];
        p.pos[1] += offset;
        p.vel[1] = -p.vel[1];
      }
    }
  }

  moveObjects(delta) {
    this.gamePieces.forEach( (piece) => {
      piece.move(delta);
    });
  }

  checkWin() {
    if (this.leftPit.lives < 1) {
      this.pause();
      this.modal.display("You Lose!");
    }

    if (this.rightPit.lives < 1) {
      this.pause();
      this.modal.display("You Win!");
    }
  }
}

Game.TOTAL_WIDTH = 1200;
Game.TOTAL_HEIGHT = Math.floor(Game.TOTAL_WIDTH * 0.4);
Game.BG_COLOR = "beige";

Game.STARTING_BEARINGS = 10;
Game.STARTING_LIVES = 10;

module.exports = Game;
