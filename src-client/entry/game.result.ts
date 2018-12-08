import { BasePage } from "./base.page";
import { LevelUpInformation } from '@view-models/variable.vm';

class GameResultPage extends BasePage {
    private gameId: string
    private levelList: LevelUpInformation[];
    private beforeExp: number = 0;
    private afterExp: number = 0;

    private $score: JQuery<HTMLElement>;
    private $level: JQuery<HTMLElement>;
    private $expIng: JQuery<HTMLElement>;
    private $expPlus: JQuery<HTMLElement>;
    private $gamePoint: JQuery<HTMLElement>;

    domEventBinding() {
        this.gameId = this.$('#hidden_game_id').val() as string;
        this.$score = this.$('#js-score');
        this.$level = this.$('#js-level');
        this.$expIng = this.$('#js-expIng');
        this.$expPlus = this.$('#js-expPlus');
        this.$gamePoint = this.$('#js-gamePoint');

    }
    async didMount() {
        const ret = await this.webSvc.member.getLevelInfo();
        this.levelList = ret.items;

        this.getGameResult();
    }

    async getGameResult(): Promise<void> {
        const ret = await this.webSvc.game.getGameHistory(this.gameId);
        console.log(ret)
        if (!ret.success) {
            this.fakeAlert({
                title: 'Oops',
                text: ret.message,
                closeCallback() {
                    window.location.replace('/')
                }
            });
            return;
        }
        const { afterExperience, beforeExperience, changeExperience, gamePoint, levelUpGamePoint, changeLevel, afterLevel, beforeLevel } = ret.item;
        const nowLevelInfo = this.levelList.find(item => item.level === beforeLevel + 1);
        const levelUpNeedExperience = nowLevelInfo ? nowLevelInfo.experience : 0;

        this.$score.text(changeExperience);
        this.$level.text(`${beforeLevel}級`);
        this.$gamePoint.text(`${gamePoint - levelUpGamePoint}`);

        this.beforeExp = (beforeExperience / levelUpNeedExperience) * 100;
        this.afterExp = changeLevel ? 100 : (afterExperience / levelUpNeedExperience) * 100;

        this.$expIng.css('width', `${this.beforeExp}%`);
        this.$expPlus.css('width', `${this.afterExp}%`)

        this.toggleLoader(false);

        setTimeout(() => {
            this.$expIng.css('width', `${this.afterExp}%`);

            setTimeout(() => {
                this.$level.text(`${afterLevel}級`);
                if (levelUpGamePoint) {
                    this.fakeAlert({
                        title: `恭喜您升級！獲得${levelUpGamePoint}超人幣`,
                        text: '',
                    });
                    this.$gamePoint.text(`${gamePoint - levelUpGamePoint}+${levelUpGamePoint}`);
                }
            }, 200)
        }, 1000)


    }

}

const gameResultPage = new GameResultPage();
