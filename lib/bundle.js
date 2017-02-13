/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const Util = {
  contactAngle(pos1, pos2) {
    return Math.atan2(pos2[1] - pos1[1], pos2[0] - pos1[0]);
  },

  pointsDistance(pos1, pos2) {
    return Math.sqrt(
        Math.pow((pos2[0] - pos1[0]), 2)
      + Math.pow((pos2[1] - pos1[1]), 2)
    );
  },

  startingTireVel() {
    return [(Math.random() - 0.5) * 10 / 100, (Math.random() - 0.5) * 10 / 100];
  }

};

module.exports = Util;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const GamePiece = __webpack_require__(2);

const DEFAULTS = {
	radius: 14,
	pos: [100, 300],
	vel: [0, 0],
	image: "./assets/bearing.png"
};

class Bearing extends GamePiece{
  constructor(options = {}) {
		super(Object.assign(DEFAULTS, options));
  }

}

module.exports = Bearing;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);

class GamePiece {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.mass = options.mass;
    this.color = options.color;
    this.image = options.image;

    this.isCollidingWith = this.isCollidingWith.bind(this);
    this.handleCollision = this.handleCollision.bind(this);
    this.totalVelocity = this.totalVelocity.bind(this);

    this.movementAngle = this.movementAngle.bind(this);
    this.distanceTo = this.distanceTo.bind(this);
  }

  draw(ctx) {
    const img = new Image();
    img.src = this.image;
    ctx.drawImage(img, this.pos[0] - this.radius, this.pos[1] - this.radius, this.radius* 2, this.radius* 2);
  }

  move(timeDelta) {
    const velocityScale = 5;
    const offsetX = this.vel[0] * velocityScale;
    const offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
  }

  totalVelocity() {
    return Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2));
  }

  movementAngle() {
    if (this.totalVelocity() === 0) return 0;
    return Math.acos(this.vel[0] / this.totalVelocity());
  }

  distanceTo(otherPiece) {
    return Util.pointsDistance(this.pos, otherPiece.pos);
  }

  isCollidingWith(otherPiece) {
    if (this.pos[0] + this.radius + otherPiece.radius > otherPiece.pos[0]
    && this.pos[0] < otherPiece.pos[0] + this.radius + otherPiece.radius
    && this.pos[1] + this.radius + otherPiece.radius > otherPiece.pos[1]
    && this.pos[1] < otherPiece.pos[1] + this.radius + otherPiece.radius) {
      const distance = this.distanceTo(otherPiece);
      if (distance < this.radius + otherPiece.radius) {
        return true;
      }
    } else {
      return false;
    }
  }

  handleCollision(otherPiece) {
    const conAngle = Util.contactAngle(this.pos, otherPiece.pos);

    const spread = (this.radius + otherPiece.radius) - this.distanceTo(otherPiece);

    const sepX = spread * Math.cos(conAngle);
    const sepY = spread * Math.sin(conAngle);

    this.pos[0] -= sepX;
    this.pos[1] -= sepY;

    const punch = 1;

    this.vel[0] -= punch * Math.cos(conAngle);
    this.vel[1] -= punch * Math.sin(conAngle);
    otherPiece.vel[0] += punch * Math.cos(conAngle);
    otherPiece.vel[1] += punch * Math.sin(conAngle);
  }
}

const FRAME_RATE = 1000/60;

module.exports = GamePiece;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const GamePiece = __webpack_require__(2);

const DEFAULTS = {
	TIRE_RADIUS: 40,
	TIRE_POSITION: [600, 245 + (Math.random() * 10)],
	TIRE_IMAGE: "./assets/tire.png"
};

class Tire extends GamePiece{
  constructor(options={}) {
    options.pos = options.pos ? options.pos :DEFAULTS.TIRE_POSITION;
    options.radius = options.radius ? options.radius : DEFAULTS.TIRE_RADIUS;
		options.image = options.image ? options.image : DEFAULTS.TIRE_IMAGE;
    options.vel = Util.startingTireVel();
		super(options);

  }
}

module.exports = Tire;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Tire = __webpack_require__(3);
const Bearing = __webpack_require__(1);
const Pit = __webpack_require__(8);
const Gun = __webpack_require__(7);
const Aimbot = __webpack_require__(6);

class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.gamePieces = [];
    this.resetBoard = this.resetBoard.bind(this);
    this.setTire = this.setTire.bind(this);
    this.leftPit = new Pit();
    this.rightPit = new Pit({pos: Game.TOTAL_WIDTH-this.leftPit.width});
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
  }

  resetBoard() {
    this.leftPit.bearingStore = 10;
    this.rightPit.bearingStore = 10;
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
    this.leftPit.lives = 10;
    this.rightPit.lives = 10;
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
      alert("Player Two Wins!");
      this.resetGame();
    }

    if (this.rightPit.lives < 1) {
      alert("Player One Wins!");
      this.resetGame();
    }
  }
}

Game.TOTAL_WIDTH = 1200;
Game.TOTAL_HEIGHT = Math.floor(Game.TOTAL_WIDTH * 0.4);
Game.BG_COLOR = "beige";

