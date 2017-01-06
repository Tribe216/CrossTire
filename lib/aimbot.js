const Util = require("./util");

class Aimbot {
  constructor(gun, tires, fireGun) {
    this.gun = gun;
    this.tire = tires[0];
    this.lastFired = Date.now();
    this.range = 500;
    this.fireInterval = 300;
    this.fireGun = fireGun;
    // this.gun.power = 8;
  }

  step(offset) {
    // get position of tire
    // get current aim angle
    // figure out desired aim angle to tire
    // aim gun up or down or none
    // get current time
    this.aim(offset);
    const curTime = Date.now();
    //firing:
    //check distance
    const distance = Util.pointsDistance(this.gun.mountPoint, this.tire.pos);
    const inRange = ((distance - this.range) <= 0);
    const cooledOff = (curTime >= this.lastFired + this.fireInterval);
    //if within range
    //  and current time >= lastFired + interval
    //  and angle within cone of firing
    //    fire gun
    //    set lastFired

    if (inRange && cooledOff && this.infireCone(distance)) {
      this.fireGun();
      this.lastFired = curTime;
    }
  }

  aim(offset) {
    const vectorAngle = Util.contactAngle(this.tire.pos, this.gun.mountPoint) + Math.PI;
    const marginalDiff = Math.min(offset, Math.abs(this.gun.angle - vectorAngle));

    if (this.gun.angle > vectorAngle) {
      this.gun.aim(-marginalDiff);
    } else if (this.gun.angle < vectorAngle) {
      this.gun.aim(marginalDiff);
    }
  }

  infireCone(distance) {
    const vectorAngle = Util.contactAngle(this.tire.pos, this.gun.mountPoint) + Math.PI;
    const angleDiff = Math.abs(this.gun.angle - vectorAngle);
    const fireFace = distance * Math.sin(angleDiff);
    console.log(( (fireFace + 5 ) < this.tire.radius));
    return ( (fireFace + 5 ) < this.tire.radius);

  }




}

module.exports = Aimbot;
