import * as PIXI from "pixi.js";
import { loaderHandler } from '../base.game';


export class Monster {
  private app: PIXI.Application = null

  // public sprite: PIXI.extras.AnimatedSprite = null;
  public sprite: PIXI.Sprite = null;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  async init(): Promise<this> {
    // if (!PIXI.loader.resources['man']) await loaderHandler('man', '/static/images/img-superman01/img-superman01.json');
    // const superManFrames: PIXI.Texture[] =
    //   ["img-superman010.png", "img-superman011.png", "img-superman012.png"]
    //     .map(x => PIXI.Texture.fromFrame(x))
    if (!PIXI.loader.resources['monster']) await loaderHandler('monster', '/static/images/img-monster01.png');
    
    this.sprite = new PIXI.Sprite(PIXI.loader.resources['monster'].texture);
    this.sprite.x = this.app.screen.width - this.sprite.width;
    this.sprite.y = this.app.screen.height / 5;

    window['monster'] = this.sprite;
    
    this.app.ticker.add(this.move, this);

    return this;
  }


  move() {
    this.sprite.x -= 1
    this.sprite.y -= 1
  }
}
