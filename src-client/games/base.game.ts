import { Application } from "pixi.js";

export abstract class BaseGame {
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
        this.application = new Application(this.screen.width, this.screen.height)
        document.body.appendChild(this.application.view);
        await this.initElements()
        await this.initElementsEvents()
        await this.initElementsOffset()
        return this;

    }

    protected abstract async initElements(): Promise<boolean>
    protected abstract async initElementsOffset(): Promise<boolean>
    protected abstract async initElementsEvents(): Promise<boolean>
}

