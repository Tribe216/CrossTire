const Util = require("./util");
const Bearing = require("./bearing");

const DEFAULTS = {
	mountPoint: [25,300],
  power: 4,
  length: 200,
  width: 50,
  color: "red",
  angle: 0
};

class Gun {
  constructor(options) {
    const opts = Object.assign(DEFAULTS, options);
    this.power = opts.power;
    this.mountPoint = opts.mountPoint;
    this.length = opts.length;
    this.width = opts.width;
    this.color = opts.color;
    this.angle = opts.angle;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(...this.mountPoint);
    ctx.lineTo(...this.launchPoint());
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  launchPoint() {
    const launchX = this.mountPoint[0] + this.length * Math.cos(this.angle);
    const launchY = this.mountPoint[1] + this.length * Math.sin(this.angle);
    return [launchX, launchY];
  }

  launchVector(power=1) {
    return [this.power * Math.cos(this.angle), this.power * Math.sin(this.angle)];
  }

  fire() {
    return new Bearing( {
      color: "gray",
      radius: 20,
      pos: this.launchPoint(),
      vel: this.launchVector()
    });
  }

  aim(angleDelta) {
    this.angle += angleDelta;
  }

}

module.exports = Gun;
