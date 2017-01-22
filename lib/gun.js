const Util = require("./util");
const Bearing = require("./bearing");
const SoundCarousel = require("./sound_carousel");

const DEFAULTS = {
	mountPoint: [25,300],
  power: 3,
  length: 150,
  width: 32,
  color: "red",
  angle: 0,
	errorOffset: 0,
	maxRotation: ( 0.30 * Math.PI ),
	gunshotFile: './assets/gun_1.mp3'
};

class Gun {
  constructor(options) {
    const opts = Object.assign(DEFAULTS, options);
    this.power = opts.power;
    this.mountPoint = opts.mountPoint;
    this.length = opts.length;
    this.width = opts.width;
    this.color = opts.color;
		this.startAngle = opts.angle;
    this.angle = opts.angle;
		this.errorOffset = opts.errorOffset;
		this.maxRotation = opts.maxRotation;
		this.gunShotSound =	new SoundCarousel(opts.gunshotFile);
  }

  draw(ctx) {
		this.drawBarrel(ctx);
		this.drawTurret(ctx);
  }

	drawBarrel(ctx) {
		ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(...this.mountPoint);
    ctx.lineTo(...this.launchPoint());
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.stroke();
		ctx.closePath();
	}

	drawTurret(ctx) {
		ctx.beginPath();
		ctx.arc(this.mountPoint[0], this.mountPoint[1], 60, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'maroon';
		ctx.fill();
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 20;
		ctx.stroke();
		ctx.closePath();
	}

  launchPoint() {
    const launchX = this.mountPoint[0] + this.length * Math.cos(this.angle);
    const launchY = this.mountPoint[1] + this.length * Math.sin(this.angle);
    return [launchX, launchY];
  }

	aimDrawPoint() {
    const aimDrawX = this.mountPoint[0] + 800 * Math.cos(this.angle);
    const aimDrawY = this.mountPoint[1] + 800 * Math.sin(this.angle);
    return [aimDrawX, aimDrawY];
  }

  launchVector(power=1) {
		const launchAngle = this.angle + ((Math.random() - 0.5) * this.errorOffset);
    return [this.power * Math.cos(launchAngle), this.power * Math.sin(this.angle)];
  }

  fire() {
		this.gunShotSound.play();

    return new Bearing( {
      pos: this.launchPoint(),
      vel: this.launchVector()
    });
  }

  aim(angleDelta) {
		const newAngle = this.angle + angleDelta;
		const upperBound = this.startAngle + this.maxRotation;
		const lowerBound = this.startAngle - this.maxRotation;

    if (newAngle <= upperBound && newAngle >= lowerBound) {
			this.angle = newAngle;
		}
	}
}

module.exports = Gun;
