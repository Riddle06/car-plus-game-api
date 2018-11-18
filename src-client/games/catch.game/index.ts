import { BaseGame, hitTestRectangle } from "../base.game";
import { Graphics } from "pixi.js";
import { SuperMan, SuperManDirection } from './super-man';
import { FallItem } from './fall-item';
// import * as dat from "dat.gui";
// const gui = new dat.GUI();

export class CatchGame extends BaseGame {
    private superMan: SuperMan = null;
    private fallItems: PIXI.Graphics[] = [];

    protected async initElements(): Promise<boolean> {

        // 建立遊戲
        document.querySelector("#app-game").appendChild(this.application.view);
        // 建立超人
        this.superMan = await new SuperMan(this.application).init();
        // 建立掉落物品
        setInterval(() => {
            // 每秒建立一次
            this.generateFallItemHandler()
        }, 1000);
        
        return Promise.resolve(true);
    }
    protected initElementsOffset(): Promise<boolean> {
        return Promise.resolve(true);
    }
    protected initElementsEvents(): Promise<boolean> {
        
        document.addEventListener('pointerdown', (e) => {
            // 點擊畫面事件
            console.log('[pointerdown]', e)
            this.superMan.turnDirection();
        });

        this.application.ticker.add(this.handleHitItem.bind(this));

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

    private handleHitItem() {
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
}