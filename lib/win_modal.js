class WinModal {
  constructor(options={}) {
    this.winner = options.winner;
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";

    ctx.rect(20,20,150,100);
    ctx.stroke();

  }

  remove(ctx) {

  }

}

module.exports = WinModal;
