import * as PIXI from "pixi.js";
import { BaseGame, loaderHandler } from '../base.game';
import { Cannon } from './cannon';
import { SuperMan } from './super-man';
// import * as dat from "dat.gui";
// const gui = new dat.GUI();

interface LifeVM {
  container: PIXI.Container,
  hurt: PIXI.Sprite,
  heart: PIXI.Sprite,
  hollow: PIXI.Sprite,
}

export class ShotGame extends BaseGame {
  private superMan: SuperMan = null
  private cannon: Cannon = null // 大砲
  private life: LifeVM[] = []// 生命
  private lifeStep: number = 0; // 現在使用的命

  private readonly shellInitPower = 10
  private shellInitWeightSpeed = 0.1
  private shotting: boolean;

  private currentShellXPower: number = 0
  private currentShellYPower: number = 0
  private currentShellWeightSpeed = 0



  protected async initImages(): Promise<void> {
    await loaderHandler('bg', '/static/images/bg.shot.jpg');
    await loaderHandler('heart', '/static/images/item-heart.png');
    await loaderHandler('hurt', '/static/images/item-hurt.png');
    await loaderHandler('hollow', '/static/images/item-hollow.png');

    this.setBackground();  // 放上背景
  }

  protected async initElements(): Promise<boolean> {
    this.cannon = await new Cannon(this.application).init();
    await this.setCannon();
    this.stage.addChild(this.cannon.sprite);

    this.application.stage.interactive = true;
    this.application.ticker.add(this.shottingHandler, this)

    this.setLife();

    return Promise.resolve(true);
  }

  protected async initElementsOffset(): Promise<boolean> {
    return Promise.resolve(true);
  }

  protected async initElementsEvents(): Promise<boolean> {

    this.application.stage.on('touchstart', () => {
      // console.log(`touchstart`)
      if (this.shotting || this.lifeStep >= 2) return;
      this.cannon.isRotating = true;
    })

    this.application.stage.on('touchend', () => {
      // console.log(`touchend`)
      if (this.shotting || this.lifeStep >= 2) return;
      this.cannon.isRotating = false
      this.fire();
      this.cannon.fire();
    })

    return Promise.resolve(true);
  }

  private setLife(): void {
    // 設置生命
    const fullWidth = this.application.screen.width;
    this.life[0] = this.generateLife();
    this.life[1] = this.generateLife();

    this.life[1].container.x = (fullWidth / 3) * 2 + 15;
    this.life[1].container.y = 15;
    this.life[0].container.x = this.life[1].container.x + this.life[1].container.width;
    this.life[0].container.y = 15;


    this.stage.addChild(this.life[0].container);
    this.stage.addChild(this.life[1].container);
  }

  private generateLife(): LifeVM {
    const fullWidth = this.application.screen.width;
    const container = new PIXI.Container();
    const hurt = new PIXI.Sprite(PIXI.loader.resources['hurt'].texture);
    const heart = new PIXI.Sprite(PIXI.loader.resources['heart'].texture);
    const hollow = new PIXI.Sprite(PIXI.loader.resources['hollow'].texture);
    hurt.visible = false;
    hollow.visible = false;
    hurt.position.set(0, 0);
    heart.position.set(0, 0);
    hollow.position.set(0, 0);
    container.addChild(hurt, heart, hollow);

    container.height = (container.height / container.width) * (fullWidth / 8);
    container.width = (fullWidth / 8);

    return {
      container,
      hurt,
      heart,
      hollow
    }
  }


  async setCannon(): Promise<void> {
    if (this.lifeStep >= 2) return;
    this.superMan = await new SuperMan(this.application, this.cannon).init();
    this.cannon.addChild(this.superMan.ball);
  }

  async fire(): Promise<void> {

    this.shotting = true;

    this.currentShellXPower = this.shellInitPower * Math.cos(this.cannon.currentDegree * (Math.PI / 180))
    this.currentShellYPower = this.shellInitPower * Math.sin(this.cannon.currentDegree * (Math.PI / 180))
    this.currentShellWeightSpeed = this.shellInitWeightSpeed;
    const globalPosition = this.superMan.ball.getGlobalPosition();

    this.cannon.removeChild(this.superMan.ball)

    this.superMan.ball.scale = this.cannon.sprite.scale;
    this.stage.addChild(this.superMan.ball)
    this.superMan.ball.x = globalPosition.x;
    this.superMan.ball.y = globalPosition.y;

    // console.log(`globalPosition`, { x: globalPosition.x, y: globalPosition.y })
  }

  missed() {
    this.life[this.lifeStep].heart.visible = false;
    this.life[this.lifeStep].hurt.visible = true;
    const redEffect = new PIXI.Graphics();
    redEffect.beginFill(0xff0000);
    redEffect.drawRect(0, 0, this.screen.width, this.screen.height);
    redEffect.endFill();
    redEffect.alpha = .5;
    this.effectContainer.addChild(redEffect);

    const effect = () => {
      redEffect.alpha -= 0.01;
      if (redEffect.alpha <= 0) {
        this.life[this.lifeStep].hurt.visible = false;
        this.life[this.lifeStep].hollow.visible = true;
        this.lifeStep += 1;
        this.setCannon();
        this.application.ticker.remove(effect, this);
      }
    }

    this.application.ticker.add(effect, this)


  }

  async shottingHandler(): Promise<void> {
    if (!this.shotting) {
      return;
    }

    // this.currentShellWeightSpeed += this.currentShellWeightSpeed
    // this.shell.rotation += 0.1;
    this.superMan.ball.rotation += 0.3;

    this.currentShellYPower -= this.shellInitWeightSpeed

    // console.log(`this.currentShellYPower`, this.currentShellYPower)
    // console.log(`this.currentShellXPower`, this.currentShellXPower)

    this.superMan.ball.x += this.currentShellXPower;
    this.superMan.ball.y += ((-1 * this.currentShellYPower) + this.currentShellWeightSpeed);

    // console.log(this.superMan.ball.y)
    // console.log(this.superMan.ball.x)

    if (this.superMan.ball.x >= this.application.screen.width + this.superMan.ball.width ||
      this.superMan.ball.y >= this.application.screen.height + this.superMan.ball.height) {
      this.stage.removeChild(this.superMan.ball);
      this.shotting = false;
      this.missed();
    }
  }
}