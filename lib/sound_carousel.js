class SoundCarousel{
  constructor(filePath, soundcount=10) {
    this.sounds = [];
    this.soundIndex = 0;
    this.soundcount = soundcount;

    for (let i = 0; i < soundcount; i++) {
      this.sounds.push(new Audio(filePath));
    }
  }

  play() {
    this.sounds[this.soundIndex % this.soundcount].volume = window.sfxVolume;
    this.sounds[this.soundIndex % this.soundcount].play();
    this.soundIndex++;
  }
}

module.exports = SoundCarousel;
