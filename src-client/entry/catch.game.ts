import { CatchGame } from '../games/catch.game';
import { BasePage, PlusItem } from "./base.page";
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
        const [ganeListRet, profileRet, gameHistoryRet] = await Promise.all([
            this.webSvc.game.getGameList(),
            this.webSvc.member.getProfile(),
            this.webSvc.game.getGameHistory(this.gameId)
        ]);

        if (!ganeListRet.success || !profileRet.success || !gameHistoryRet.success) {
            this.toggleLoader(false);
            this.fakeAlert({
                title: ganeListRet.message + profileRet.message + gameHistoryRet.message,
                text: '',
                closeCallback() {
                    window.location.reload();
                }
            });
            return;
        }

        // 遊戲參數
        const { parameters } = ganeListRet.items.find(item => item.code === GameCode.catch);

        // 玩家資料
        const { currentRoleGameItem } = profileRet.item;
        const { spriteFolderPath } = currentRoleGameItem;

        // 該場遊戲使用的道具
        const { usedItems } = gameHistoryRet.item;
        let usedScoreUp = false;
        let usedCoinUp = false;
        usedItems.forEach(item => {
            switch(item.id) {
                case PlusItem.pointPlus:
                    // 使用了能量果實
                    usedScoreUp = true;
                    break;
                case PlusItem.coinPlus:
                    // 使用了富翁果實
                    usedCoinUp = true;
                    break;
            }
        })

        this.toggleLoader(false);

        this.catchGame = await new CatchGame({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            superManSpriteFolderPath: spriteFolderPath,
            parameters: parameters,
            usedScoreUp,
            usedCoinUp
        }).init();

        this.catchGame.addEventListener('gameEnd', this.reportGameResult.bind(this));
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
            this.toggleLoader(false);
            this.fakeAlert({
                title: ret.message,
                text: '',
                closeCallback() {
                    window.location.replace(`/catch-game`);
                }
            });
            return;
        }

        window.location.replace(`/catch-game/result/${ret.item.id}`);
    }

}

new CatchGamePage();
