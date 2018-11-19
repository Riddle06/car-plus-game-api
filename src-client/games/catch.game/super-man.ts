import * as PIXI from "pixi.js";
import { loaderHandler } from '../base.game';
export class SuperMan {
    private initPosition: {
        x: number
        y: number
    } = null
    private moveSpeed: number = 3
    private app: PIXI.Application = null
    private currentDirection: SuperManDirection = SuperManDirection.right;
    
    public sprite: PIXI.Graphics = null;
    public superManLeft: PIXI.Sprite = null
    public superManRight: PIXI.Sprite = null
    
    constructor(app: PIXI.Application) {
        this.app = app;
    }

    async init(): Promise<this> {
        // const loderRes = await loaderHandler('/static/images/llama/llama.json');
        // const superManTextures: PIXI.Texture[] =
        //     ["llama1.png", "llama2.png", "llama3.png", "llama4.png", "llama5.png"]
        //         .map(x => PIXI.Texture.fromFrame(x))
        await loaderHandler('super-man-left', '/static/images/img-superman-left.png');
        await loaderHandler('super-man-right', '/static/images/img-superman-right.png');

        this.superManLeft = new PIXI.Sprite(PIXI.loader.resources['super-man-left'].texture);
        this.superManRight = new PIXI.Sprite(PIXI.loader.resources['super-man-right'].texture);
        this.superManLeft.visible = false;

        this.sprite = new PIXI.Graphics();
        this.sprite.addChild(this.superManLeft);
        this.sprite.addChild(this.superManRight);
        this.sprite.height = (this.sprite.height / this.sprite.width) * (this.app.screen.width / 5);
        this.sprite.width = this.app.screen.width / 5;
        this.sprite.x = this.app.screen.width / 2 - (this.sprite.width / 2);
        this.sprite.y = this.app.screen.height - this.sprite.height - 30;
        // this.sprite.animationSpeed = 0.1;
        
        
        this.app.stage.addChild(this.sprite)

        return this;
    }

    protected movingHandler(deltaTime: number): void {
        if (this.sprite.x + this.sprite.width  > this.app.screen.width) {
            this.currentDirection = SuperManDirection.left;
            // this.sprite.scale.x *= -1;
        } else if (this.sprite.x < 0) {
            this.currentDirection = SuperManDirection.right;
            // this.sprite.scale.x *= -1;
        }

        switch (this.currentDirection) {
            case SuperManDirection.right:
                this.superManLeft.visible = false;
                this.superManRight.visible = true;
                this.goRight();
                break;
            case SuperManDirection.left:
                this.superManLeft.visible = true;
                this.superManRight.visible = false;
                this.goLeft();
                break;
        }
    }


    start() {
        // this.sprite.play();
        this.app.ticker.add(this.movingHandler, this);
    }

    end() {
        // this.sprite.stop();
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
        // this.sprite.scale.x *= -1;
    }

}

export enum SuperManDirection {
    left = 1,

    right = 2
}