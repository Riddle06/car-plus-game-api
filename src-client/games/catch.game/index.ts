import { BaseGame, hitTestRectangle, loaderHandler, generateContainer } from "../base.game";
import { Graphics, Text, Texture, Sprite, loader } from "pixi.js";
import { SuperMan, SuperManDirection } from './super-man';
import { FallItem } from './fall-item';
import * as moment from 'moment';

// import * as dat from "dat.gui";
// const gui = new dat.GUI();

export class CatchGame extends BaseGame {
    private superMan: SuperMan = null; // 超人
    private fallItems: FallItem[] = []; // 掉落物陣列
    private fallItemsContainer: PIXI.Container = null;
    private gameTime: number = 60; // 遊戲時間
    private timeText: Text = null; // 時間顯示文字
    private now: moment.Moment = moment(); // 計算時間用


    protected async initImages(): Promise<void> {
        await loaderHandler('bg', '/static/images/bg.catch.jpg');

        this.setBackground();  // 放上背景
    }

    protected async initElements(): Promise<boolean> {
        // 建立掉落物用的容器
        this.fallItemsContainer = generateContainer(this.application.screen.width, this.application.screen.height);
        this.stage.addChild(this.fallItemsContainer);
        // 建立超人
        this.superMan = await new SuperMan(this.application).init();
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
                const fallitem = await new FallItem(this.application).init(index);
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
            // 檢查掉落物與超人是否碰撞，是 -> 隱藏+移除
            item.sprite.visible = false
            item.sprite.removeChild(item.sprite);

            // 增加點數 & 金幣
            const { x, y } = this.superMan.sprite;
            let coin = 0;
            // 接到炸彈 隨機扣 1~5秒
            let time = item.point < 0 ? -Math.floor(Math.random() * 6) : 0;

            if (item.point > 0) {
                // 有獲得點數才有機會獲得硬幣 & 一場最多不拿超過35個
                if (this.coins < 35) { // && !Math.floor(Math.random() * 2)
                    coin = Math.floor(Math.random() * 2);
                }
                if (Math.floor(Math.random() * 3) === 2) {
                    this.cheer();
                }
            }

            this.addPoint(item.point);
            this.addCoins(coin);

            this.gameTime += time;
            this.handleEffect(x, y, item.point, coin, time);
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
        if (this.isPlaying || this.isGameEnd) return;

        this.isPlaying = true;
        this.now = moment();

        this.application.stage.off('touchstart', this.play, this);

        this.application.stage.on('touchstart', (e) => {
            // 點擊畫面事件
            console.log('[touchstart]', e)
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
    }
}