import { Application, Texture, loader, Sprite, Text } from "pixi.js";
import * as pad from "pad-left";
import { Sound } from 'pixi-sound';
import * as moment from "moment";

interface LoaderResponse {
    animatedSprite: PIXI.extras.AnimatedSprite
}

export interface GameConfig {
    screenWidth: number,
    screenHeight: number,
    superManSpriteFolderPath: string,
    usedScoreUp: Boolean,
    usedCoinUp: Boolean
}

export interface BaseShape {
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
    protected usedScoreUp: Boolean = false // 使用能量果實
    protected usedCoinUp: Boolean = false // 使用富翁果實

    public scores: number = 0; // 獲得分數
    public gamePoints: number = 0; // 獲得的超人幣

    protected scoresText: Text = null; // 分數文字
    protected gamePointsText: Text = null; // 金幣文字

    protected application: Application = null
    protected stage: PIXI.Container = null; // 遊戲舞台
    protected effectContainer: PIXI.Container = null; // 特效使用的容器
    protected tips: PIXI.Sprite = null; // 開始提示

    protected bgm: Sound = null; // 背景音樂
    protected boomSound: Sound = null; // 爆炸音效
    protected getSound: Sound = null; // 獲得道具音效
    protected failSound: Sound = null; // 失敗音效

    private dashboardContainer: PIXI.Container = null; // 儀表板用舞台

    private _eventListeners = {};

    protected screen: {
        width: number
        height: number
    } = null

    protected superManSpriteFolderPath: string;

