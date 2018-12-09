import { BasePage } from "./base.page";
import { GameItemVM } from '@view-models/game.vm';

class ShopPage extends BasePage {
    private $info: JQuery<HTMLElement>;

    private level: number = 0;
    private characters: GameItemVM[] = [];
    private props: GameItemVM[] = [];
    private memberItems: GameItemVM[] = [];

    domEventBinding() {
        const _this = this;

        this.$info = this.$("#js-info");
    } 
    async didMount() {
        await this.getMemberProfile();
        await this.getMemberItems();
        this.getGameItems();
    }
    

    async getMemberProfile(): Promise<void> {
        
        const profileRet = await this.webSvc.member.getProfile()

        const { gamePoint, carPlusPoint, currentRoleGameItem, level } = profileRet.item;
        const { spriteFolderPath } = currentRoleGameItem;
        
        this.level = level;
        this.$info.find("#js-gamePoint").text(gamePoint);
        this.$info.find("#js-carPlusPoint").text(carPlusPoint);
        this.$(".js-superMan").attr('src', `${spriteFolderPath}/default.png`)
    
    }

    async getMemberItems(): Promise<void> {
        const ret = await this.webSvc.member.getMemberItems();
        this.memberItems = ret.items;
    }

    async getGameItems():  Promise<void> {
        const ret = await this.webSvc.game.getGameItems();
        // console.log(ret)
        if (!ret.success) {
            this.fakeAlert({
                title: 'Oops',
                text: ret.message
            });
            return;
        }
        this.characters = ret.items.filter(obj => obj.type === 1);
        this.props = ret.items.filter(obj => obj.type !== 1);

        
        this.$('#js-character').html(this.characters.map(obj => {
            const isHave = this.memberItems.some(item => item.id === obj.id)
            const enable = obj.enableBuy && this.level >= obj.levelMinLimit;

            return `
                <!-- 左上角狀態: item (一般狀態) | item--lock (鎖住狀態) -->
                <div class="item js-buy type-btn ${enable ? '' : 'item--lock'}" data-id="${obj.id}">
                    <div class="item__icon icon"></div>
                    <div class="item__main">
                        <div class="goods"><img src="${obj.spriteFolderPath}/default.png" alt=""></div>
                    </div>
                    <!-- lock:鎖住(等級限制) | price:解鎖(購買金額) | hold:已擁有 | show:顯示 -->
                    <div class="item__tips type-shop">
                        <div class="it-s lock ${enable || isHave ? '' : 'show'}"><span>Lv${obj.levelMinLimit}</span></div>
                        <div class="it-s price ${enable && !isHave ? 'show' : ''}"><span>${obj.gamePoint}</span></div>
                        <div class="it-s hold ${isHave ? 'show': ''}"></div>
                    </div>
                </div>
            `
        }).join(''))

        this.$("#js-prop").html(this.props.map(obj => {
            const enable = obj.enableBuy && this.level >= obj.levelMinLimit;
            const isGamePoint = obj.type === 3;
            const isCarPlus = obj.type === 4;

            return `
                <div class="item type-btn ${enable ? 'js-buy' : 'item--lock'}" data-id="${obj.id}">
                    <div class="item__main">
                    <div class="goods"><img src="${obj.spriteFolderPath}list.png" alt=""></div>
                    </div>
                    <!-- price: 超人幣 | bounce: 紅利 -->
                    <div class="item__tips type-shop">
                    <div class="price ${isGamePoint ? 'price--bounce' : ''}"><span>${isGamePoint ? obj.carPlusPoint : obj.gamePoint}</span></div>
                    </div>
                </div>
            `
        }).join(''))

        this.$('.js-buy').click((e) => {
            const id = this.$(e.currentTarget).attr('data-id');
            window.location.href = `/shop/${id}`;
        })
        
        

        this.toggleLoader(false);
    }

}

const page = new ShopPage();
