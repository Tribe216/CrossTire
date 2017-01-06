const Util = require("./util");
const GamePiece = require("./game_piece");

const DEFAULTS = {
	TIRE_RADIUS: 40,
	TIRE_POSITION: [700, 245 + (Math.random() * 10)],
	TIRE_IMAGE: "./assets/tire.png"
};

class Tire extends GamePiece{
  constructor(options={}) {
    options.pos = options.pos ? options.pos :DEFAULTS.TIRE_POSITION;
		// options.pos = [700,300];
    options.radius = options.radius ? options.radius : DEFAULTS.TIRE_RADIUS;
		options.image = options.image ? options.image : DEFAULTS.TIRE_IMAGE;
    options.vel = [Math.random() * 10 / 100, Math.random() * 10 / 100];
		super(options);
  }

}

module.exports = Tire;
