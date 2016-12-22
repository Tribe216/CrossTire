const Util = require("./util");

class GamePiece {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.mass = options.mass;
    this.color = options.color;

    this.isCollidingWith = this.isCollidingWith.bind(this);
    this.handleCollision = this.handleCollision.bind(this);
    this.totalVelocity = this.totalVelocity.bind(this);

    this.movementAngle = this.movementAngle.bind(this);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
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

  isCollidingWith(otherPiece) {
    if (this.pos[0] + this.radius + otherPiece.radius > otherPiece.pos[0]
    && this.pos[0] < otherPiece.pos[0] + this.radius + otherPiece.radius
    && this.pos[1] + this.radius + otherPiece.radius > otherPiece.pos[1]
    && this.pos[1] < otherPiece.pos[1] + this.radius + otherPiece.radius) {
      const distance = Math.sqrt(
            Math.pow((this.pos[0] - otherPiece.pos[0]), 2)
          + Math.pow((this.pos[1] - otherPiece.pos[1]), 2)
           );
      if (distance < this.radius + otherPiece.radius) {
        return true;
      }
    } else {
      return false;
    }
  }

  handleCollision(otherPiece) {
    const conAngle1 = Util.contactAngle(this.pos, otherPiece.pos);
    const conAngle2 = Util.contactAngle(otherPiece.pos, this.pos);
    const v1 = this.totalVelocity();
    const v2 = otherPiece.totalVelocity();
    const theta1 = this.movementAngle();
    const theta2 = otherPiece.movementAngle();
    const m1 = this.mass;
    const m2 = otherPiece.mass;

    let newVelX1 =
      ((( v1 * Math.cos(theta1 - conAngle1) * (m1 - m2)) +
      (2 * m2 * v2 * Math.cos(theta2 - conAngle1)) /
      (m1 + m2)) * Math.cos(conAngle1)) +

      ( v1 * Math.sin(theta1 - conAngle1) * Math.cos(conAngle1 + (Math.PI / 2)));

    let newVelY1 =
      ((( v1 * Math.cos(theta1 - conAngle1) * (m1 - m2)) +
      (2 * m2 * v2 * Math.cos(theta2 - conAngle1)) /
      (m1 + m2)) * Math.sin(conAngle1)) +

      ( v1 * Math.sin(theta1 - conAngle1) * Math.sin(conAngle1 + (Math.PI / 2)));

    let newVelX2 =
      ((( v2 * Math.cos(theta2 - conAngle1) * (m2 - m1)) +
      (2 * m1 * v1 * Math.cos(theta1 - conAngle1)) /
      (m1 + m2)) * Math.cos(conAngle1)) +

      ( v2 * Math.sin(theta2 - conAngle1) * Math.cos(conAngle1 + (Math.PI / 2)));

    let newVelY2 =
      ((( v2 * Math.cos(theta2 - conAngle1) * (m2 - m1)) +
      (2 * m1 * v1 * Math.cos(theta1 - conAngle1)) /
      (m1 + m2)) * Math.sin(conAngle1)) +

      ( v2 * Math.sin(theta2 - conAngle1) * Math.sin(conAngle1 + (Math.PI / 2)));

    this.vel = [newVelX1, newVelY1];
    otherPiece.vel = [newVelX2, newVelY2];

    this.pos[0] += this.vel[0];
    this.pos =
    debugger
  }
}

const FRAME_RATE = 1000/60;

module.exports = GamePiece;
