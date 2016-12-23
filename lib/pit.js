const Tire = require("./tire");
const Bearing = require("./bearing");

const DEFAULTS = {
	pos: 0,
	width: 100,
	color: "#aaa"
};

class Pit{
  constructor(options={}) {
    this.bearingStore = Pit.STARTING_STORE;
    this.score = 0;
    const opts = Object.assign(DEFAULTS, options);

    this.pos = opts.pos;
    this.width = opts.width;
    this.color = opts.color;
  }

  receivePiece(piece) {
    if (piece instanceof Bearing) {
      this.bearingStore++;
    } else if (piece instanceof Tire) {
      this.score++;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.rect(this.pos, 0, this.pos + this.width, ctx.canvas.height);
    ctx.fill();
  }


}

Pit.STARTING_STORE = 10;

module.exports = Pit;
