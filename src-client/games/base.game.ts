import { Application, Texture, loader, Sprite, Text } from "pixi.js";
import * as pad from "pad-left";

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
    protected points: number = 0; // 獲得分數
    protected coins: number = 0; // 獲得的金幣
    protected pointsText: Text = null; // 分數文字
    protected coinsText: Text = null; // 金幣文字
    
    protected application: Application = null 
    protected stage: PIXI.Container = null; // 遊戲舞台
    protected effectContainer: PIXI.Container = null; // 特效使用的容器
    private dashboardContainer: PIXI.Container = null; // 儀表板用舞台

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
        this.setApplication();
        this.setStage();
        
        await this.initCommonImages(); // 載入共用圖片
        await this.initImages(); // 載入圖片
        await this.setDashboard(); // 建立計數計時文字
        await this.initElements()
        await this.initElementsEvents()
        await this.initElementsOffset()
        this.application.stage.addChild(this.effectContainer); // 放入特效容器
        this.application.stage.addChild(this.dashboardContainer); // 放入儀表板容器

        return this;
    }
    
    protected abstract async initImages(): Promise<void>
    protected abstract async initElements(): Promise<boolean>
    protected abstract async initElementsOffset(): Promise<boolean>
    protected abstract async initElementsEvents(): Promise<boolean>

    private setApplication() {
        this.application = new Application(this.screen.width, this.screen.height, {
            transparent: true
        })
        this.effectContainer = generateContainer(this.screen.width, this.screen.height); // 置放特效用的佈景容器
        document.body.appendChild(this.application.view)
    }
    
    private setStage() {
        const stage = new PIXI.Container()
        stage.width = this.screen.width;
        stage.height = this.screen.height;
        stage.x = 0;
        stage.y = 0;

        this.stage = stage

        this.application.stage.addChild(this.stage)
    }

    private async initCommonImages() {
        await loaderHandler('coin', '/static/images/item-coin.png');
        await loaderHandler('point', '/static/images/item-point.png');
    }

    private async setDashboard(): Promise<void> {
        this.dashboardContainer = new PIXI.Container();
        this.dashboardContainer.width = this.screen.width;
        this.dashboardContainer.height = this.screen.height;
        this.dashboardContainer.x = 0;
        this.dashboardContainer.y = 0;
        // 初始化點數跟金幣計數
        this.pointsText = await this.generateText('/static/images/item-points.png', 0, 95, 28, 15);
        this.coinsText = await this.generateText('/static/images/item-coins.png', 1, 95, 29, 13);
    }

    protected setBackground(): void {
        // 建立背景圖片
        const background = new Sprite(loader.resources['bg'].texture);
        background.width = this.screen.width;
        background.height = this.screen.height;
        this.stage.addChild(background);
    }

    protected async generateText(path: string, index: number, x: number, y: number, bgY: number): Promise<Text> {
        // 建立文字
        await loaderHandler(path, path);
        const bg = new Sprite(loader.resources[path].texture);
        const fullWidth = this.application.screen.width - 30;
        const textConfig = {
            fontSize: 32,
            fontFamily: "Arial Black",
            lineJoin: "bevel",
            fill: ['#ffffff'],
            stroke: '#000000',
            strokeThickness: 5,
        }

        const text = new Text(`0000`, textConfig);
        bg.addChild(text);
        text.position.set(x, y);

        bg.height = (bg.height / bg.width) * (fullWidth / 3);
        bg.width = (fullWidth / 3);
        bg.x = (fullWidth / 3) * index + 15;
        bg.y = bgY;

        this.dashboardContainer.addChild(bg);
        return text;
    }

    protected handleEffect(x: number, y: number, point: number = 0, coin: number = 0): void {
        // 特效處理
        let pointEffect: PIXI.Container = null;
        let coinEffect: PIXI.Container = null;
        
        if (point !== 0) {
            // 獲得的點數不等於 0 (加或減)
            pointEffect = this.generatePlusOrMinusEffect('point', x, y, point);
            this.effectContainer.addChild(pointEffect);
            this.application.ticker.add(this.effectTransition(pointEffect), this);

            if(coin !== 0) {
                // 獲得的硬幣不等於0
                coinEffect = this.generatePlusOrMinusEffect('coin', x, y, coin);
                this.effectContainer.addChild(coinEffect);
                coinEffect.y = coinEffect.y + pointEffect.height; // 硬幣顯示在點數下方
                this.application.ticker.add(this.effectTransition(coinEffect), this);
            }
        }
        
    }

    protected addPoint(point: number) {
        this.points += point;
        this.pointsText.text = pad(this.points, 4, '0')
    }

    protected addCoins(coin: number) {
        this.coins += coin;
        this.coinsText.text = pad(this.coins, 4, '0')
    }

    private generatePlusOrMinusEffect(name: string, x: number, y: number, num: number): PIXI.Container {
        const effect = new PIXI.Container(); // 特效容器
        const sprite = new PIXI.Sprite(PIXI.loader.resources[name].texture) // Icon
        const text = new PIXI.Text(`${num > 0 ? '+' : '-'}${Math.abs(num)}`, { // 加減數字
            fontSize: 32,
            fontFamily: "Arial Black",
            lineJoin: "bevel",
            fill: ['#ffffff'],
            stroke: '#000000',
            strokeThickness: 5,
        });
        effect.addChild(sprite);
        effect.addChild(text);
        text.x = sprite.width; // 文字的位置在Icon旁邊
        text.y = sprite.height / 2 - text.height / 2;
        effect.scale.x = .5;
        effect.scale.y = .5;
        effect.x = x;
        effect.y = y;

        return effect;
    }

    private effectTransition(effect: PIXI.Container): () => void {
        // 特效動畫 往上漂淡出
        function fun (): void {
            if(effect.alpha <= 0) {
                // 透明到看不到後就刪除ticker
                effect.visible = false;
                this.effectContainer.removeChild(effect);
                this.application.ticker.remove(fun, this)
                return;
            }
            // 漸漸變淡跟往上飄
            effect.alpha -= 0.01;
            effect.y -= 1;
        }
        return fun;
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