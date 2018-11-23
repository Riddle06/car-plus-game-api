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
    await loaderHandler('ball', '/static/images/img-superball01.png');
    await loaderHandler('man', '/static/images/img-superman01/img-superman01.json');
    const superManFrames: PIXI.Texture[] =
      ["img-superman010.png", "img-superman011.png", "img-superman012.png"]
        .map(x => PIXI.Texture.fromFrame(x))


    this.ball = new PIXI.Sprite(PIXI.loader.resources['ball'].texture);
    this.ball.visible = false;

    this.man = new PIXI.extras.AnimatedSprite(superManFrames);
    this.man.animationSpeed = 0.1;
    this.man.play();

    this.man.height = (this.man.height / this.man.width) * (this.app.screen.width / 5);
    this.man.width = this.app.screen.width / 5;
    this.man.anchor.x = .5;
    this.man.anchor.y = .5;
    this.man.x = this.man.width / 2;
    this.man.y = this.app.screen.height - ((this.man.height / 2) + 70);

    this.app.ticker.add(this.handleSuperMan, this)
    return this;
  }

  handleSuperMan() {
    if (!this.isStepOneDone) {
      if (this.man.x < this.cannon.cannonPosition.x - 10) {
        this.man.x += 1;
        return;
      }
      if (this.man.y > this.cannon.carHeight) {
        this.man.y -= 1;
        return;
      }

      this.isStepOneDone = true;
      return;
    }

    this.man.y += 1;
    this.man.scale.x -= 0.002;
    this.man.scale.y -= 0.002;
    this.man.alpha -= 0.001;
  }

}
