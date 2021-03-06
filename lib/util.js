const Util = {
  contactAngle(pos1, pos2) {
    return Math.atan2(pos2[1] - pos1[1], pos2[0] - pos1[0]);
  },

  pointsDistance(pos1, pos2) {
    return Math.sqrt(
        Math.pow((pos2[0] - pos1[0]), 2)
      + Math.pow((pos2[1] - pos1[1]), 2)
    );
  },

  startingTireVel() {
    return [(Math.random() - 0.5) * 10 / 100, (Math.random() - 0.5) * 10 / 100];
  }

};

module.exports = Util;
