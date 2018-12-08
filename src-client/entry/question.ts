import { BasePage } from "./base.page";

class QuestionPage extends BasePage {
    private $info: JQuery<HTMLElement>;

    private currentId: string;

    domEventBinding() {
        const _this = this;

        this.$info = this.$("#js-info");
        this.$(".js-question").click((e) => {

            if (this.currentId) {
                this.$(`#js-answer-${this.currentId}`).slideToggle(400);

            }
            const id = this.$(e.currentTarget).attr('data-index');

            if (this.currentId !== id) {
                this.$(`#js-answer-${id}`).slideToggle(400);
                this.currentId = id;
            } else {
                this.currentId = undefined;
            }

        })
    }
    didMount() {
        this.getMemberProfile();
    }


    async getMemberProfile(): Promise<void> {

        const profileRet = await this.webSvc.member.getProfile()

        const { gamePoint, carPlusPoint, currentRoleGameItem } = profileRet.item;
        const { spriteFolderPath } = currentRoleGameItem;

        this.$info.find("#js-gamePoint").text(gamePoint);
        this.$info.find("#js-carPlusPoint").text(carPlusPoint);
        this.$(".js-superMan").attr('src', `${spriteFolderPath}/default.png`)

        this.toggleLoader(false);
    }

}

const questionPage = new QuestionPage();
