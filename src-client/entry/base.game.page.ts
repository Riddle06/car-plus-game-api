import { Application, Container, Graphics, TextStyle, Text } from "pixi.js";
import { BasePage } from "./base.page";
import * as  pad from "pad-left";

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

export abstract class BaseGamePage extends BasePage {
    protected app: Application = null;
    protected stage: Container = null;
    protected background: Graphics = null
    protected screenSize: {
        width: number
        height: number
    } = window.screen;

    protected text: {
        score: Text
        point: Text
        minute?: Text
    }

    protected currentScore: number = 0
    protected currentPoint: number = 0


    didMount() { }
    domEventBinding() { }

    abstract stageDidMount()

    constructor() {
        super();
        this.init();
    }
    protected async init() {
        await this.setApplication();
        await this.setStage();
        await this.setScoreAndPoint();
        await this.stageDidMount();
    }

    protected setApplication() {
        this.app = new Application(this.screenSize.width, this.screenSize.height)
        document.body.appendChild(this.app.view)
    }
    protected setStage() {
        const stage = new Graphics()
        stage.beginFill(0x1099bb);
        stage.drawRect(0, 0, this.screenSize.width, this.screenSize.height)
        stage.endFill();
        stage.x = 0;
        stage.y = 0;

        this.stage = stage

        this.app.stage.addChild(this.stage)
    }

    protected setScoreAndPoint() {
        const gridWidth = this.screenSize.width / 3
        // 設定 分數，金幣的區塊
        const scoreContainer = new Container()
        scoreContainer.x = 0

        const pointContainer = new Container();
        pointContainer.x = gridWidth;


        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: ['#ffffff'],
            stroke: '#000000',
            strokeThickness: 5,

        })

        // 設定 分數
        const scoreText = new Text('0000', textStyle)
        scoreContainer.addChild(scoreText)

        // 設定 金幣
        const pointText = new Text('0000', textStyle)
        pointContainer.addChild(pointText)


        this.stage.addChild(scoreContainer, pointContainer)


        this.text = {
            point: pointText,
            score: scoreText
        }

        console.log(`pointText`, pointText.width)
        console.log(`pointContainer`, pointContainer.width)
    }

    protected addPoint(point: number) {
        this.currentPoint += point;
        this.text.point.text = pad(this.currentPoint, 4, '0')
    }

    protected addScore(score: number) {
        this.currentScore += score;

        this.text.score.text = pad(this.currentScore, 4, '0')
    }

    // 兩個物件的是否碰撞
    protected hitTestRectangle(r1: BaseShape, r2: BaseShape): boolean {

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
        //     x: r1.x, y: r1.y, width: r1.width, height: r1.height,
        //     halfWidth: r1.halfWidth, halfHeight: r1.halfHeight, centerX: r1.centerX, centerY: r1.centerY,
        // })
        // console.log(`r2`, {
        //     x: r2.x, y: r2.y, width: r2.width, height: r2.height,
        //     halfWidth: r2.halfWidth, halfHeight: r2.halfHeight, centerX: r2.centerX, centerY: r2.centerY,
        // })

        if (Math.abs(r1.centerX - r2.centerX) < r1.halfWidth + r2.halfWidth
            && Math.abs(r1.centerY - r2.centerY) < r1.halfHeight + r2.halfHeight) {
            collision = true;
        }

        //Return the value of `collision` back to the main program
        return collision;
    };
}