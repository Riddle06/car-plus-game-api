import { BasePage } from "./base.page";

class GameResultPage extends BasePage {
    private gameId: string

    domEventBinding() {
        this.gameId = this.$('#hidden_game_id').val() as string;
    } 
    didMount() {
        this.getGameResult();
    }

    async getGameResult(): Promise<void> {
        const ret = await this.webSvc.game.getGameHistory(this.gameId);
        console.log(ret)

        this.toggleLoader(false);
    }
}

const gameResultPage = new GameResultPage();
