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


		const scoreX = this.pos + 50;
		const scoreY = 30;

		ctx.textAlign = 'center';

		ctx.strokeStyle = "black";
		ctx.fillStyle = "black";
		ctx.lineWidth = 1;

		ctx.font = "25px sans-serif";
		ctx.fillText("LIVES", scoreX, scoreY);
		ctx.fillText("BALLS", scoreX, scoreY + 80);

		ctx.font = "bold 45px sans-serif";

		ctx.fillStyle = this.metricColor(this.lives);
		ctx.fillText(this.lives, scoreX, scoreY + 45);
		ctx.strokeText(this.lives, scoreX, scoreY + 45);

		ctx.fillStyle = this.metricColor(this.bearingStore);
		ctx.fillText(this.bearingStore, scoreX, scoreY + 125);
		ctx.strokeText(this.bearingStore, scoreX, scoreY + 125);
  }

	metricColor(metric) {
		if (metric < 4) {
			return "red";
		} else if (metric < 8) {
			return "orange";
		} else {
			return "green";
		}
	}


}

Pit.STARTING_STORE = 10;

module.exports = Pit;
