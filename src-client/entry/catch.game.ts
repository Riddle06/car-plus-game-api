import { CatchGame } from '../games/catch.game';
import { BasePage } from "./base.page";
import { GameCode } from "@view-models/game.vm";

class CatchGamePage extends BasePage {
    private gameId: string
    private catchGame: CatchGame = null;

    async domEventBinding() {
        this.gameId = this.$('#hidden_game_id').val() as string;
        
    }
    didMount() {
        this.initGame();
    }

    async initGame(): Promise<void> {
        const ganeListRet = await this.webSvc.game.getGameList();
        const { parameters } = ganeListRet.items.find(item => item.code === GameCode.catch);

        const profileRet = await this.webSvc.member.getProfile();
        const {  currentRoleGameItem } = profileRet.item;
        const { spriteFolderPath } = currentRoleGameItem;

        this.catchGame = await new CatchGame({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            superManSpriteFolderPath: spriteFolderPath,
            parameters: parameters
        }).init();
        
        this.catchGame.addEventListener('gameEnd', this.reportGameResult.bind(this));

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
