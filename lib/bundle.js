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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(2);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.TOTAL_WIDTH;
	  canvasEl.height = Game.TOTAL_HEIGHT;
	
	  const ctx = canvasEl.getContext("2d");
	  const game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Tire = __webpack_require__(3);
	const Bearing = __webpack_require__(6);
	const Pit = __webpack_require__(7);
	const Gun = __webpack_require__(8);
	
	class Game {
	  constructor() {
	    this.gamePieces = [];
	    this.resetBoard = this.resetBoard.bind(this);
	    this.setTire = this.setTire.bind(this);
	    this.leftPit = new Pit();
	    this.rightPit = new Pit({pos: Game.TOTAL_WIDTH-this.leftPit.width});
	
	    this.leftGun = new Gun({
	      mountPoint: [0, Game.TOTAL_HEIGHT / 2],
	      angle: 0
	    });
	
	    this.rightGun = new Gun({
	      mountPoint: [Game.TOTAL_WIDTH, Game.TOTAL_HEIGHT / 2],
	      angle: Math.PI,
	      gunshotFile: './assets/gun_2.mp3'
	    });
	
	    this.resetBoard();
	
	    const bgMusic = new Audio("./assets/bg_dance.mp3");
	    bgMusic.volume = 0.5;
	    bgMusic.loop = true;
	    bgMusic.play();
	}
	
	  resetBoard() {
	    this.leftPit.bearingStore = 10;
	    this.rightPit.bearingStore = 10;
	
	    this.gamePieces = [];
	    this.setTire();
	  }
	
	  resetGame() {
	    this.leftPit.lives = 10;
	    this.rightPit.lives = 10;
	  }
	
	  setTire() {
	    this.gamePieces.push(new Tire());
	  }
	
	  draw(ctx) {
	    ctx.clearRect(0, 0, Game.TOTAL_WIDTH, Game.TOTAL_HEIGHT);
	    ctx.fillStyle = Game.BG_COLOR;
	    // ctx.fillRect(0, 0, Game.TOTAL_WIDTH, Game.TOTAL_HEIGHT);
	    this.gamePieces.forEach( (piece) => {
	      piece.draw(ctx);
	    });
	    this.leftPit.draw(ctx);
	    this.rightPit.draw(ctx);
	
	    this.leftGun.draw(ctx);
	    this.rightGun.draw(ctx);
	  }
	
	  step(delta) {
	    this.moveObjects(delta);
	    this.checkWallCollisions();
	    this.checkPieceCollisions();
	    this.checkWin();
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
	
	Game.TOTAL_WIDTH = 1400;
	Game.TOTAL_HEIGHT = 500;
	Game.BG_COLOR = "beige";
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.ctx = ctx;
	    this.game = game;
	  }
	
	  bindKeyHandlers() {
	    key('s', () => { this.game.fireLeft(); });
	    key('w', () => { this.game.fireLeft(); });
	    key('d', () => { this.game.fireLeft(); });
	    key('a', () => { this.game.fireLeft(); });
	
	    key('p', () => { this.game.fireRight(); });
	    key('k', () => { this.game.fireRight(); });
	    key('o', () => { this.game.fireRight(); });
	    key('l', () => { this.game.fireRight(); });
	  }
	
	  start() {
	    this.bindKeyHandlers();
	    this.lastTime = 0;
	    //start the animation
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	  animate(time) {
	    const timeDelta = time - this.lastTime;
	
	    if(key.isPressed("e")) this.game.leftGun.aim(-GameView.AIM_OFFSET);
	    if(key.isPressed("f")) this.game.leftGun.aim(GameView.AIM_OFFSET);
	
	    if(key.isPressed("i")) this.game.rightGun.aim(GameView.AIM_OFFSET);
	    if(key.isPressed("j")) this.game.rightGun.aim(-GameView.AIM_OFFSET);
	
	    this.game.step(timeDelta);
	    this.game.draw(this.ctx);
	    this.lastTime = time;
	    //every call to animate requests causes another call to animate
	    requestAnimationFrame(this.animate.bind(this));
	  }
	}
	
	GameView.AIM_OFFSET = Math.PI / 75;
	
	
	module.exports = GameView;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	const GamePiece = __webpack_require__(5);
	
	const DEFAULTS = {
		TIRE_COLOR: "gray",
		TIRE_RADIUS: 45,
		TIRE_POSITION: [700, 245 + (Math.random() * 10)],
		TIRE_MASS: 120,
		TIRE_IMAGE: "./assets/tire.png"
	};
	
	class Tire extends GamePiece{
	  constructor(options={}) {
	    options.color = DEFAULTS.TIRE_COLOR;
	    options.pos = DEFAULTS.TIRE_POSITION;
	    options.radius = DEFAULTS.TIRE_RADIUS;
			options.mass = DEFAULTS.TIRE_MASS;
			options.image = DEFAULTS.TIRE_IMAGE;
	    options.vel = [0, 0];
			super(options);
	  }
	
	}
	
	module.exports = Tire;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Util = {
	  contactAngle(pos1, pos2) {
	    return Math.atan2(pos2[1] - pos1[1], pos2[0] - pos1[0]);
	  }
	};
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	
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
	    // const velocityScale = timeDelta / FRAME_RATE;
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
	    return Math.sqrt(
	        Math.pow((this.pos[0] - otherPiece.pos[0]), 2)
	      + Math.pow((this.pos[1] - otherPiece.pos[1]), 2)
	    );
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
	    const v1 = this.totalVelocity();
	    const v2 = otherPiece.totalVelocity();
	    const theta1 = this.movementAngle();
	    const theta2 = otherPiece.movementAngle();
	    const m1 = this.mass;
	    const m2 = otherPiece.mass;
	
	    const spread = (this.radius + otherPiece.radius) - this.distanceTo(otherPiece);
	
	    const sepX = spread * Math.cos(conAngle);
	    const sepY = spread * Math.sin(conAngle);
	
	    this.pos[0] -= sepX;
	    this.pos[1] -= sepY;
	
	    const punch = 1;
	
	    this.vel[0] -= punch*Math.cos(conAngle);
	    this.vel[1] -= punch*Math.sin(conAngle);
	    otherPiece.vel[0] += punch*Math.cos(conAngle);
	    otherPiece.vel[1] += punch*Math.sin(conAngle);
	  }
	}
	
	const FRAME_RATE = 1000/60;
	
	module.exports = GamePiece;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	const GamePiece = __webpack_require__(5);
	
	
	const DEFAULTS = {
		color: "cyan",
		radius: 15,
		pos: [100, 300],
	  mass: 100,
		vel: [0, 0],
		image: "./assets/bearing.png"
	};
	
	class Bearing extends GamePiece{
	  constructor(options = {}) {
	
			super(Object.assign(DEFAULTS, options));
	  }
	
	}
	
	module.exports = Bearing;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Tire = __webpack_require__(3);
	const Bearing = __webpack_require__(6);
	
	
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
	
			ctx.fillStyle = "black";
			ctx.font = "bold 25px sans-serif";
	
			const scoreX = this.pos + 10;
			const scoreY = 30;
	  	ctx.fillText("LIVES", scoreX, scoreY);
			ctx.fillText(this.lives, scoreX, scoreY + 30);
	
			ctx.fillText("BALLS", scoreX, scoreY + 80);
			ctx.fillText(this.bearingStore, scoreX, scoreY + 110);
	  }
	
	
	}
	
	Pit.STARTING_STORE = 10;
	
	module.exports = Pit;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	const Bearing = __webpack_require__(6);
	const SoundCarousel = __webpack_require__(10);
	
	const DEFAULTS = {
		mountPoint: [25,300],
	  power: 3,
	  length: 150,
	  width: 32,
	  color: "red",
	  angle: 0,
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
	    this.angle = opts.angle;
			this.gunShotSound =	new SoundCarousel(opts.gunshotFile);
	  }
	
	  draw(ctx) {
	    ctx.fillStyle = this.color;
	
	    ctx.beginPath();
	    ctx.moveTo(...this.mountPoint);
	    ctx.lineTo(...this.launchPoint());
	    ctx.lineWidth = this.width;
	    ctx.strokeStyle = this.color;
	    ctx.stroke();
	
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(this.mountPoint[0], this.mountPoint[1], 60, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'maroon';
	
	    ctx.fill();
	
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 20;
			ctx.stroke();
	
	  }
	
	  launchPoint() {
	    const launchX = this.mountPoint[0] + this.length * Math.cos(this.angle);
	    const launchY = this.mountPoint[1] + this.length * Math.sin(this.angle);
	    return [launchX, launchY];
	  }
	
	  launchVector(power=1) {
	    return [this.power * Math.cos(this.angle), this.power * Math.sin(this.angle)];
	  }
	
	  fire() {
			this.gunShotSound.play();
	    return new Bearing( {
	      pos: this.launchPoint(),
	      vel: this.launchVector()
	    });
	  }
	
	  aim(angleDelta) {
	    this.angle += angleDelta;
	  }
	
	}
	
	module.exports = Gun;


/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	class SoundCarousel{
	  constructor(filePath, ns=10) {
	    this.sounds = [];
	    this.soundIndex = 0;
	    this.ns = ns;
	
	    for (let i = 0; i < ns; i++) {
	      this.sounds.push(new Audio(filePath));
	    }
	  }
	
	  play() {
	    this.sounds[this.soundIndex % this.ns].play();
	    this.soundIndex++;
	  }
	}
	
	module.exports = SoundCarousel;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map