const Util = require("./util");
const GamePiece = require("./game_piece");

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
