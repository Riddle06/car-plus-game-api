import * as PIXI from "pixi.js";
import { loaderHandler } from '../base.game';

export class Cannon {
  private app: PIXI.Application = null;
  private car: PIXI.Sprite = null; // 砲座
  private cannon: PIXI.Sprite = null; // 砲管
  // 是否為順時針
  private isClockwiseDirection: boolean = false

  private readonly degreeConfig = {
    max: 90,
    min: 1
  }

  public sprite: PIXI.Graphics = null;
  public currentDegree: number = 0;
  public isRotating: boolean = false;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  get width(): number {
    return this.sprite.width;
  }

  get height(): number {
    return this.sprite.height;
  }

  get rotation(): number {
    return this.cannon.rotation;
  }

  get cannonPosition(): PIXI.Point {
    return this.cannon.getGlobalPosition();
  }

  get carHeight(): number {
    return this.car.height;
  }

  async init(): Promise<this> {
    await loaderHandler('car', '/static/images/img-car.png');
    await loaderHandler('cannon', '/static/images/img-cannon.png');

    this.sprite = new PIXI.Graphics();
    this.car = new PIXI.Sprite(PIXI.loader.resources['car'].texture);
    this.cannon = new PIXI.Sprite(PIXI.loader.resources['cannon'].texture);

    this.sprite.addChild(this.cannon);
    this.sprite.addChild(this.car);

    this.car.anchor.x = 0;
    this.car.anchor.y = 0;
    this.car.position.set(0, 0);

    this.cannon.anchor.x = .5;
    this.cannon.anchor.y = .6; // 重心移動到中間
    this.cannon.position.set(this.car.width / 2, 150);


    this.sprite.height = (this.sprite.height / this.sprite.width) * (this.app.screen.width / 3);
    this.sprite.width = this.app.screen.width / 3;
    this.sprite.x = 15;
    this.sprite.y = this.app.screen.height - (this.sprite.height + 70);

    this.cannon.rotation = -90 * (Math.PI / 180);

    this.app.ticker.add(this.rotationHandler, this);

    return this;
  }

  addChild(sprite: PIXI.Sprite) {
    this.cannon.addChild(sprite);
  }
  removeChild(sprite: PIXI.Sprite) {
    this.cannon.removeChild(sprite);
  }

  async rotationHandler() {

    if (!this.isRotating) return;

    if (this.currentDegree >= this.degreeConfig.max) {
      this.isClockwiseDirection = true
    } else if (this.currentDegree <= this.degreeConfig.min) {
      this.isClockwiseDirection = false
    }

    if (this.isClockwiseDirection) {

      this.cannon.rotation += 0.01
    } else {
      this.cannon.rotation -= 0.01
    }

    this.currentDegree = Math.abs(this.cannon.rotation / (Math.PI / 180))

    // console.log("this.currentDegree", this.currentDegree)



    // this.shell.x = this.shellInitPosition.x - (this.shellInitPosition.x *

    //     Math.sin((this.currentDegree * (Math.PI / 180)))
    // );

    // this.shell.x = 
    // (this.cannon.x * (
    //     this.currentDegree * (Math.PI / 180))) + 
    // this.shellInitPosition.x - (
    //     this.shellInitPosition.x * Math.sin(this.currentDegree * (Math.PI / 180)));





    // console.log(`this.shellInitPosition.x`, this.shellInitPosition.x)
    // console.log(`Math.sin((this.currentDegree * (Math.PI / 180))`, Math.sin((this.currentDegree * (Math.PI / 180))))

    // console.log(`this.shell.x`, this.shell.x)

    // this.shell.y = this.x

  }
}