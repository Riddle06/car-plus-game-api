import * as PIXI from "pixi.js";
import { BaseGame, loaderHandler } from '../base.game';
import { Cannon } from './cannon';
import { SuperMan } from './super-man';
import * as dat from "dat.gui";
const gui = new dat.GUI();

export class ShotGame extends BaseGame {
  private superMan: SuperMan = null
  private cannon: Cannon = null // 大砲
  private shellInitPosition: {
    x: number
    y: number
  }


  private readonly shellInitPower = 10
  private shellInitWeightSpeed = 0.1
  private shotting: boolean;

  private currentShellXPower: number = 0
  private currentShellYPower: number = 0
  private currentShellWeightSpeed = 0



  protected async initImages(): Promise<void> {
    await loaderHandler('bg', '/static/images/bg.shot.jpg');
    

    this.setBackground();  // 放上背景
  }

  protected async initElements(): Promise<boolean> {

    this.cannon = await new Cannon(this.application).init();
    this.superMan = await new SuperMan(this.application, this.cannon).init();

    gui.add(this.cannon, 'rotation');


    this.application.stage.interactive = true;
    this.application.stage.interactiveChildren = true;



    this.application.ticker.add(this.shottingHandler, this)

    gui.add(this.superMan.man, 'x');
    gui.add(this.superMan.man, 'y');
    gui.add(this.superMan.man, 'rotation');

    gui.add(this.superMan.ball, 'x');
    gui.add(this.superMan.ball, 'y');
    gui.add(this.superMan.ball, 'rotation');



    this.cannon.addChild(this.superMan.ball);
    this.stage.addChild(this.superMan.man);
    this.stage.addChild(this.cannon.sprite);
    return Promise.resolve(true);
  }

  protected async initElementsOffset(): Promise<boolean> {
    return Promise.resolve(true);
  }

  protected async initElementsEvents(): Promise<boolean> {

    this.application.stage.on('touchstart', () => {
      // console.log(`touchstart`)
      this.cannon.isRotating = true;
    })

    this.application.stage.on('touchend', () => {
      // console.log(`touchend`)
      this.cannon.isRotating = false
      this.fire();
    })

    return Promise.resolve(true);
  }


  async fire() {


    this.shotting = true;

    this.currentShellXPower = this.shellInitPower * Math.cos(this.cannon.currentDegree * (Math.PI / 180))
    this.currentShellYPower = this.shellInitPower * Math.sin(this.cannon.currentDegree * (Math.PI / 180))
    this.currentShellWeightSpeed = this.shellInitWeightSpeed;
    const globalPosition = this.superMan.ball.getGlobalPosition();

    this.cannon.removeChild(this.superMan.ball)

    this.stage.addChild(this.superMan.ball)
    this.superMan.ball.x = globalPosition.x;
    this.superMan.ball.y = globalPosition.y;

    // console.log(`globalPosition`, { x: globalPosition.x, y: globalPosition.y })


  }

  async shottingHandler() {
    if (!this.shotting) {
      return;
    }

    // this.currentShellWeightSpeed += this.currentShellWeightSpeed
    // this.shell.rotation += 0.1;

    this.currentShellYPower -= this.shellInitWeightSpeed

    console.log(`this.currentShellYPower`, this.currentShellYPower)
    console.log(`this.currentShellXPower`, this.currentShellXPower)

    this.superMan.ball.x += this.currentShellXPower;
    this.superMan.ball.y += ((-1 * this.currentShellYPower) + this.currentShellWeightSpeed);

    console.log(this.superMan.ball.y)
    console.log(this.superMan.ball.x)
  }
}