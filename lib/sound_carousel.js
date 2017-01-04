class SoundCarousel{
  constructor(filePath, ns=10) {
    this.sounds = [];
    this.soundIndex = 0;
    this.ns = ns;

    for (let i = 0; i < ns; i++) {
      this.sounds.push(new Audio(filePath));
    }
  }

  play() {
    this.sounds[this.soundIndex % this.ns].play();
    this.soundIndex++;
  }
}

module.exports = SoundCarousel;
