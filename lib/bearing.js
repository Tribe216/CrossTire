const Util = require("./util");
const GamePiece = require("./game_piece");

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
