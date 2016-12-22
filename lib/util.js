const Util = {



  contactAngle(pos1, pos2) {
    return Math.atan2(pos2[1] - pos1[1], pos2[0] - pos1[0]);
  }
};

module.exports = Util;
