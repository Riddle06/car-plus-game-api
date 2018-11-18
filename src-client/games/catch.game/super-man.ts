import * as PIXI from "pixi.js";
import { loaderHandler } from '../base.game';
export class SuperMan {
    private initPosition: {
        x: number
        y: number
    } = null
    private moveSpeed: number = 3
    private app: PIXI.Application = null
    private currentDirection: SuperManDirection = SuperManDirection.right
    
    public sprite: PIXI.extras.AnimatedSprite = null;
    
    constructor(app: PIXI.Application) {
        this.app = app;
    }

    async init(): Promise<this> {
        const loderRes = await loaderHandler('/static/images/llama/llama.json');
        const superManTextures: PIXI.Texture[] =
            ["llama1.png", "llama2.png", "llama3.png", "llama4.png", "llama5.png"]
                .map(x => PIXI.Texture.fromFrame(x))

        this.sprite = new PIXI.extras.AnimatedSprite(superManTextures);
        this.sprite.scale.x = 2;
        this.sprite.scale.y = 2;
        this.sprite.x = this.app.screen.width / 2;
        this.sprite.y = this.app.screen.height - this.sprite.height;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
        
        this.app.stage.addChild(this.sprite)
        this.app.ticker.add(this.movingHandler.bind(this))
        this.app.ticker.add(this.flipDirectionHandler.bind(this))
        return this;
    }

    protected movingHandler(deltaTime: number): void {
        switch (this.currentDirection) {
            case SuperManDirection.right:
                this.goRight();
                break;
            case SuperManDirection.left:
                this.goLeft();
                break;
        }
    }

    protected flipDirectionHandler(): void {
        if (this.sprite.x + this.sprite.width  > this.app.screen.width) {
            this.currentDirection = SuperManDirection.left;
            // this.sprite.scale.x *= -1;
        } else if (this.sprite.x < 0) {
            this.currentDirection = SuperManDirection.right;
            // this.sprite.scale.x *= -1;
        }
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