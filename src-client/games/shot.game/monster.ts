import * as PIXI from "pixi.js";
import { loaderHandler, BaseShape } from '../base.game';

interface MoveMode {
  xSpeed: number,
  ySpeed: number,
  circleSpeed: number,
  radius: number
}

export enum Direction {
  left = 1,
  right = 2,
  up = 3,
  down = 4,
}


export class Monster {
  private app: PIXI.Application = null

  private boomEffect: PIXI.Sprite = null; // 炸裂特效
  private monster: PIXI.Sprite = null; // 怪物
  private currentDirectionX: Direction = Direction.right; // 水平移動方向
  private currentDirectionY: Direction = Direction.down; // 垂直移動方向
  private level: number = 1; // 等級

  public x: number = 0; // x座標
  public y: number = 0; // y座標

  private moveModes: MoveMode[] = [
    { xSpeed: 0, ySpeed: 0, circleSpeed: 0, radius: 0 }, // level 1
    { xSpeed: 1, ySpeed: 0, circleSpeed: 0, radius: 0 }, // level 2
    { xSpeed: 0, ySpeed: 1, circleSpeed: 0, radius: 0 }, // level 3
    { xSpeed: 1, ySpeed: 1, circleSpeed: 0, radius: 0 }, // levle 4
    { xSpeed: 0, ySpeed: 0, circleSpeed: 5, radius: 30 }, // levle 5
    { xSpeed: 1, ySpeed: 1, circleSpeed: 5, radius: 30 }, // levle 6
  ]

  // public sprite: PIXI.extras.AnimatedSprite = null;
  public sprite: PIXI.Graphics = null;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  get point() {
    return this.level;
  }

  get coin() {
    return 1;
  }

  get moveMode(): MoveMode {
    let index = (this.level - 1) % 6;
    if(this.level !== 1 && (this.level - 1) % 6 === 0) index +=1;
    return this.moveModes[index];
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

    window['monster'] = this

    return this;
  }

  private move(): void {
    let { xSpeed, ySpeed, circleSpeed, radius } = this.moveMode;

    if (this.x + this.sprite.width >= this.app.screen.width) {
      this.currentDirectionX = Direction.left;
    } else if (this.x < 0) {
      this.currentDirectionX = Direction.right;
    }

    if (this.y + this.sprite.height >= this.app.screen.height / 3) {
      this.currentDirectionY = Direction.up;
    } else if (this.y < 0) {
      this.currentDirectionY = Direction.down;
    }

    const isRandom = this.level > 15 ? Math.floor(Math.random()*2) === 0 : false;
    // 大於15等後開始隨機速度
    let moveX = isRandom ? (Math.random() * xSpeed) : xSpeed;
    let moveY = isRandom ? (Math.random() * ySpeed) : ySpeed;
    // let moveCircle = isRandom ? (Math.floor(Math.random() * circleSpeed)) + 1 : circleSpeed;

    switch (this.currentDirectionX) {
      case Direction.right:

        break;
      case Direction.left:
        moveX = -Math.abs(moveX);
        break;
    }
    switch (this.currentDirectionY) {
      case Direction.up:
        moveY = -Math.abs(moveY);
        break;
      case Direction.down:

        break;
    }


    this.x += moveX;
    this.y += moveY;

    if (circleSpeed) {
      let round = +new Date() / 1000 * circleSpeed;
      this.sprite.x = this.x + Math.cos(round) * radius - (this.sprite.width / 2);
      this.sprite.y = this.y + Math.sin(round) * radius - (this.sprite.width / 2);
    } else {
      this.sprite.x = this.x;
      this.sprite.y = this.y;
    }
  }

  private start() {
    this.app.ticker.add(this.move, this);
  }

  private stop() {
    this.app.ticker.remove(this.move, this);
  }

  setMonster(level: number): void {
    this.level = level;

    // 加入怪物、隱藏爆炸效果
    this.sprite.addChild(this.monster);
    this.sprite.alpha = 1;
    this.boomEffect.visible = false;

    // 根據等級調整怪物大小
    let scale = this.level >= 10 ? 1 - (this.level * 0.01) : 1;
    if(scale <= 0.3) scale = 0.3;

    this.sprite.height = (this.sprite.height / this.sprite.width) * (this.app.screen.width / 3);
    this.sprite.width = this.app.screen.width / 3;
    this.sprite.scale.x *= scale;
    this.sprite.scale.y *= scale;

    // 設置初始位置
    this.x = Math.floor(Math.random() * (this.app.screen.width - this.sprite.width));
    this.y = this.app.screen.height / 7;
    this.sprite.x = this.x
    this.sprite.y = this.y

    this.start();
  }


  boom(): Promise<void> {
    this.stop();
    this.boomEffect.visible = true;
    this.boomEffect.x = this.monster.x;
    this.boomEffect.y = this.monster.y;
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
