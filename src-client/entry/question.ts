import { BasePage } from "./base.page";

class QuestionPage extends BasePage {
    private $info: JQuery<HTMLElement>;

    domEventBinding() {
        const _this = this;

        this.$info = this.$("#js-info");

        this.$(".js-question").click((e) => {
            const id = this.$(e.currentTarget).attr('data-index');
            this.$(`#js-answer-${id}`).slideToggle(400);
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

        this.toggleLoader(false);
    }

}

const questionPage = new QuestionPage();
