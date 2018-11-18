import { BaseGame, hitTestRectangle } from "../base.game";
import { Graphics, Text } from "pixi.js";
import { SuperMan, SuperManDirection } from './super-man';
import { FallItem } from './fall-item';
import * as moment from 'moment';
// import * as dat from "dat.gui";
// const gui = new dat.GUI();

export class CatchGame extends BaseGame {
    private superMan: SuperMan = null; // 超人
    private fallItems: PIXI.Graphics[] = []; // 掉落物陣列
    private gameTime: number = 10; // 遊戲時間
    private timeText: Text = null; // 時間顯示文字
    private now: moment.Moment = moment();


    protected async initElements(): Promise<boolean> {

        // 建立遊戲
        document.querySelector("#app-game").appendChild(this.application.view);
        // 建立超人
        this.superMan = await new SuperMan(this.application).init();
        // 插入倒數計時文字
        this.timeText = new Text('', {
            fontSize: 30,
        })
        this.timeText.x = 20;
        this.timeText.y = 20;
        this.application.stage.addChild(this.timeText);
        this.handleGameTimeText(); 

        return Promise.resolve(true);
    }
    protected initElementsOffset(): Promise<boolean> {
        return Promise.resolve(true);
    }
    protected initElementsEvents(): Promise<boolean> {
        // 點擊畫面開始遊戲
        document.addEventListener('pointerdown', this.play.bind(this));
        

        return Promise.resolve(true);
    }

    private async generateFallItemHandler(): Promise<void> {

        // 每次產生 0~3個掉落物
        const generateItems = Math.floor(Math.random() * 3);
        for (let i = 0; i < generateItems; i++) {
            const shape = await new FallItem(this.application).init();
            this.fallItems.push(shape);
            this.application.stage.addChild(shape)
        }

    }

    private checkGameTime() {
        if(this.gameTime <= 0) this.end();
    }

    private checkHitItem() {
        this.fallItems.filter(item => hitTestRectangle(this.superMan.sprite, item)).forEach(item => {
            // 檢查掉落物與超人是否碰撞，是 -> 隱藏+移除
            item.visible = false
            item.removeChild(item);
        })
        this.fallItems.filter(item => item.y > this.application.screen.height).forEach(item => {
            // 檢查掉落物是否掉出畫面了，是 -> 隱藏+移除
            item.visible = false
            item.removeChild(item);
        })

        this.fallItems = this.fallItems.filter(item => item.visible)
    }

    private handleGameTimeText() {
        // 顯示遊戲時間
        const mm: string = moment("1970-01-01T00:00").add(this.gameTime, "seconds").format("mm");
        const ss: string = moment("1970-01-01T00:00").add(this.gameTime, "seconds").format("ss");
        this.timeText.text = `${mm}:${ss}`;
        this.timeText.x = 20;
        this.timeText.y = 20;
    }

    private processing() {
        this.checkGameTime();
        this.checkHitItem();
        this.handleGameTimeText();

        if(Math.abs(this.now.diff(moment())) >= 1000) {
            // 每秒建立一次掉落物品
            this.generateFallItemHandler()
            this.gameTime -= 1; // 減少時間秒數
            this.handleGameTimeText(); 
            this.now = moment();
        }
    }

    play() {
        if (this.isPlaying || this.isGameEnd) return;

        this.isPlaying = true;
        this.now = moment();
        document.removeEventListener('pointerdown', this.play.bind(this));

        document.addEventListener('pointerdown', (e) => {
            // 點擊畫面事件
            console.log('[pointerdown]', e)
            this.superMan.turnDirection();
        });
        this.superMan.start(); // 超人開始移動
        this.application.ticker.add(this.processing, this); // 開始處理遊戲

    }

    end() {
        this.isGameEnd = true;
        this.superMan.end();
        this.application.ticker.remove(this.processing, this);
        this.fallItems.forEach(item => {
            item.visible = false;
            item.removeChild(item);
        });
    }
}
