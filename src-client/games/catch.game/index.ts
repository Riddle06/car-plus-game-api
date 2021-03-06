import { BaseGame, hitTestRectangle, loaderHandler, generateContainer, GameConfig } from "../base.game";
import { Text } from "pixi.js";
import { SuperMan } from './super-man';
import { FallItem, FallItemType } from './fall-item';
import * as moment from 'moment';

// import * as dat from "dat.gui";
// const gui = new dat.GUI();

export interface CatchGameConfig extends GameConfig {
    parameters: CatchGameParameters
}

export interface CatchGameParameters {
    fallSpeed: number
    gameTime: number
    lessTime: number
    moveSpeed: number
    types: FallItemType[]
    maxGamePoint: number
}


export class CatchGame extends BaseGame {
    private superMan: SuperMan = null; // 超人
    private fallItems: FallItem[] = []; // 掉落物陣列
    private fallItemsContainer: PIXI.Container = null;
    private gameTime: number; // 遊戲時間
    private timeText: Text = null; // 時間顯示文字
    private now: moment.Moment = moment(); // 計算時間用
    private parameters: CatchGameParameters;

    constructor(config: CatchGameConfig) {
        super(config);
        this.parameters = config.parameters;
        this.gameTime = this.parameters.gameTime;
    }


    protected async initImages(): Promise<void> {
        await loaderHandler('bg', '/static/images/bg.catch.jpg');
        await loaderHandler('tips', '/static/images/img-tips.png');

        this.setBackground();  // 放上背景
    }

    protected async initElements(): Promise<boolean> {
        // 建立掉落物用的容器
        this.fallItemsContainer = generateContainer(this.application.screen.width, this.application.screen.height);
        this.stage.addChild(this.fallItemsContainer);
        // 建立超人
        this.superMan = await new SuperMan(this.application, this.parameters, this.superManSpriteFolderPath).init();
        this.stage.addChild(this.superMan.sprite);
        // 建立計時器
        await this.setGameTime();

        this.application.stage.interactive = true;
        return Promise.resolve(true);
    }
    protected initElementsOffset(): Promise<boolean> {
        return Promise.resolve(true);
    }
    protected initElementsEvents(): Promise<boolean> {
        // 點擊畫面開始遊戲
        this.tips.visible = true;
        this.application.stage.on('touchstart', this.play, this);


        return Promise.resolve(true);
    }

    private async setGameTime(): Promise<void> {
        // 初始化計時文字
        this.timeText = await this.generateText('/static/images/item-time.png', 2, 87, 28, 15);
        this.handleGameTimeText();
    }

    private async generateFallItemHandler(): Promise<void> {
        const posArr = [0, 0, 0, 0, 0];
        // 每次產生 0~3 個掉落物
        const generateItems = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < generateItems; i++) {
            let index = Math.floor(Math.random() * 5);
            while (posArr[index] === 1) {
                index = Math.floor(Math.random() * 5);
            }
            posArr[index] = 1;

            if ((Math.ceil((Math.random() * 1000)) % 2) === 1) {
                const fallitem = await new FallItem(this.application, this.parameters).init(index);
                this.fallItems.push(fallitem);
                this.fallItemsContainer.addChild(fallitem.sprite)
            }
        }

    }

    private checkGameTime(): void {
        // 時間到，遊戲結束
        if (this.gameTime <= 0) this.end();
    }

    private checkHitItem(): void {
        this.fallItems.filter(item => hitTestRectangle(this.superMan.sprite, item.sprite)).forEach(item => {
            
            // 如果掉落高度大於超人身高就不算   
            if (item.sprite.y > this.superMan.sprite.y + (this.superMan.sprite.height / 2)) {
                return;
            }

            if (item.score > 0) {
                // 接到禮物音效
                this.getSound.play();
            } else {
                // this.boomSound.play();
            }

            // 檢查掉落物與超人是否碰撞，是 -> 隱藏+移除
            item.sprite.visible = false
            item.sprite.removeChild(item.sprite);

            // 增加點數 & 金幣
            const { x, y } = this.superMan.sprite;
            
            // 隨機獲得超人幣的範圍
            const { min, max } = item.gamePoint;
            let gamePoint = 0;
            
            // 接到炸彈 隨機扣 0~5秒
            let time = item.score < 0 ? -Math.floor(Math.random() * (this.parameters.lessTime + 1)) : 0;

            if (item.score > 0) {
                // 有獲得點數才有機會獲得硬幣 & 一場最多不拿超過 {maxGamePoint} 個
                if (this.gamePoints < this.parameters.maxGamePoint) { // && !Math.floor(Math.random() * 2)
                    gamePoint = Math.floor(Math.random() * (max - min + 1)) + min;
                }
                if (Math.floor(Math.random() * 3) === 2) {
                    this.cheer();
                }
            }

            this.addScore(item.score);
            this.addGamePoint(gamePoint);

            this.gameTime += time;
            this.handleEffect(x, y, item.score, gamePoint, time);
        })
        this.fallItems.filter(item => item.sprite.y > this.application.screen.height).forEach(item => {
            // 檢查掉落物是否掉出畫面了，是 -> 隱藏+移除
            item.sprite.visible = false
            item.sprite.removeChild(item.sprite);
        })

        this.fallItems = this.fallItems.filter(item => item.sprite.visible)
    }

    private handleGameTimeText(): void {
        // 顯示遊戲時間
        const mm: string = moment("1970-01-01T00:00").add(this.gameTime, "seconds").format("mm");
        const ss: string = moment("1970-01-01T00:00").add(this.gameTime, "seconds").format("ss");
        this.timeText.text = `${mm}:${ss}`;
    }

    private processing(): void {
        // 處理進行中遊戲
        this.checkGameTime();
        this.checkHitItem();

        if (Math.abs(this.now.diff(moment())) >= 1000) {
            // 每秒建立一次掉落物品
            this.generateFallItemHandler()
            this.gameTime -= 1; // 減少時間秒數
            this.now = moment();
        }

        this.handleGameTimeText();  // 更新儀表板的時間
    }

    play(): void {
       
        if (!this.bgm.isPlaying) {
            this.bgm.play();
        }

        this.tips.visible = false;
        if (this.isPlaying || this.isGameEnd) return;

        this.isPlaying = true;
        this.now = moment();

        this.application.stage.off('touchstart', this.play, this);

        this.application.stage.on('touchstart', (e) => {
            // 點擊畫面事件
            // console.log('[touchstart]', e)
            this.superMan.turnDirection();
        });
        this.superMan.start(); // 超人開始移動
        this.generateFallItemHandler(); // 建立第一批掉落物
        this.application.ticker.add(this.processing, this); // 開始處理遊戲

    }

    end(): void {
        this.isGameEnd = true; // 結束遊戲
        this.superMan.end(); // 超人停止
        this.application.ticker.remove(this.processing, this); // 移除處理ticker
        this.fallItems.forEach(item => {
            // 移除所有落下物件
            item.sprite.visible = false;
            item.sprite.removeChild(item.sprite);
        });
        this.dispatchEvent('gameEnd');
    }
}