const Util = require("./util");
const GamePiece = require("./game_piece");


const DEFAULTS = {
	color: "cyan",
	radius: 25,
	pos: [100, 300],
  mass: 100,
	vel: [0, 0]
};

class Bearing extends GamePiece{
  constructor(options = {}) {

		super(Object.assign(DEFAULTS, options));
  }

}

module.exports = Bearing;
