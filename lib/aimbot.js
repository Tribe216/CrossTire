const Util = require("./util");

class Aimbot {
  constructor(gun, tires, fireGun, boardHeight, difficulty) {
    this.gun = gun;
    this.tire = tires[0];
    this.lastFired = 0;
    this.range = 550;
    this.fireGun = fireGun;
    this.boardHeight = boardHeight;
    this.setStats = this.setStats.bind(this);
    this.setStats(difficulty);
  }

  step(offset) {
    this.aim(offset);
    const curTime = Date.now();

    const distance = Util.pointsDistance(this.gun.mountPoint, this.tire.pos);
    const inRange = ((distance - this.range) <= 0);
    const cooledOff = (curTime >= this.lastFired + this.fireInterval);

    if (inRange && cooledOff && this.inFireCone(distance)) {
      this.fireGun();
      this.lastFired = curTime;
    }
  }

  setStats(difficulty) {
    this.gun.power = 3;
    this.gun.errorOffset = (100-difficulty) * 0.025;
    this.fireInterval = 1000 - 4 * difficulty;
    this.range = 350 + 3 * difficulty;
  }

  aim(offset) {
    // const vectorAngle = Util.contactAngle(this.tire.pos, this.gun.mountPoint) + Math.PI;
    const vectorAngle = Util.contactAngle(this.predictedPos(), this.gun.launchPoint()) + Math.PI;
    const marginalDiff = Math.min(offset, Math.abs(this.gun.angle - vectorAngle));

    if (this.gun.angle > vectorAngle) {
      this.gun.aim(-marginalDiff);
    } else if (this.gun.angle < vectorAngle) {
      this.gun.aim(marginalDiff);
    }
  }

  predictedPos() {
    let posX, posY;
    const distance = Util.pointsDistance(this.gun.launchPoint(), this.tire.pos);

    const timeToTire = distance / this.gun.power;
    const timingConstant = 0.90;
    const willGoX = (this.tire.vel[0] * timeToTire) * timingConstant;
    const willGoY = (this.tire.vel[1] * timeToTire) * timingConstant;

    posX = this.tire.pos[0] + willGoX;

    if ((this.tire.pos[1] + willGoY) > (this.boardHeight - this.tire.radius)) {
      posY = (this.boardHeight * 2) - this.tire.pos[1] - willGoY - (this.tire.radius * 2);
    } else if ((this.tire.pos[1] + willGoY - this.tire.radius) < 0) {
      posY = -this.tire.pos[1] - willGoY + (this.tire.radius * 2);
    } else {
      posY = this.tire.pos[1] + willGoY;
    }

    return [posX, posY];
  }

  inFireCone(distance) {
    const vectorAngle = Util.contactAngle(this.predictedPos(), this.gun.mountPoint) + Math.PI;
    const angleDiff = Math.abs(this.gun.angle - vectorAngle);
    const fireFace = distance * Math.sin(angleDiff);
    return ( (fireFace ) < this.tire.radius);
  }

}

module.exports = Aimbot;
