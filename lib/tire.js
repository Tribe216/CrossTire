const Util = require("./util");
const GamePiece = require("./game_piece");

const DEFAULTS = {
	TIRE_COLOR: "gray",
	TIRE_RADIUS: 75,
	TIRE_POSITION: [850, 300],
	TIRE_MASS: 120
};

class Tire extends GamePiece{
  constructor(options={}) {
    options.color = DEFAULTS.TIRE_COLOR;
    options.pos = DEFAULTS.TIRE_POSITION;
    options.radius = DEFAULTS.TIRE_RADIUS;
		options.mass = DEFAULTS.TIRE_MASS;
    options.vel = [0, 0];
		super(options);
  }

}

module.exports = Tire;
