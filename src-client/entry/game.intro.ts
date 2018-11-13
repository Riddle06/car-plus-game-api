import { BasePage } from "./base.page";

class GameIntroPage extends BasePage {
    private gameCode: string = null
    didMount() {
        this.gameCode = this.$('#hidden_game_code').val() as string  
    }
    domEventBinding() {
        
    }

}

const gameIntroPage = new GameIntroPage();
