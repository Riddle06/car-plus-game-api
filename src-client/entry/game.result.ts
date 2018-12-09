import { BasePage } from "./base.page";
import { LevelUpInformation } from '@view-models/variable.vm';
import { Variable } from '@view-models/game.vm';

class GameResultPage extends BasePage {
    private gameId: string
    private levelList: LevelUpInformation[];

    private $score: JQuery<HTMLElement>;
    private $level: JQuery<HTMLElement>;
    private $expIng: JQuery<HTMLElement>;
    private $expPlus: JQuery<HTMLElement>;
    private $gamePoint: JQuery<HTMLElement>;

    private changeExperience: number = 0;
    private varible: Variable = {
        host: '',
        shareText: '',
    };

    domEventBinding() {
        this.gameId = this.$('#hidden_game_id').val() as string;
        this.$score = this.$('#js-score');
        this.$level = this.$('#js-level');
        this.$expIng = this.$('#js-expIng');
        this.$expPlus = this.$('#js-expPlus');
        this.$gamePoint = this.$('#js-gamePoint');
        this.toggleLoader(false);

        this.$('#js-share').click(this.share.bind(this))
    }
    async didMount() {
        const ret = await this.webSvc.member.getLevelInfo();
        this.levelList = ret.items;

        this.getGameResult();
    }

    async getGameResult(): Promise<void> {
        const ret = await this.webSvc.game.getGameHistory(this.gameId);

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

        this.changeExperience = changeExperience;
        this.$score.text(changeExperience);
        this.$level.text(`${beforeLevel}級`);
        this.$gamePoint.text(`${gamePoint - levelUpGamePoint}`);

        let beforeExp = (beforeExperience / levelUpNeedExperience) * 100;
        let afterExp = changeLevel ? 100 : (afterExperience / levelUpNeedExperience) * 100;

        if (!changeLevel && afterExp > 90) {
            afterExp = 90;
        }
        if (!nowLevelInfo) {
            beforeExp = 0;
            afterExp = 0;
        }

        this.$expIng.css('width', `${beforeExp}%`);
        this.$expPlus.css('width', `${beforeExp}%`)

        const s = ".item__score";
        const e = ".item__exp";
        const c = ".item__coins";
        this.animation(s);
        setTimeout(() => { this.animation(e) }, 500);
        setTimeout(() => { this.animation(c) }, 1000);
        setTimeout(() => {
            this.$expPlus.css('width', `${afterExp}%`)
            setTimeout(() => {
                if (levelUpGamePoint) {

                    this.$level.text(`${afterLevel}級`);
                    this.$gamePoint.text(`${gamePoint - levelUpGamePoint}+${levelUpGamePoint}`);
                    const nowLevelInfo = this.levelList.find(item => item.level === afterLevel + 1);
                    const levelUpAfterExp = nowLevelInfo ? (afterExperience / nowLevelInfo.experience) * 100 : 0;
                    this.$expPlus.css('width', `0%`)
                    this.$expIng.css('width', `0%`);

                    this.fakeAlert({
                        title: `恭喜您升級！獲得${levelUpGamePoint}超人幣`,
                        text: '',
                        closeCallback: () => {
                            this.$expPlus.css('width', `${levelUpAfterExp}%`);
                        }
                    });

                }
            }, 200)
        }, 1400)
    }


    async share(): Promise<void> {
        if (!this.varible.shareText) {
            const ret = await this.webSvc.game.getGameVariable();
            console.log(ret);
            if (!ret.success) {
                this.fakeAlert({
                    title: 'Oops',
                    text: ret.message,
                });
                return;
            }
            this.varible = ret.item;
        }

        window.location.href = `line://msg/text/${encodeURIComponent(this.varible.shareText.replace('{{score}}', `${this.changeExperience}`))}`
    }

    animation(a: string): void {
        this.$(a).css({
            "animation-name": "bounceInUp",
            "animation-duration": "0.4s",
            "animation-fill-mode": "forwards"
        });
    }

}

const gameResultPage = new GameResultPage();
