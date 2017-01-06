const Util = require("./util");

class Aimbot {
  constructor(gun, tires, fireGun, ctx) {
    this.gun = gun;
    this.tire = tires[0];
    this.lastFired = Date.now();
    this.range = 600;
    this.fireInterval = 300;
    this.fireGun = fireGun;
    // this.gun.power = 8;
    this.ctx = ctx;
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

  aim(offset) {
    // const vectorAngle = Util.contactAngle(this.tire.pos, this.gun.mountPoint) + Math.PI;
    const vectorAngle = Util.contactAngle(this.predictedPos(), this.gun.mountPoint) + Math.PI;
    const marginalDiff = Math.min(offset, Math.abs(this.gun.angle - vectorAngle));

    if (this.gun.angle > vectorAngle) {
      this.gun.aim(-marginalDiff);
    } else if (this.gun.angle < vectorAngle) {
      this.gun.aim(marginalDiff);
    }
  }

  predictedPos() {
    //current pos
    //plus
    //vel
    //times distance / ball speed per second
    let posX, posY;
    const distance = Util.pointsDistance(this.gun.launchPoint(), this.tire.pos);
    const willGoX = (this.tire.vel[0] * distance / this.gun.power / 0.8);
    const willGoY = (this.tire.vel[1] * distance / this.gun.power / 0.8);

    posX = this.tire.pos[0] - willGoX;

    if ((this.tire.pos[1] + willGoY) > 1200) {
      posY = 2400 - this.tire.pos[1] - willGoY;
    } else if ((this.tire.pos[1] + willGoY) < 0) {
      posY = this.tire.pos[1] - willGoY;
    } else {
      posY = this.tire.pos[1] + willGoY;
    }


    // console.log("--------------");
    // console.log(this.tire.pos[0], this.tire.pos[1]);
    // console.log(posX, posY);

    return [posX, posY];
  }

  inFireCone(distance) {
    const vectorAngle = Util.contactAngle(this.tire.pos, this.gun.mountPoint) + Math.PI;
    const angleDiff = Math.abs(this.gun.angle - vectorAngle);
    const fireFace = distance * Math.sin(angleDiff);
    console.log(( (fireFace + 2 ) < this.tire.radius));
    return ( (fireFace + 2 ) < this.tire.radius);

  }




}

module.exports = Aimbot;
