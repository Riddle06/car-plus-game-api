import { Application, loader, Texture, extras, glCore } from "pixi.js";
import * as PIXI from "pixi.js";
import * as dat from "dat.gui";
import { MemberLoginWebSvc } from "../web-services/member-login.web.svc";
const gui = new dat.GUI();

interface LoaderResponse {
    llama: PIXI.extras.AnimatedSprite
}
enum SuperManDirection {
    left = 1,
    right = 2
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
class CatchGameScene {
    private app: Application = null
    private superManMoveSpeed: number = 10
    // private superMan: PIXI.extras.AnimatedSprite = null
    private superMan: PIXI.Container = null
    private superManDirection: SuperManDirection = SuperManDirection.right;
    private fallItems: PIXI.Graphics[] = [];
    private fallSpeed: number = 3;
    private stage: PIXI.Graphics = null;
    // private testShape: PIXI.Graphics = null
    constructor() { }

    async init(): Promise<this> {
        const memberSvc = new MemberLoginWebSvc();
        // application 
        const height = window.innerHeight;
        const width = window.innerWidth;
        this.app = new Application(width, 400);

        this.stage = new PIXI.Graphics()
        this.stage.beginFill(0xaba8a8)
        this.stage.drawRect(0, 0, this.app.screen.width, this.app.screen.height)

        document.body.appendChild(this.app.view);

        // loader 
        const response = await this.loaderHandler()
        const superManTextures: Texture[] =
            ["llama1.png", "llama2.png", "llama3.png", "llama4.png", "llama5.png"]
                .map(x => Texture.fromFrame(x))
        // this.superMan = new PIXI.extras.AnimatedSprite(superManTextures)
        // set super man position and scale
        // this.superMan.anchor.x = 0.5
        // this.superMan.scale.set(2)
        // this.superMan.x = this.app.screen.width / 2;
        // this.superMan.y = this.app.screen.height - this.superMan.height;
        // this.superMan.animationSpeed = 0.2;
        // console.log(`this.superMan.height`, this.superMan.height)
        // this.superMan.play()


        const superMan = new PIXI.Graphics();
        superMan.beginFill(0Xfff000);
        superMan.drawRect(0, 0, 50, 50)
        superMan.endFill();
        superMan.width = 50
        superMan.height = 50
        superMan.x = this.app.screen.width / 2;
        superMan.y = this.app.screen.height - superMan.height;


        this.superMan = superMan;


        this.stage.addChild(this.superMan)
        // this.app.ticker.add(this.moveHandle.bind(this));
        // this.app.ticker.add(this.collisionHandler.bind(this))
        // this.app.ticker.add(this.fallHandler.bind(this))




        const shape = new PIXI.Graphics();
        const startOffsetX = this.stage.width - 50;
        shape.beginFill(0Xffa500);
        shape.drawRect(0, 0, 50, 50)
        shape.endFill();
        shape.x = startOffsetX;
        shape.y = this.stage.height - 50;
        shape.width = 50
        shape.height = 50

        this.fallItems.push(shape);
        this.stage.addChild(shape)


        // setInterval(() => {
        //     this.generateFallItemHandler()
        // }, 500);


        this.stage.interactive = true;

        this.stage.on('pointerdown', () => {
            // this.turnDirection();
        })

        document.addEventListener('keydown', (key) => {

            switch (key.which) {
                case 37:
                    this.goLeft();
                    break;
                case 39:
                    this.goRight();
                    break;
            }

            if (this.hitTestRectangle(this.superMan, shape)) {
                shape.visible = false
            }
        })

        this.app.stage.addChild(this.stage);
        return this;
    }

    private async loaderHandler(): Promise<LoaderResponse> {
        return new Promise<LoaderResponse>((resolve, reject) => {
            loader.add('/static/images/llama/llama.json').load(function (loader, res) {
                resolve(res)
            })
        })
    }

    private moveHandle(delta: number): void {

        // switch (this.superManDirection) {
        //     case SuperManDirection.left:
        //         this.goLeft();
        //         break;
        //     case SuperManDirection.right:
        //         this.goRight();
        //         break;
        // }
    }

    private turnDirection(): void {

        this.superManDirection = this.superManDirection === SuperManDirection.left ?
            SuperManDirection.right : SuperManDirection.left;
        this.superMan.scale.x *= -1;
    }

    private collisionHandler(): void {

        if (this.app.screen.width < this.superMan.x + (this.superMan.width / 2)) {

            this.turnDirection();
        } else if (this.superMan.x - (this.superMan.width / 2) < 0) {
            this.turnDirection();
        }
    }
    private goRight(): void {
        this.superMan.x += this.superManMoveSpeed;
    }

    private goLeft(): void {
        this.superMan.x -= this.superManMoveSpeed;
    }

    private generateFallItemHandler(): void {


        const generateItems = Math.floor(Math.random() * 3)

        for (let i = 0; i < generateItems; i++) {

            const shape = new PIXI.Graphics();
            const startOffsetX = (Math.ceil(Math.random() * 10000)) % this.app.screen.width + 1
            if ((Math.ceil((Math.random() * 1000)) % 2) === 1) {
                shape.beginFill(0Xffa500);
                shape.drawRect(0, 0, 50, 50)
                shape.endFill();
                shape.x = startOffsetX;
                shape.y = 0;
                shape.width = 50
                shape.height = 50

            } else {

            }

            this.fallItems.push(shape);
            this.stage.addChild(shape)
        }


    }

    private fallHandler(delta: number): void {

        this.fallItems.forEach(item => item.y += this.fallSpeed);

        this.fallItems.filter(item => this.hitTestRectangle(this.superMan, item)).forEach(item => {
            item.visible = false
            item.removeChild(item);
        })

        this.fallItems.filter(item => item.y > this.app.screen.height).forEach(item => {
            this.stage.removeChild(item);
        })
        this.fallItems = this.fallItems.filter(item => item.y <= this.app.screen.height)
    }


    private hitTestRectangle(r1: BaseShape, r2: BaseShape): boolean {

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



        console.log(`r1`, {
            x: r1.x,
            y: r1.y,
            width: r1.width,
            height: r1.height,
            halfWidth: r1.halfWidth,
            halfHeight: r1.halfHeight,
            centerX: r1.centerX,
            centerY: r1.centerY,
        })
        console.log(`r2`, {
            x: r2.x,
            y: r2.y,
            width: r2.width,
            height: r2.height,
            halfWidth: r2.halfWidth,
            halfHeight: r2.halfHeight,
            centerX: r2.centerX,
            centerY: r2.centerY,
        })

        //Check whether the shapes of the sprites are overlapping. If they
        //are, set `collision` to `true`
        if (Math.abs(r1.centerX - r2.centerX) < r1.halfWidth + r2.halfWidth
            && Math.abs(r1.centerY - r2.centerY) < r1.halfHeight + r2.halfHeight) {
            collision = true;
        }

        //Return the value of `collision` back to the main program
        return collision;
    };

}

const catchGameScene = new CatchGameScene().init()

