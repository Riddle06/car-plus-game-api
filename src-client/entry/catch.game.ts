import { CatchGame } from '../games/catch.game';
import { BasePage } from "./base.page";

class CatchGamePage extends BasePage {
    private gameId: string
    private catchGame: CatchGame = null;

    async domEventBinding() {
        this.gameId = this.$('#hidden_game_id').val() as string;
        this.catchGame = await new CatchGame(window.innerWidth, window.innerHeight).init();

        this.catchGame.addEventListener('gameEnd', this.reportGameResult.bind(this));
    }
    didMount() {
        this.toggleLoader(false);
    }

    async reportGameResult(): Promise<void> {
        this.toggleLoader(true);
        const { scores, gamePoints } = this.catchGame;
        const ret = await this.webSvc.game.reportGame(this.gameId, {
            gameHistoryId: this.gameId,
            scoreEncryptString: btoa(btoa(scores.toString())),
            gamePintEncryptString: btoa(btoa(gamePoints.toString()))
        })

        if (!ret.success) {
            this.fakeAlert({
                title: 'Oops',
                text: ret.message
            });
            return;
        }

        window.location.replace(`/catch-game/result/${ret.item.id}`);
    }

}

new CatchGamePage();
