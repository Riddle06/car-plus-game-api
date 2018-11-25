import * as PIXI from "pixi.js";
import { loaderHandler } from '../base.game';
import { Cannon } from './cannon';


export class SuperMan {
  private app: PIXI.Application = null
  private cannon: Cannon = null;

  private isStepOneDone: boolean = false;
  private isStepTwoDone: boolean = false;

  public man: PIXI.extras.AnimatedSprite = null;
  public ball: PIXI.Sprite = null;

  constructor(app: PIXI.Application, cannon: Cannon) {
    this.app = app;
    this.cannon = cannon;
  }

  async init(): Promise<this> {
    if (!PIXI.loader.resources['ball']) await loaderHandler('ball', '/static/images/img-superball01.png');
    // if (!PIXI.loader.resources['man']) await loaderHandler('man', '/static/images/img-superman01/img-superman01.json');
    // const superManFrames: PIXI.Texture[] =
    //   ["img-superman010.png", "img-superman011.png", "img-superman012.png"]
    //     .map(x => PIXI.Texture.fromFrame(x))


    this.ball = new PIXI.Sprite(PIXI.loader.resources['ball'].texture);
    this.ball.visible = true;
    this.ball.anchor.x = .5;
    this.ball.anchor.y = .5;
    this.ball.x = this.ball.width / 2;
    this.ball.y = -(this.ball.height / 6);
    this.ball.rotation = 90 * (Math.PI / 180);

    window['ball'] = this.ball;

    // this.man = new PIXI.extras.AnimatedSprite(superManFrames);
    // this.man.animationSpeed = 0.1;
    // this.man.play();

    return this;
  }

}
