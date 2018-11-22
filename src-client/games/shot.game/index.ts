import * as PIXI from "pixi.js";
import { BaseGame, loaderHandler } from '../base.game';
import * as dat from "dat.gui";
const gui = new dat.GUI();

export class ShotGame extends BaseGame {
  private superMan: PIXI.Container = null
  private cannon: PIXI.Container = null
  private shell: PIXI.Container = null
  private shellInitPosition: {
    x: number
    y: number
  }
  private currentDegree: number = 0

  // 是否為順時針
  private isClockwiseDirection: boolean = false

  private isRotating: boolean = false

  private readonly shellInitPower = 10
  private shellInitWeightSpeed = 0.1
  private shotting: boolean;

  private currentShellXPower: number = 0
  private currentShellYPower: number = 0
  private currentShellWeightSpeed = 0


  private readonly degreeConfig = {
    max: 90,
    min: 1
  }

  protected async initImages(): Promise<void> {
    await loaderHandler('bg', '/static/images/bg.shot.jpg');

    this.setBackground();  // 放上背景
  }

  protected async initElements(): Promise<boolean> {
    // set cannon
    console.log('[initElements]', this.application)

    const cannon = new PIXI.Graphics();
    cannon.beginFill(0Xfff000);
    cannon.drawRect(0, 0, 100, 30)
    cannon.endFill();
    cannon.width = 100;
    cannon.height = 30;
    cannon.x = 30;
    cannon.y = this.application.screen.height - cannon.height;
    // cannon.rotation = -90 * (Math.PI / 180); // 角度轉弧度
    cannon.pivot.y = 15

    this.cannon = cannon;

    gui.add(cannon, 'rotation');


    this.application.ticker.add(() => {
      this.rotationHandler()
    })

    this.application.stage.interactive = true;
    this.application.stage.interactiveChildren = true;
    this.application.stage.on('touchstart', () => {
      // console.log(`touchstart`)
      this.isRotating = true;
    })

    this.application.stage.on('touchend', () => {
      // console.log(`touchend`)
      this.isRotating = false
      this.fire();
    })


    this.application.ticker.add(() => {
      this.shottingHandler();
    })



    const shell = new PIXI.Graphics();
    shell.beginFill(0Xff0000);
    shell.drawCircle(0, 0, 10)
    shell.endFill();
    // shell.x = this.cannon.x + this.cannon.width + 5;
    shell.x = this.cannon.width + 5;
    shell.y = this.cannon.height / 2
    // shell.y = this.cannon.y;
    // cannon.rotation = -90 * (Math.PI / 180); // 
    shell.pivot.y = 10
    shell.pivot.x = 10
    this.shellInitPosition = {
      x: shell.x,
      y: shell.y,
    }
    this.shell = shell

    gui.add(shell, 'x');
    gui.add(shell, 'y');
    gui.add(shell, 'rotation');
    gui.add(this, 'shellInitWeightSpeed')

    cannon.addChild(shell)
    this.stage.addChild(cannon);
    return Promise.resolve(true);
  }

  protected async initElementsOffset(): Promise<boolean> {
    return Promise.resolve(true);
  }

  protected async initElementsEvents(): Promise<boolean> {
    return Promise.resolve(true);
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


  async fire() {


    this.shotting = true;

    this.currentShellXPower = this.shellInitPower * Math.cos(this.currentDegree * (Math.PI / 180))
    this.currentShellYPower = this.shellInitPower * Math.sin(this.currentDegree * (Math.PI / 180))
    this.currentShellWeightSpeed = this.shellInitWeightSpeed;
    const globalPosition = this.shell.getGlobalPosition();

    this.cannon.removeChild(this.shell)

    this.stage.addChild(this.shell)
    this.shell.x = globalPosition.x;
    this.shell.y = globalPosition.y;

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

    this.shell.x += this.currentShellXPower;
    this.shell.y += ((-1 * this.currentShellYPower) + this.currentShellWeightSpeed);

    console.log(this.shell.y)
    console.log(this.shell.x)
  }
}