import { Application, Texture, loader, Sprite, Text } from "pixi.js";

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
    protected points: number = 0; // 獲得分數
    protected coins: number = 0; // 獲得的金幣
    protected pointsText: Text = null; // 分數文字
    protected coinsText: Text = null; // 金幣文字

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

        await loaderHandler('win', '/static/images/img-win.png');
        await loaderHandler('wow', '/static/images/img-wow.png');
        await loaderHandler('coin', '/static/images/item-coin.png');
        await loaderHandler('point', '/static/images/item-point.png');
        
        await this.initElements()
        await this.initElementsEvents()
        await this.initElementsOffset()
        return this;
    }

    protected abstract async initElements(): Promise<boolean>
    protected abstract async initElementsOffset(): Promise<boolean>
    protected abstract async initElementsEvents(): Promise<boolean>

    protected initBgImage(path) {
        // 建立背景圖片
        const bg = Texture.fromImage(path);
        const background: Sprite = new Sprite(bg);
        background.width = this.application.screen.width;
        background.height = this.application.screen.height;
        this.application.stage.addChild(background);
    }

    protected async generatePointsAndCoinsCount() {
        // 初始化計時文字
        this.pointsText = await this.generateText('/static/images/item-points.png', 0, 95, 28, 15);
        this.coinsText = await this.generateText('/static/images/item-coins.png', 1, 95, 29, 13);

    }

    protected async generateText(path: string, index: number, x: number, y:number, bgY: number): Promise<Text> {
        // 建立文字
        await loaderHandler(path, path);
        const bg = new Sprite(loader.resources[path].texture);
        const fullWidth = this.application.screen.width - 30;
        const textConfig = {
            fill: 'white',
            fontSize: 32,
            fontFamily: "Arial Black",
            lineJoin: "bevel",
            stroke: "black",
            strokeThickness: 4
        }
    
        const text = new Text(`0000`, textConfig);
        bg.addChild(text);
        text.position.set(x, y);
    
        bg.height = (bg.height / bg.width) * (fullWidth / 3);
        bg.width = (fullWidth / 3);
        bg.x = (fullWidth / 3) * index + 15;
        bg.y = bgY;
        
        this.application.stage.addChild(bg);
        return text;
    }

    protected handleEffect(): void {
        // 特效處理

    }
}

export function loaderHandler(name, path): Promise<LoaderResponse> {
    return new Promise<LoaderResponse>((resolve, reject) => {
        loader.add(name, path).load(function (loader, res) {
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

export function generateContainer(width, height): PIXI.Container {
    const container = new PIXI.Container();
    container.width = width;
    container.height = height;
    return container;
} 