    constructor(config: GameConfig) {
        this.screen = {
            width: config.screenWidth,
            height: config.screenHeight
        }
        this.superManSpriteFolderPath = config.superManSpriteFolderPath;
        this.usedScoreUp = config.usedScoreUp;
        this.usedCoinUp = config.usedCoinUp;
    }
    async init(): Promise<this> {
        this.setApplication();
        this.setStage();

        this.setGameSound(); // 載入音樂&音效
        await this.initCommonImages(); // 載入共用圖片
        await this.initImages(); // 載入圖片
        await this.setDashboard(); // 建立計數計時文字
        this.setStartTips();
        await this.initElements();
        this.application.stage.addChild(this.effectContainer); // 放入特效容器
        this.application.stage.addChild(this.dashboardContainer); // 放入儀表板容器
        await this.setUsedItemsEffect(); // 建立使用道具的效果

        await this.initElementsEvents();
        await this.initElementsOffset();

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

    private setGameSound(): void {
        this.bgm = Sound.from({
            url: '/static/audio/game-background-music.mp3',
            autoPlay: true,
            loop: true,
        });

        this.boomSound = Sound.from({
            url: '/static/audio/boom.mp3',
            preload: true,
        })
        this.getSound = Sound.from({
            url: '/static/audio/get.mp3',
            preload: true,
        })
        this.failSound = Sound.from({
            url: '/static/audio/fail.wav',
            preload: true,
        })
    }

    private async setUsedItemsEffect(): Promise<any> {
        if (!this.usedScoreUp && !this.usedCoinUp) {
            // 沒有使用道具
            return Promise.resolve();
        }
        if (this.usedScoreUp) {
            await loaderHandler('scoreup', '/static/images/scoreup/list.png');
            await loaderHandler('scoreup-effect', '/static/images/img_addition_score.png');
        }
        if (this.usedCoinUp) {
            await loaderHandler('coinup', '/static/images/coinup/list.png');
            await loaderHandler('coinup-effect', '/static/images/img_addition_coin.png');
        }

        let scoreupEffect: Sprite = null;
        let coinupEffect: Sprite = null;
        const dh = this.dashboardContainer.height;
        let i = 0;
        // 設置使用道具的特效
        if (this.usedScoreUp) {
            scoreupEffect = this.generateAdditionEffect(i, 'scoreup', 'scoreup-effect', dh);
            i++;
        }
        if (this.usedCoinUp) {
            coinupEffect = this.generateAdditionEffect(i, 'coinup', 'coinup-effect', dh);
        }

        const additionAnimation = (s: Sprite): Promise<void> => {
            return new Promise((resolve) => {
                let doneTime = null;
                const animation = () => {
                    if (s) {
                        const endX = this.application.screen.width / 2 - s.width / 2;
                        if (s.x < endX) {
                            s.x += 13;
                        } else if (!doneTime) {
                            doneTime = moment();
                        } else if (moment().subtract(1.5, 'second').isAfter(doneTime)) {
                            s.x += 13;
                            if (s.x >= this.application.screen.width) {
                                this.application.ticker.remove(animation, this);
                                resolve();
                            }
                        }
                    } else {
                        resolve();
                    }
                }
                this.application.ticker.add(animation, this);
            });
        }

        return Promise.all([additionAnimation(scoreupEffect), additionAnimation(coinupEffect)])

    }

    private async initCommonImages(): Promise<void> {
        await loaderHandler('score', '/static/images/item-point.png');
        await loaderHandler('gamePoint', '/static/images/item-coin.png');
        await loaderHandler('hourglass', '/static/images/item-hourglass.png');
        await loaderHandler('win', '/static/images/img-win.png');
        await loaderHandler('wow', '/static/images/img-wow.png');
    }

    private async setDashboard(): Promise<void> {
        this.dashboardContainer = new PIXI.Container();
        this.dashboardContainer.width = this.screen.width;
        this.dashboardContainer.height = this.screen.height;
        this.dashboardContainer.x = 0;
        this.dashboardContainer.y = 0;
        // 初始化點數跟金幣計數
        this.scoresText = await this.generateText('/static/images/item-points.png', 0, 95, 26, 15);
        this.gamePointsText = await this.generateText('/static/images/item-coins.png', 1, 95, 29, 13);
    }

    protected setBackground(): void {
        // 建立背景圖片
        const background = new Sprite(loader.resources['bg'].texture);
        background.width = this.screen.width;
        background.height = this.screen.height;
        this.stage.addChild(background);
    }

    protected setStartTips(): void {
        // 點擊開始遊戲的提示
        this.tips = new Sprite(loader.resources['tips'].texture);
        this.tips.height = (this.tips.height / this.tips.width) * (this.application.screen.width * 0.7);
        this.tips.width = (this.application.screen.width * 0.7);
        this.tips.x = this.application.screen.width / 2 - this.tips.width / 2;
        this.tips.y = this.application.screen.height / 2 - this.tips.height / 2;
        this.tips.visible = false;

        this.effectContainer.addChild(this.tips);
    }

    protected async generateText(path: string, index: number, x: number, y: number, bgY: number): Promise<Text> {
        // 建立文字
        await loaderHandler(path, path);
        const bg = new Sprite(loader.resources[path].texture);
        const fullWidth = this.application.screen.width - 30;
        const textConfig = {
            fontSize: 32,
            fontFamily: "Arial",
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

    protected generateAdditionEffect(index: number, iconName: string, additionName: string, dashboardHeight: number): Sprite {
        const s = new Sprite(loader.resources[iconName].texture);
        s.scale.x = .4;
        s.scale.y = .4;
        s.x = 15 + ((s.width + 5) * index);
        s.y = dashboardHeight + 15;
        this.dashboardContainer.addChild(s);

        const se = new Sprite(loader.resources[additionName].texture);
        se.height = (se.height / se.width) * (this.application.screen.width * 0.7);
        se.width = (this.application.screen.width * 0.7);
        se.x = -se.width;
        se.y = (this.application.screen.height / 2 - se.height / 2) - ((se.height + 5) * index);
        this.effectContainer.addChild(se);

        return se;
    }

    protected handleEffect(x: number, y: number, score: number = 0, gamePoint: number = 0, time: number = 0): void {
        // 特效處理
        let scoreEffect: PIXI.Container = null;

        if (score !== 0) {
            // 獲得的點數不等於 0 (加或減)
            scoreEffect = this.generatePlusOrMinusEffect('score', x, y, score);
            this.effectContainer.addChild(scoreEffect);
            this.application.ticker.add(this.effectTransition(scoreEffect), this);

            if (gamePoint !== 0) {
                let gamePointEffect: PIXI.Container = null;
                // 獲得的硬幣不等於0
                gamePointEffect = this.generatePlusOrMinusEffect('gamePoint', x, y, gamePoint);
                this.effectContainer.addChild(gamePointEffect);
                gamePointEffect.y = gamePointEffect.y + scoreEffect.height; // 硬幣顯示在點數下方
                this.application.ticker.add(this.effectTransition(gamePointEffect), this);
            }

            if (time !== 0) {
                let timeEffect: PIXI.Container = null;
                // 有減少時間
                timeEffect = this.generatePlusOrMinusEffect('hourglass', x, y, time);
                this.effectContainer.addChild(timeEffect);
                timeEffect.y = timeEffect.y + scoreEffect.height; // 顯示在點數下方
                this.application.ticker.add(this.effectTransition(timeEffect), this);
            }
        }
    }

    protected cheer(): void {
        const win = new PIXI.Sprite(PIXI.loader.resources['win'].texture);
        const wow = new PIXI.Sprite(PIXI.loader.resources['wow'].texture);

        win.scale = new PIXI.Point(.6, .6);
        wow.scale = new PIXI.Point(.6, .6);

        wow.x = 0 - wow.width;
        wow.y = this.application.screen.height / 2 - wow.height / 2;
        win.x = this.application.screen.width;
        win.y = this.application.screen.height / 2 - win.height / 2;

        this.effectContainer.addChild(win, wow);

        const wowTransition = () => {
            if (wow.alpha <= 0) {
                this.effectContainer.removeChild(wow);
                this.application.ticker.remove(wowTransition, this)
                return;
            }
            if (wow.x > 0) {
                wow.y -= 1;
                wow.alpha -= 0.01;
            } else {
                wow.x += 12;
            }
        }

        const winTransition = () => {
            if (win.alpha <= 0) {
                this.effectContainer.removeChild(win);
                this.application.ticker.remove(winTransition, this)
                return
            }
            if (win.x < this.application.screen.width - win.width) {
                win.y -= 1;
                win.alpha -= 0.01;
            } else {
                win.x -= 10;
            }
        }

        this.application.ticker.add(winTransition, this);
        this.application.ticker.add(wowTransition, this);
    }

    protected addScore(point: number): void {
        this.scores += point;
        this.scoresText.text = pad(this.scores, 4, '0')
    }

    protected addGamePoint(gamePoint: number): void {
        this.gamePoints += gamePoint;
        this.gamePointsText.text = pad(this.gamePoints, 4, '0')
    }

    private generatePlusOrMinusEffect(name: string, x: number, y: number, num: number): PIXI.Container {
        const effect = new PIXI.Container(); // 特效容器
        const sprite = new PIXI.Sprite(PIXI.loader.resources[name].texture) // Icon
        const text = new PIXI.Text(`${num > 0 ? '+' : '-'}${Math.abs(num)}`, { // 加減數字
            fontSize: 32,
            fontFamily: "Arial",
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
        function fun(): void {
            if (effect.alpha <= 0) {
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

    public addEventListener(type: string, handler: Function): void {
        const el = this._eventListeners;
        type = type.toLowerCase();

        if (!el.hasOwnProperty(type)) {
            el[type] = [];
        }

        if (el[type].indexOf(handler) == -1) {
            el[type].push(handler);
        }
    };

    dispatchEvent(type: string): void {
        const el = this._eventListeners;
        type = type.toLowerCase();

        if (!el.hasOwnProperty(type)) {
            return;
        }

        var len = el[type].length;

        for (var i = 0; i < len; i++) {
            el[type][i].call(this);
        }
    };
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