module.exports = Game;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

class GameView {
  constructor(game, ctx, players=1, level=1) {
    this.ctx = ctx;
    this.game = game;
    this.players = 1;
    this.paused = false;
  }

  bindKeyHandlers() {
    key('s', () => { this.game.fireLeft(); });
    key('w', () => { this.game.fireLeft(); });
    key('a', () => { this.game.fireLeft(); });

    key('k', () => { this.game.fireRight(); });
    key('o', () => { this.game.fireRight(); });
    key('l', () => { this.game.fireRight(); });

    key('p', () => { this.togglePause(); });
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    //start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  pause() {
    this.paused = true;
  }

  unPause() {
    this.paused = false;
  }

  togglePause() {
    this.paused = this.paused ? false : true;
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    if(!this.paused){

      if(key.isPressed("e")) this.game.leftGun.aim(-GameView.AIM_OFFSET);
      if(key.isPressed("f")) this.game.leftGun.aim(GameView.AIM_OFFSET);
      if(key.isPressed("i")) this.game.rightGun.aim(GameView.AIM_OFFSET);
      if(key.isPressed("j")) this.game.rightGun.aim(-GameView.AIM_OFFSET);

      if (this.players === 1) {
        this.game.aimbot.step(GameView.AIM_OFFSET);
      }
      this.game.step(timeDelta);
      this.game.draw();
      this.game.checkWin();
    }

    this.lastTime = time;
    //every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.AIM_OFFSET = Math.PI / 75;


module.exports = GameView;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);

class Aimbot {
  constructor(gun, tires, fireGun, boardHeight, difficulty) {
    this.gun = gun;
    this.tire = tires[0];
    this.lastFired = 0;
    this.range = 550;
    this.fireGun = fireGun;
    this.boardHeight = boardHeight;
    this.setStats = this.setStats.bind(this);
    this.setStats(difficulty);
  }

  step(offset) {
    this.aim(offset);
    const curTime = Date.now();

    const distance = Util.pointsDistance(this.gun.mountPoint, this.tire.pos);
    const inRange = ((distance - this.range) <= 0);
    const cooledOff = (curTime >= this.lastFired + this.fireInterval);

    if (inRange && cooledOff && this.inFireCone(distance)) {
      this.fireGun();
      this.lastFired = curTime;
    }
  }

  setStats(difficulty) {
    this.gun.power = 3;
    this.gun.errorOffset = (100-difficulty) * 0.025;
    this.fireInterval = 1000 - 4 * difficulty;
    this.range = 350 + 3 * difficulty;
  }

  aim(offset) {
    // const vectorAngle = Util.contactAngle(this.tire.pos, this.gun.mountPoint) + Math.PI;
    const vectorAngle = Util.contactAngle(this.predictedPos(), this.gun.launchPoint()) + Math.PI;
    const marginalDiff = Math.min(offset, Math.abs(this.gun.angle - vectorAngle));

    if (this.gun.angle > vectorAngle) {
      this.gun.aim(-marginalDiff);
    } else if (this.gun.angle < vectorAngle) {
      this.gun.aim(marginalDiff);
    }
  }

  predictedPos() {
    let posX, posY;
    const distance = Util.pointsDistance(this.gun.launchPoint(), this.tire.pos);

    const timeToTire = distance / this.gun.power;
    const timingConstant = 0.90;
    const willGoX = (this.tire.vel[0] * timeToTire) * timingConstant;
    const willGoY = (this.tire.vel[1] * timeToTire) * timingConstant;

    posX = this.tire.pos[0] + willGoX;

    if ((this.tire.pos[1] + willGoY) > (this.boardHeight - this.tire.radius)) {
      posY = (this.boardHeight * 2) - this.tire.pos[1] - willGoY - (this.tire.radius * 2);
    } else if ((this.tire.pos[1] + willGoY - this.tire.radius) < 0) {
      posY = -this.tire.pos[1] - willGoY + (this.tire.radius * 2);
    } else {
      posY = this.tire.pos[1] + willGoY;
    }

    return [posX, posY];
  }

  inFireCone(distance) {
    const vectorAngle = Util.contactAngle(this.predictedPos(), this.gun.mountPoint) + Math.PI;
    const angleDiff = Math.abs(this.gun.angle - vectorAngle);
    const fireFace = distance * Math.sin(angleDiff);
    return ( (fireFace ) < this.tire.radius);
  }

}

module.exports = Aimbot;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const Bearing = __webpack_require__(1);
const SoundCarousel = __webpack_require__(9);

const DEFAULTS = {
	mountPoint: [25,300],
  power: 3,
  length: 150,
  width: 32,
  color: "red",
  angle: 0,
	errorOffset: 0,
	maxRotation: ( 0.30 * Math.PI ),
	gunshotFile: './assets/gun_1.mp3'
};

class Gun {
  constructor(options) {
    const opts = Object.assign(DEFAULTS, options);
    this.power = opts.power;
    this.mountPoint = opts.mountPoint;
    this.length = opts.length;
    this.width = opts.width;
    this.color = opts.color;
		this.startAngle = opts.angle;
    this.angle = opts.angle;
		this.errorOffset = opts.errorOffset;
		this.maxRotation = opts.maxRotation;
		this.gunShotSound =	new SoundCarousel(opts.gunshotFile);
  }

