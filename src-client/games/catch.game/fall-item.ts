import * as PIXI from "pixi.js";
import { loaderHandler } from '../base.game';

interface Type {
  point: number,
  name: string
}

export class FallItem {
  private fallSpeed: number = 3
  // private sprite: PIXI.extras.AnimatedSprite = null;
  private app: PIXI.Application = null;
  private types: Type[] = [];

  public sprite: PIXI.Sprite = null;
  public point: number = 0;


  constructor(app: PIXI.Application) {
    this.app = app;
    this.types = [
      { point: -1, name: 'bomb' },
      { point: 2, name: 'gift01' },
      { point: 2, name: 'gift02' },
      { point: 2, name: 'gift03' },
    ]
  }

  async init(index: number): Promise<this> {

    if (!PIXI.loader.resources['bomb']) await loaderHandler('bomb', '/static/images/item-bomb.png');
    if (!PIXI.loader.resources['gift01']) await loaderHandler('gift01', '/static/images/item-gift01.png');
    if (!PIXI.loader.resources['gift02']) await loaderHandler('gift02', '/static/images/item-gift02.png');
    if (!PIXI.loader.resources['gift03']) await loaderHandler('gift03', '/static/images/item-gift03.png');


    const type = this.types[Math.floor(Math.random() * this.types.length)];
    this.point = type.point;
    this.sprite = new PIXI.Sprite(PIXI.loader.resources[type.name].texture);
    this.sprite.height = (this.sprite.height / this.sprite.width) * (this.app.screen.width / 5);
    this.sprite.width = this.app.screen.width / 5;
    this.sprite.x = (this.app.screen.width / 5) * index;
    this.sprite.y = -this.sprite.height;

    this.app.ticker.add(this.fallHandler, this);

    return this;
  }

  protected fallHandler(delta: number): void {
    if (!this.sprite.visible) return
    this.sprite.y += this.fallSpeed;
  }
}