import * as PIXI from "pixi.js";
import { loaderHandler } from '../base.game';
import { CatchGameParameters } from './index';

export interface FallItemType {
  score: number,
  name: string,
  gamePoint: { min: number, max: number }
}

export class FallItem {
  private fallSpeed: number;
  // private sprite: PIXI.extras.AnimatedSprite = null;
  private app: PIXI.Application = null;
  private types: FallItemType[] = [];

  public sprite: PIXI.Sprite = null;
  public score: number = 0;
  public gamePoint: FallItemType['gamePoint'] = {
    min: 0,
    max: 0,
  }


  constructor(app: PIXI.Application, parameters: CatchGameParameters) {
    this.app = app;
    this.fallSpeed = parameters.fallSpeed;
    this.types = parameters.types;
  }

  async init(index: number): Promise<this> {

    if (!PIXI.loader.resources['bomb']) await loaderHandler('bomb', '/static/images/item-bomb.png');
    if (!PIXI.loader.resources['gift01']) await loaderHandler('gift01', '/static/images/item-gift01.png');
    if (!PIXI.loader.resources['gift02']) await loaderHandler('gift02', '/static/images/item-gift02.png');
    if (!PIXI.loader.resources['gift03']) await loaderHandler('gift03', '/static/images/item-gift03.png');


    const type = this.types[Math.floor(Math.random() * this.types.length)];
    this.score = type.score;
    this.gamePoint = type.gamePoint;
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