import * as PIXI from "pixi.js";

export class FallItem {
  private fallSpeed: number = 3
  private sprite: PIXI.extras.AnimatedSprite = null;
  private app: PIXI.Application = null;
  public shape: PIXI.Graphics = null;

  private initSize = {
    width: 50,
    height: 50,
  }

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  async init() {
    this.shape = new PIXI.Graphics();

    const startOffsetX = (Math.floor(Math.random() * (this.app.screen.width - this.initSize.width)));
    if ((Math.ceil((Math.random() * 1000)) % 2) === 1) {
      this.shape.beginFill(0Xffa500);
      this.shape.drawRect(0, 0, this.initSize.width, this.initSize.height)
      this.shape.endFill();
      this.shape.x = startOffsetX;
      this.shape.y = -this.initSize.height;
    }

    this.app.ticker.add(this.fallHandler.bind(this));

    return this.shape;
  }

  protected fallHandler(delta: number): void {
    this.shape.y += this.fallSpeed;
  }
}