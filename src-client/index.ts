
// import { Application, Sprite, } from "pixi.js";

// var app = new Application(800, 600, { backgroundColor: 0x1099bb });
// document.body.appendChild(app.view);

// // create a new Sprite from an image path
// var bunny = Sprite.from('/static/images/super-man.png');

// // center the sprite's anchor point
// bunny.anchor.set(0.5);

// // move the sprite to the center of the screen
// bunny.x = app.screen.width / 2;
// bunny.y = app.screen.height / 2;
// bunny.interactive = true;

// bunny.on('pointerdown', () => {
//     bunny.scale.x *= -1;

// })

// app.stage.addChild(bunny);


// Listen for animate update
// app.ticker.add(function (delta) {
//     // just for fun, let's rotate mr rabbit a little
//     // delta is 1 if running at 100% performance
//     // creates frame-independent transformation
//     bunny.rotation += 0.1 * delta;
// });


// const app = new Application(document.body.offsetWidth, 400);

// document.body.appendChild(app.view);

// loader.add('/static/images/llama/llama.json').load(function (loader, res) {

//     console.log(`loader , res`, loader, res)

//     const frames: Texture[] = [];

//     frames.push(Texture.fromFrame('llama0.png'));
//     frames.push(Texture.fromFrame('llama1.png'));
//     frames.push(Texture.fromFrame('llama2.png'));
//     frames.push(Texture.fromFrame('llama3.png'));
//     frames.push(Texture.fromFrame('llama4.png'));
//     frames.push(Texture.fromFrame('llama5.png'));


//     // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
//     const anim = new PIXI.extras.AnimatedSprite(frames);



//     /*
//      * An AnimatedSprite inherits all the properties of a PIXI sprite
//      * so you can change its position, its anchor, mask it, etc
//      */
//     anim.x = app.screen.width / 2;
//     anim.y = app.screen.height;
//     console.log(`anim.position`, anim.position)

//     // anim.anchor.set(0.5);
//     console.log(`anim.anchor`, anim.anchor)
//     anim.anchor.set(1);
//     anim.animationSpeed = 0.1;

//     anim.scale.set(2)

//     anim.play();

//     app.stage.addChild(anim);
//     const width = document.body.offsetWidth;
//     // Animate the rotation

//     gui.add(anim.scale, 'x')
//     gui.add(anim.scale, 'y')

//     gui.add(anim.position, 'x')
//     gui.add(anim.position, 'y').listen()

//     gui.add(anim, 'width')


//     let goRight: boolean = true;
//     let goLeft: boolean = false;
//     console.log(`body width`, width)
//     app.ticker.add(function () {

//         if (goRight) {
//             anim.position.x += 1

//             if (anim.position.x + anim.width > width) {
//                 anim.scale.x *= -1;
//                 goRight = false;
//                 goLeft = true;

//             }


//         }
//         // else if (goLeft) {
//         //     anim.position.x -= 5

//         //     if (0 > anim.position.x) {
//         //         anim.scale.x *= -1;
//         //         goRight = true;
//         //         goLeft = false;

//         //     }
//         // }



//         // if (width > anim.position.x) {
//         //     goRight = false;
//         // } else if (anim.position.x < 0) {
//         //     goRight = true
//         // }
//         // if (goRight) {
//         //     anim.position.x += 1
//         // } else {
//         //     anim.position.x -= 1
//         // }

//     });







// })

