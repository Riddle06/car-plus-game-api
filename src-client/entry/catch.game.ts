import { CatchGame } from '../games/catch.game';
import { BasePage } from "./base.page";

class CatchGamePage extends BasePage {
    didMount() {
        new CatchGame(window.innerWidth, window.innerHeight).init();
    }
    domEventBinding() {

    }
}

new CatchGamePage();
