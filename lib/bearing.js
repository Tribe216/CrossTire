const Util = require("./util");
const GamePiece = require("./game_piece");

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
