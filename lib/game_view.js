class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
  }

  bindKeyHandlers() {
    key('s', () => { this.game.fireLeft(); });
    key('w', () => { this.game.fireLeft(); });
    key('d', () => { this.game.fireLeft(); });
    key('a', () => { this.game.fireLeft(); });

    key('p', () => { this.game.fireRight(); });
    key('k', () => { this.game.fireRight(); });
    key('o', () => { this.game.fireRight(); });
    key('l', () => { this.game.fireRight(); });
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    //start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    if(key.isPressed("e")) this.game.leftGun.aim(-GameView.AIM_OFFSET);
    if(key.isPressed("f")) this.game.leftGun.aim(GameView.AIM_OFFSET);

    if(key.isPressed("i")) this.game.rightGun.aim(GameView.AIM_OFFSET);
    if(key.isPressed("j")) this.game.rightGun.aim(-GameView.AIM_OFFSET);

    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;
    //every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.AIM_OFFSET = Math.PI / 90;


module.exports = GameView;
