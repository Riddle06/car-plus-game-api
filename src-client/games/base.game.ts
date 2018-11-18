import { Application, Texture, loader, Sprite } from "pixi.js";

interface LoaderResponse {
    llama: PIXI.extras.AnimatedSprite
}

interface BaseShape {
    x: number
    y: number
    width: number
    height: number
    halfWidth?: number
    halfHeight?: number
    centerX?: number
    centerY?: number
}
export abstract class BaseGame {
    protected isPlaying: Boolean = false; // 遊戲正在進行
    protected isGameEnd: Boolean = false; // 遊戲已結束
    protected application: Application = null


    protected screen: {
        width: number
        height: number
    } = null

    constructor(screenWidth: number, screenHeight: number) {
        this.screen = {
            width: screenWidth,
            height: screenHeight
        }
    }
    async init(): Promise<this> {
        this.application = new Application(this.screen.width, this.screen.height, {
            transparent: true
        })
        this.application.stage.interactive = true;

        await this.initElements()
        await this.initElementsEvents()
        await this.initElementsOffset()
        return this;
    }

    protected abstract async initElements(): Promise<boolean>
    protected abstract async initElementsOffset(): Promise<boolean>
    protected abstract async initElementsEvents(): Promise<boolean>

    initBgImage(path) {
        // 建立背景圖片
        const bg = Texture.fromImage(path);
        const background: Sprite = new Sprite(bg);
        background.width = this.application.screen.width;
        background.height = this.application.screen.height;
        this.application.stage.addChild(background);
    }
}

export function loaderHandler(path): Promise<LoaderResponse> {
    return new Promise<LoaderResponse>((resolve, reject) => {
        loader.add(path).load(function (loader, res) {
            resolve(res)
        })
    })
}

export function hitTestRectangle(r1: BaseShape, r2: BaseShape): boolean {

    //Calculate `centerX` and `centerY` properties on the sprites
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Calculate the `halfWidth` and `halfHeight` properties of the sprites
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Create a `collision` variable that will tell us
    //if a collision is occurring
    let collision = false;


    // console.log(`r1`, {
    //     x: r1.x,
    //     y: r1.y,
    //     width: r1.width,
    //     height: r1.height,
    //     halfWidth: r1.halfWidth,
    //     halfHeight: r1.halfHeight,
    //     centerX: r1.centerX,
    //     centerY: r1.centerY,
    // })
    // console.log(`r2`, {
    //     x: r2.x,
    //     y: r2.y,
    //     width: r2.width,
    //     height: r2.height,
    //     halfWidth: r2.halfWidth,
    //     halfHeight: r2.halfHeight,
    //     centerX: r2.centerX,
    //     centerY: r2.centerY,
    // })

    //Check whether the shapes of the sprites are overlapping. If they
    //are, set `collision` to `true`
    if (Math.abs(r1.centerX - r2.centerX) < r1.halfWidth + r2.halfWidth
        && Math.abs(r1.centerY - r2.centerY) < r1.halfHeight + r2.halfHeight) {
        collision = true;
    }

    //Return the value of `collision` back to the main program
    return collision;
};
