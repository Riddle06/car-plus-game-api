import * as PIXI from "pixi.js";
import { loaderHandler } from '../base.game';
import { Cannon } from './cannon';


export class SuperMan {
  private app: PIXI.Application = null
  private cannon: Cannon = null;

  public man: PIXI.extras.AnimatedSprite = null;
  public ball: PIXI.Sprite = null;
  public isReady: boolean = false;

  constructor(app: PIXI.Application, cannon: Cannon) {
    this.app = app;
    this.cannon = cannon;
  }

  async initMan(): Promise<PIXI.extras.AnimatedSprite> {
    if (!PIXI.loader.resources['man']) await loaderHandler('man', '/static/images/img-superman01/img-superman01.json');
    const superManFrames: PIXI.Texture[] =
      ["img-superman010.png", "img-superman011.png", "img-superman012.png"]
        .map(x => PIXI.Texture.fromFrame(x))

    this.man = new PIXI.extras.AnimatedSprite(superManFrames);
    this.man.x = 0;
    this.man.anchor.y = 1;
    this.man.y = this.cannon.carY + this.cannon.carHeight;
    this.man.animationSpeed = 0.1;
    this.man.play();

    window['man'] = this.man;

    return this.man;
  }

  async initBall(): Promise<PIXI.Sprite> {
    this.isReady = false;
    if (!PIXI.loader.resources['ball']) await loaderHandler('ball', '/static/images/img-superball01.png');
    this.ball = new PIXI.Sprite(PIXI.loader.resources['ball'].texture);
    this.ball.visible = true;
    this.ball.anchor.x = .5;
    this.ball.anchor.y = .5;
    this.ball.x = 0;
    this.ball.y = -(this.ball.height / 6);
    this.ball.rotation = 90 * (Math.PI / 180);

    window['ball'] = this.ball;

    return this.ball;
  }

  ready() {
    if(this.man.alpha > 0) {
      this.man.alpha -= 0.05;
      return;
    }

    if(this.ball.x <= this.ball.width / 2) {
      this.ball.x += 1;
    } else {
      this.isReady = true;
      this.app.ticker.remove(this.ready, this)
    }
  }

}
