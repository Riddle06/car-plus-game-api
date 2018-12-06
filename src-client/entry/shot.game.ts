import { BasePage } from "./base.page";
import { ShotGame } from '../games/shot.game'

class ShotGamePage extends BasePage {
    private gameId: string
    private shotGame: ShotGame;

    async domEventBinding() {
        this.gameId = this.$('#hidden_game_id').val() as string;
        this.shotGame = await new ShotGame(window.innerWidth, window.innerHeight).init();

        this.shotGame.addEventListener('gameEnd', this.reportGameResult.bind(this));
    }

    async didMount() {
        this.toggleLoader(false);
    }

    async reportGameResult(): Promise<void> {
        this.toggleLoader(true);
        const { scores, gamePoints } = this.shotGame;
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

        window.location.href = `/shot-game/result/${ret.item.id}`;
    }
}

const shotGamePage = new ShotGamePage();
