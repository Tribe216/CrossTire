class GameView {
  constructor(game, ctx, players=1, level=1) {
    this.ctx = ctx;
    this.game = game;
    this.players = 1;
    this.paused = false;
  }

  bindKeyHandlers() {
    key('s', () => { this.game.fireLeft(); });
    key('w', () => { this.game.fireLeft(); });
    key('a', () => { this.game.fireLeft(); });

    key('k', () => { this.game.fireRight(); });
    key('o', () => { this.game.fireRight(); });
    key('l', () => { this.game.fireRight(); });

    key('p', () => { this.togglePause(); });
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    //start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  togglePause() {
    this.paused = this.paused ? false : true;
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    if(!this.paused){

      if(key.isPressed("e")) this.game.leftGun.aim(-GameView.AIM_OFFSET);
      if(key.isPressed("f")) this.game.leftGun.aim(GameView.AIM_OFFSET);
      if(key.isPressed("i")) this.game.rightGun.aim(GameView.AIM_OFFSET);
      if(key.isPressed("j")) this.game.rightGun.aim(-GameView.AIM_OFFSET);

      if (this.players === 1) {
        this.game.aimbot.step(GameView.AIM_OFFSET);
      }
      this.game.step(timeDelta);
      this.game.draw();
      this.game.checkWin();
    }

    this.lastTime = time;
    //every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.AIM_OFFSET = Math.PI / 75;

module.exports = GameView;
