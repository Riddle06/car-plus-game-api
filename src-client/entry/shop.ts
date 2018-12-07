import { BasePage } from "./base.page";
import { GameItemVM } from '@view-models/game.vm';

class ShopPage extends BasePage {
    private $info: JQuery<HTMLElement>;

    domEventBinding() {
        const _this = this;

        this.$info = this.$("#js-info");
    } 
    didMount() {
        this.getMemberProfile();
        this.getGameItems();
    }
    

    async getMemberProfile(): Promise<void> {
        
        const profileRet = await this.webSvc.member.getProfile()

        const { gamePoint, carPlusPoint, currentRoleGameItem } = profileRet.item;
        const { spriteFolderPath } = currentRoleGameItem;
    
        this.$info.find("#js-gamePoint").text(gamePoint);
        this.$info.find("#js-carPlusPoint").text(carPlusPoint);

       
    }

    async getGameItems():  Promise<void> {
        const ret = await this.webSvc.game.getGameItems();
        console.log(ret)

        
        const ret2 = await this.webSvc.game.getGameItemById(ret.items[0].id);
        console.log(ret2)

        this.toggleLoader(false);
    }

}

const page = new ShopPage();
