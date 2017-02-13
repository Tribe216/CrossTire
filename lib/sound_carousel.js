class SoundCarousel{
  constructor(filePath, soundCount=10) {
    this.sounds = [];
    this.soundIndex = 0;
    this.soundCount = soundCount;

    for (let i = 0; i < soundCount; i++) {
      this.sounds.push(new Audio(filePath));
    }
  }

  play() {
    this.sounds[this.soundIndex % this.soundCount].volume = window.sfxVolume;
    this.sounds[this.soundIndex % this.soundCount].play();
    this.soundIndex++;
  }
}

module.exports = SoundCarousel;
