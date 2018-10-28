import * as PIXI from "pixi.js";
export class SuperMan {
    private initPosition: {
        x: number
        y: number
    } = null
    private moveSpeed: number = 1
    private sprite: PIXI.extras.AnimatedSprite = null;
    private app: PIXI.Application = null

    private currentDirection: SuperManDirection = SuperManDirection.right
    constructor(app: PIXI.Application) {
        this.app = app;
    }

    async init(): Promise<this> {
        this.app.ticker.add(this.movingHandler)
        this.app.ticker.add(this.flipDirectionHandler)
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
        
        if (this.sprite.x + (this.sprite.width / 2) > this.app.screen.width) {
            this.currentDirection = SuperManDirection.left;
            this.sprite.scale.x *= -1;
        } else if (this.sprite.x < 0) {
            this.currentDirection = SuperManDirection.right;
            this.sprite.scale.x *= -1;
        }


    }

    goRight(): void {
        this.sprite.position.x += this.moveSpeed;
    }

    goLeft(): void {
        this.sprite.position.x -= this.moveSpeed;
    }

}

export enum SuperManDirection {
    left = 1,

    right = 2
}