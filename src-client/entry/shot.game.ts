import { BasePage } from "./base.page";
import { ShotGame } from '../games/shot.game'
import { GameCode } from "@view-models/game.vm";

class ShotGamePage extends BasePage {
    private gameId: string
    private shotGame: ShotGame;

    async domEventBinding() {
        this.gameId = this.$('#hidden_game_id').val() as string;   
    }

    didMount() {
        this.initGame();
    }

    async initGame(): Promise<void> {
        const ganeListRet = await this.webSvc.game.getGameList();
        const { parameters } = ganeListRet.items.find(item => item.code === GameCode.shot);

        const profileRet = await this.webSvc.member.getProfile()

        const {  currentRoleGameItem } = profileRet.item;
        const { spriteFolderPath } = currentRoleGameItem;

        this.shotGame = await new ShotGame({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            superManSpriteFolderPath: spriteFolderPath,
            monsterSpriteFolderPath: '',
            parameters,
        }).init();

        this.shotGame.addEventListener('gameEnd', this.reportGameResult.bind(this));

        this.toggleLoader(false);
    }

    async reportGameResult(): Promise<void> {
        this.toggleLoader(true);
        const { scores, gamePoints } = this.shotGame;
        const ret = await this.webSvc.game.reportGame(this.gameId, {
            gameHistoryId: this.gameId,
            scoreEncryptString: btoa(btoa(scores.toString())),
            gamePintEncryptString: btoa(btoa(gamePoints.toString()))
            // scoreEncryptString: btoa(btoa('1500')),
            // gamePintEncryptString: btoa(btoa('300'))
        })
        
        if (!ret.success) {
            this.fakeAlert({
                title: 'Oops',
                text: ret.message
            });
            return;
        }

        window.location.replace(`/shot-game/result/${ret.item.id}`);
    }
}

const shotGamePage = new ShotGamePage();
