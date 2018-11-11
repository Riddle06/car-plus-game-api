import { Container } from 'pixi.js';
import { Graphics, Sprite } from 'pixi.js';
import { BaseGamePage } from "./base.game.page";
import * as dat from "dat.gui";
const gui = new dat.GUI();

class ShotGamePage extends BaseGamePage {

    private superMan: Container = null
    private cannon: Container = null
    private shell: Container = null
    private shellInitPosition: {
        x: number
        y: number
    }
    private currentDegree: number = 0

    // 是否為順時針
    private isClockwiseDirection: boolean = false

    private isRotating: boolean = false

    private readonly degreeConfig = {
        max: 90,
        min: 1
    }


    async stageDidMount() {
        // set cannon

        const cannon = new Graphics();
        cannon.beginFill(0Xfff000);
        cannon.drawRect(0, 0, 100, 30)
        cannon.endFill();
        cannon.width = 100;
        cannon.height = 30;
        cannon.x = 30;
        cannon.y = this.app.screen.height - cannon.height;
        // cannon.rotation = -90 * (Math.PI / 180); // 角度轉弧度
        cannon.pivot.y = 15

        this.cannon = cannon;


        gui.add(cannon, 'rotation');

        this.app.ticker.add(() => {
            this.rotationHandler()
        })

        this.app.stage.interactive = true;
        this.app.stage.interactiveChildren = true;
        this.app.stage.on('touchstart', () => {
            console.log(`touchstart`)
            this.isRotating = true;
        })

        this.app.stage.on('touchend', () => {
            console.log(`touchend`)
            this.isRotating = false
        })




        const shell = new Graphics();
        shell.beginFill(0Xff0000);
        shell.drawRect(0, 0, 20, 20)
        shell.endFill();
        shell.width = 20;
        shell.height = 20;
        // shell.x = this.cannon.x + this.cannon.width + 5;
        shell.x = this.cannon.width + 5;
        shell.y = this.cannon.height / 2
        // shell.y = this.cannon.y;
        // cannon.rotation = -90 * (Math.PI / 180); // 
        shell.pivot.y = 10
        shell.pivot.x = 10
        this.shellInitPosition = {
            x: shell.x,
            y: shell.y,
        }
        this.shell = shell

        cannon.addChild(shell)
        this.stage.addChild(cannon);
    }

    async rotationHandler() {

        if (!this.isRotating) return;

        if (this.currentDegree >= this.degreeConfig.max) {
            this.isClockwiseDirection = true
        } else if (this.currentDegree <= this.degreeConfig.min) {
            this.isClockwiseDirection = false
        }

        if (this.isClockwiseDirection) {
            this.cannon.rotation += 0.01
        } else {
            this.cannon.rotation -= 0.01
        }

        this.currentDegree = Math.abs(this.cannon.rotation / (Math.PI / 180))

        console.log("this.currentDegree", this.currentDegree)


        // this.shell.x = this.shellInitPosition.x - (this.shellInitPosition.x *

        //     Math.sin((this.currentDegree * (Math.PI / 180)))
        // );

        // this.shell.x = 
        // (this.cannon.x * (
        //     this.currentDegree * (Math.PI / 180))) + 
        // this.shellInitPosition.x - (
        //     this.shellInitPosition.x * Math.sin(this.currentDegree * (Math.PI / 180)));





        // console.log(`this.shellInitPosition.x`, this.shellInitPosition.x)
        // console.log(`Math.sin((this.currentDegree * (Math.PI / 180))`, Math.sin((this.currentDegree * (Math.PI / 180))))

        // console.log(`this.shell.x`, this.shell.x)

        // this.shell.y = this.x

    }



}

const shotGamePage = new ShotGamePage();
