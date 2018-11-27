import * as PIXI from "pixi.js";
import { loaderHandler } from '../base.game';


export class Monster {
  private app: PIXI.Application = null

  private moveSpeed: number = 3;
  private boomEffect: PIXI.Sprite = null; // 炸裂特效
  private monster: PIXI.Sprite = null; // 怪物
  // public sprite: PIXI.extras.AnimatedSprite = null;
  public sprite: PIXI.Graphics = null;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  get point() {
    return 1;
  }

  get coin() {
    return 1;
  }

  async init(): Promise<this> {
    // if (!PIXI.loader.resources['man']) await loaderHandler('man', '/static/images/img-superman01/img-superman01.json');
    // const superManFrames: PIXI.Texture[] =
    //   ["img-superman010.png", "img-superman011.png", "img-superman012.png"]
    //     .map(x => PIXI.Texture.fromFrame(x))
    if (!PIXI.loader.resources['monster']) await loaderHandler('monster', '/static/images/img-monster01.png');
    if (!PIXI.loader.resources['boom']) await loaderHandler('boom', '/static/images/img-boom.png');

    this.sprite = new PIXI.Graphics();
    this.monster = new PIXI.Sprite(PIXI.loader.resources['monster'].texture);
    this.boomEffect = new PIXI.Sprite(PIXI.loader.resources['boom'].texture);
    this.sprite.addChild(this.boomEffect);
    this.boomEffect.visible = false;

    return this;
  }

  private move() {
    if (this.sprite.x + this.sprite.width > this.app.screen.width) {
      this.moveSpeed = Math.abs(this.moveSpeed) * -1;
    } else if (this.sprite.x < 0) {
      this.moveSpeed = Math.abs(this.moveSpeed);
    }
    this.sprite.x += this.moveSpeed;
  }

  private start() {
    this.app.ticker.add(this.move, this);
  }

  private stop() {
    this.app.ticker.remove(this.move, this);
  }

  setMonster(level: number): void {
    this.sprite.addChild(this.monster);
    this.sprite.alpha = 1;
    this.boomEffect.visible = false;
    this.sprite.height = (this.sprite.height / this.sprite.width) * (this.app.screen.width / 4);
    this.sprite.width = this.app.screen.width / 4;
    this.sprite.x = Math.floor(Math.random() * (this.app.screen.width - this.sprite.width));
    this.sprite.y = this.app.screen.height / 7;
    this.start();
  }


  boom(): Promise<void> {
    this.stop();
    this.boomEffect.visible = true;
    this.sprite.removeChild(this.monster);
    // 炸裂
    return new Promise((reslove) => {

      const effect = () => {
        if (this.sprite.alpha <= 0) {
          this.app.ticker.remove(effect, this);
          reslove();
          return;
        }
        this.sprite.alpha -= 0.01;
      }
      this.app.ticker.add(effect, this);
    })
  }
}
