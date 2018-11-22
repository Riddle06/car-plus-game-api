import { BasePage } from "./base.page";
import { ShotGame } from '../games/shot.game'

class ShotGamePage extends BasePage {

    didMount() {
        new ShotGame(window.innerWidth, window.innerHeight).init();
    }
    domEventBinding() {

    }

}

const shotGamePage = new ShotGamePage();
