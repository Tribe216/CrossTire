const Util = require("./util");

class GamePiece {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.mass = options.mass;
    this.color = options.color;
    this.image = options.image;

    this.isCollidingWith = this.isCollidingWith.bind(this);
    this.handleCollision = this.handleCollision.bind(this);
    this.totalVelocity = this.totalVelocity.bind(this);

    this.movementAngle = this.movementAngle.bind(this);
    this.distanceTo = this.distanceTo.bind(this);
  }

  draw(ctx) {
    const img = new Image();
    img.src = this.image;
    ctx.drawImage(img, this.pos[0] - this.radius, this.pos[1] - this.radius, this.radius* 2, this.radius* 2);

  }

  move(timeDelta) {
    // const velocityScale = timeDelta / FRAME_RATE;
    const velocityScale = 5;
    const offsetX = this.vel[0] * velocityScale;
    const offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
  }

  totalVelocity() {
    return Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2));
  }

  movementAngle() {
    if (this.totalVelocity() === 0) return 0;
    return Math.acos(this.vel[0] / this.totalVelocity());
  }

  distanceTo(otherPiece) {

    return Util.pointsDistance(this.pos, otherPiece.pos);

  }

  isCollidingWith(otherPiece) {
    if (this.pos[0] + this.radius + otherPiece.radius > otherPiece.pos[0]
    && this.pos[0] < otherPiece.pos[0] + this.radius + otherPiece.radius
    && this.pos[1] + this.radius + otherPiece.radius > otherPiece.pos[1]
    && this.pos[1] < otherPiece.pos[1] + this.radius + otherPiece.radius) {
      const distance = this.distanceTo(otherPiece);
      if (distance < this.radius + otherPiece.radius) {
        return true;
      }
    } else {
      return false;
    }
  }

  handleCollision(otherPiece) {
    const conAngle = Util.contactAngle(this.pos, otherPiece.pos);
    const v1 = this.totalVelocity();
    const v2 = otherPiece.totalVelocity();
    const theta1 = this.movementAngle();
    const theta2 = otherPiece.movementAngle();
    const m1 = this.mass;
    const m2 = otherPiece.mass;

    const spread = (this.radius + otherPiece.radius) - this.distanceTo(otherPiece);

    const sepX = spread * Math.cos(conAngle);
    const sepY = spread * Math.sin(conAngle);

    this.pos[0] -= sepX;
    this.pos[1] -= sepY;

    const punch = 1;

    this.vel[0] -= punch*Math.cos(conAngle);
    this.vel[1] -= punch*Math.sin(conAngle);
    otherPiece.vel[0] += punch*Math.cos(conAngle);
    otherPiece.vel[1] += punch*Math.sin(conAngle);
  }
}

const FRAME_RATE = 1000/60;

module.exports = GamePiece;
