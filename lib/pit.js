const Tire = require("./tire");
const Bearing = require("./bearing");

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
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.rect(this.pos, 0, this.pos + this.width, ctx.canvas.height);
    ctx.fill();

		ctx.fillStyle = "black";
		ctx.font = "20px sans-serif";

		const scoreX = this.pos + 10;
		const scoreY = 30;
  	ctx.fillText("Lives", scoreX, scoreY);
		ctx.fillText(this.lives, scoreX, scoreY + 30);

		ctx.fillText("Balls", scoreX, scoreY + 60);
		ctx.fillText(this.bearingStore, scoreX, scoreY + 90);
  }


}

Pit.STARTING_STORE = 10;

module.exports = Pit;
