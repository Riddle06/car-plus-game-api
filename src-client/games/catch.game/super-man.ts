import * as PIXI from "pixi.js";
import { loaderHandler } from '../base.game';
import { CatchGameParameters } from './index';
export class SuperMan {
    private initPosition: {
        x: number
        y: number
    } = null
    private moveSpeed: number;
    private animationSpeed: number = 0.1;
    private app: PIXI.Application = null
    private currentDirection: SuperManDirection = SuperManDirection.right;
    private rightSprite: PIXI.extras.AnimatedSprite = null;
    private leftSprite: PIXI.extras.AnimatedSprite = null;
    private spriteFolderPath: string;

    public sprite: PIXI.Graphics = null;


    constructor(app: PIXI.Application, parameters: CatchGameParameters, spriteFolderPath: string) {
        this.app = app;
        this.spriteFolderPath = spriteFolderPath;
        this.moveSpeed = parameters.moveSpeed;
    }

    async init(): Promise<this> {
        await loaderHandler('super-man', `${this.spriteFolderPath || '/static/images/superman00'}/config.json`);

        const superManFrames: PIXI.Texture[] = Object.keys(PIXI.loader.resources['super-man'].data.frames)
            .map(key => PIXI.Texture.fromFrame(key))


        this.sprite = new PIXI.Graphics();
        this.rightSprite = new PIXI.extras.AnimatedSprite(superManFrames);
        this.leftSprite = new PIXI.extras.AnimatedSprite(superManFrames);
        this.sprite.addChild(this.leftSprite);
        this.sprite.addChild(this.rightSprite);
        this.sprite.width = (this.rightSprite.width / 150) * (this.app.screen.width / 5);
        this.sprite.height = (this.rightSprite.height / this.rightSprite.width) * this.sprite.width;

        // 轉向製作向左邊的圖
        this.leftSprite.scale.x *= -1;
        this.leftSprite.x = this.leftSprite.width;

        this.rightSprite.animationSpeed = this.animationSpeed;
        this.leftSprite.animationSpeed = this.animationSpeed;
        this.leftSprite.visible = false;


        this.sprite.x = this.app.screen.width / 2 - (this.sprite.width / 2);
        this.sprite.y = this.app.screen.height - this.sprite.height - 30;


        return this;
    }

    protected movingHandler(deltaTime: number): void {
        if (this.sprite.x + this.sprite.width > this.app.screen.width) {
            this.currentDirection = SuperManDirection.left;
        } else if (this.sprite.x < 0) {
            this.currentDirection = SuperManDirection.right;
        }

        switch (this.currentDirection) {
            case SuperManDirection.right:
                this.rightSprite.visible = true;
                this.leftSprite.visible = false;
                this.goRight();
                break;
            case SuperManDirection.left:
                this.rightSprite.visible = false;
                this.leftSprite.visible = true;
                this.goLeft();
                break;
        }
    }


    start(): void {
        this.rightSprite.play();
        this.leftSprite.play();
        this.app.ticker.add(this.movingHandler, this);
    }

    end(): void {
        this.rightSprite.stop();
        this.leftSprite.stop();
        this.app.ticker.remove(this.movingHandler, this);
    }

    goRight(): void {
        this.sprite.position.x += this.moveSpeed;
    }

    goLeft(): void {
        this.sprite.position.x -= this.moveSpeed;
    }

    turnDirection(): void {
        this.currentDirection = this.currentDirection === SuperManDirection.left ?
            SuperManDirection.right : SuperManDirection.left;
    }

}

export enum SuperManDirection {
    left = 1,

    right = 2
}