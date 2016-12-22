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
	const GameView = __webpack_require__(6);
	
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

	const Tire = __webpack_require__(2);
	const Bearing = __webpack_require__(5);
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const GamePiece = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./game_piece\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	const DEFAULTS = {
		TIRE_COLOR: "pink",
		TIRE_RADIUS: 25,
		TIRE_POSITION: [0, 300],
		TIRE_MASS: 120
	};
	
	class Tire extends GamePiece{
	  constructor(options={}) {
	    options.color = DEFAULTS.TIRE_COLOR;
	    options.pos = DEFAULTS.TIRE_POSITION;
	    options.radius = DEFAULTS.TIRE_RADIUS;
			options.mass = DEFAULTS.TIRE_MASS;
	    options.vel = [1, 0];
			super(options);
	  }
	
	}
	
	module.exports = Tire;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Util = {
	
	
	
	  contactAngle(pos1, pos2) {
	    return Math.atan2(pos2[1] - pos1[1], pos2[0] - pos1[0]);
	  }
	};
	
	module.exports = Util;


/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const GamePiece = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./game_piece\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	const DEFAULTS = {
		BEARING_COLOR: "cyan",
		BEARING_RADIUS: 25,
		BEARING_POSITION: [400, 330],
	  BEARING_MASS: 100
	};
	
	class Bearing extends GamePiece{
	  constructor(options = {}) {
	    options.color = DEFAULTS.BEARING_COLOR;
	    options.pos = DEFAULTS.BEARING_POSITION;
	    options.radius = DEFAULTS.BEARING_RADIUS;
	    options.mass = DEFAULTS.BEARING_MASS;
	    options.vel = [0, 0];
			super(options);
	  }
	
	}
	
	module.exports = Bearing;


/***/ },
/* 6 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.ctx = ctx;
	    this.game = game;
	  }
	
	  bindKeyHandlers() {
	  }
	
	  start() {
	    this.bindKeyHandlers();
	    this.lastTime = 0;
	    //start the animation
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	  animate(time) {
	    const timeDelta = time - this.lastTime;
	
	    this.game.step(timeDelta);
	    this.game.draw(this.ctx);
	    this.lastTime = time;
	    //every call to animate requests causes another call to animate
	    requestAnimationFrame(this.animate.bind(this));
	  }
	}
	
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map