  draw(ctx) {
		this.drawBarrel(ctx);
		this.drawTurret(ctx);
  }

	drawBarrel(ctx) {
		ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(...this.mountPoint);
    ctx.lineTo(...this.launchPoint());
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.stroke();
		ctx.closePath();
	}

	drawTurret(ctx) {
		ctx.beginPath();
		ctx.arc(this.mountPoint[0], this.mountPoint[1], 60, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'maroon';
		ctx.fill();
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 20;
		ctx.stroke();
		ctx.closePath();
	}

  launchPoint() {
    const launchX = this.mountPoint[0] + this.length * Math.cos(this.angle);
    const launchY = this.mountPoint[1] + this.length * Math.sin(this.angle);
    return [launchX, launchY];
  }

	aimDrawPoint() {
    const aimDrawX = this.mountPoint[0] + 800 * Math.cos(this.angle);
    const aimDrawY = this.mountPoint[1] + 800 * Math.sin(this.angle);
    return [aimDrawX, aimDrawY];
  }

  launchVector(power=1) {
		const launchAngle = this.angle + ((Math.random() - 0.5) * this.errorOffset);
    return [this.power * Math.cos(launchAngle), this.power * Math.sin(this.angle)];
  }

  fire() {
		this.gunShotSound.play();

    return new Bearing( {
      pos: this.launchPoint(),
      vel: this.launchVector()
    });
  }

  aim(angleDelta) {
		const newAngle = this.angle + angleDelta;
		const upperBound = this.startAngle + this.maxRotation;
		const lowerBound = this.startAngle - this.maxRotation;

    if (newAngle <= upperBound && newAngle >= lowerBound) {
			this.angle = newAngle;
		}
	}
}

module.exports = Gun;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Tire = __webpack_require__(3);
const Bearing = __webpack_require__(1);


const DEFAULTS = {
	pos: 0,
	width: 100,
	color: "yellow",
	lives: 10
};

class Pit{
  constructor(options={}) {
    this.bearingStore = Pit.STARTING_STORE;
    const opts = Object.assign(DEFAULTS, options);

    this.pos = opts.pos;
    this.width = opts.width;
    this.color = opts.color;
		this.lives = opts.lives;
  }

  receivePiece(piece, callback=null) {
    if (piece instanceof Bearing) {
      this.bearingStore++;
    } else if (piece instanceof Tire) {
      this.lives--;
			callback();
    }
  }

  draw(ctx) {

    ctx.beginPath();
    ctx.rect(this.pos, 0, this.pos + this.width, ctx.canvas.height);

    // add linear gradient
    const grd = ctx.createLinearGradient(this.pos, 0, this.pos + this.width, ctx.canvas.height);
    // light blue
    grd.addColorStop(0, '#FFFFFF');
    // dark blue
    grd.addColorStop(1, '#000000');
    ctx.fillStyle = grd;
    ctx.fill();


		const scoreX = this.pos + 50;
		const scoreY = 30;

		ctx.textAlign = 'center';

		ctx.strokeStyle = "black";
		ctx.fillStyle = "black";
		ctx.lineWidth = 1;

		ctx.font = "25px sans-serif";
		ctx.fillText("LIVES", scoreX, scoreY);
		ctx.fillText("BALLS", scoreX, scoreY + 80);

		ctx.font = "bold 45px sans-serif";

		ctx.fillStyle = this.metricColor(this.lives);
		ctx.fillText(this.lives, scoreX, scoreY + 45);
		ctx.strokeText(this.lives, scoreX, scoreY + 45);

		ctx.fillStyle = this.metricColor(this.bearingStore);
		ctx.fillText(this.bearingStore, scoreX, scoreY + 125);
		ctx.strokeText(this.bearingStore, scoreX, scoreY + 125);
  }

	metricColor(metric) {
		if (metric < 4) {
			return "red";
		} else if (metric < 8) {
			return "orange";
		} else {
			return "green";
		}
	}


}

Pit.STARTING_STORE = 10;

module.exports = Pit;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

class SoundCarousel{
  constructor(filePath, soundcount=10) {
    this.sounds = [];
    this.soundIndex = 0;
    this.soundcount = soundcount;

    for (let i = 0; i < soundcount; i++) {
      this.sounds.push(new Audio(filePath));
    }
  }

  play() {
    this.sounds[this.soundIndex % this.soundcount].volume = window.sfxVolume;
    this.sounds[this.soundIndex % this.soundcount].play();
    this.soundIndex++;
  }
}

module.exports = SoundCarousel;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(4);
const GameView = __webpack_require__(5);

document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.TOTAL_WIDTH;
  canvasEl.height = Game.TOTAL_HEIGHT;

  const ctx = canvasEl.getContext("2d");
  const game = new Game(ctx);
  const gameView = new GameView(game);
  
  gameView.start();
  window.gameView = gameView;
});


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map