import { BasePage, PlusItem } from "./base.page";
import { MemberGameItemVM, GameItemVM } from '@view-models/game.vm';

class ShopMerchPage extends BasePage {
    private $info: JQuery<HTMLElement>;
    private $character: JQuery<HTMLElement>;
    private $prop: JQuery<HTMLElement>;

    private itemId: string;
    private item: GameItemVM;
    private count: number = 1;
    private gamePoint: number = 0;
    private carPlusPoint: number = 0;
    private memberLevel: number = 0;
    private memberItem: MemberGameItemVM;

    private isProcessing = false;

    domEventBinding() {
        const _this = this;

        this.itemId = this.$("#hidden_item_id").val() as string;
        this.$info = this.$("#js-info");
        this.$character = this.$("#js-character");
        this.$prop = this.$("#js-prop");
    }
    async didMount() {
        await Promise.all([this.getMemberProfile(), this.getMemberItems()]);
        this.getItemInfo()
    }


    async getMemberProfile(): Promise<void> {

        const profileRet = await this.webSvc.member.getProfile()

        const { gamePoint, carPlusPoint, currentRoleGameItem, level } = profileRet.item;
        const { spriteFolderPath } = currentRoleGameItem;

        this.memberLevel = level;
        this.gamePoint = gamePoint;
        this.carPlusPoint = carPlusPoint;
        this.$info.find("#js-gamePoint").text(gamePoint);
        this.$info.find("#js-carPlusPoint").text(carPlusPoint);
        this.$(".js-superMan").attr('src', `${spriteFolderPath}/default.png`);
    }

    async getMemberItems(): Promise<void> {
        const ret = await this.webSvc.member.getMemberItems();
        this.memberItem = ret.items.find(obj => obj.id === this.itemId);
    }

    async getItemInfo(): Promise<void> {
        const ret = await this.webSvc.game.getGameItemById(this.itemId);
        // console.log(ret)
        this.toggleLoader(false);

        this.item = ret.item;

        this.render();
    }

    render(): void {
        const { type, name, description, gamePoint, carPlusPoint, spriteFolderPath, levelMinLimit, enableBuy } = this.item;
        const isHave = !!this.memberItem && !!this.memberItem.memberGameItemIds.length;
        const isLock = this.memberLevel < levelMinLimit;

        if (type === 1) {
            // ??????
            this.$character.html(`
                <div class="button__back type-btn" onclick="history.back()"><img src="/static/images/btn_back.png" alt=""></div>
                <div class="header"></div>
                <div class="content">
                    <div class="merch__title">${name}</div>
                    <div class="merch__graph">
                        <div class="photo"><img src="${spriteFolderPath}/default.png" alt=""></div>
                    </div>
                    <div class="merch__price type-shop"><span>${gamePoint}</span></div>
                    <div class="merch__info">${description}</div>
                    <div class="merch__status">
                        <div class="status ${isHave || isLock ? '' : 'show'}">
                        <div id="js-buy" class="button__buy type-btn" data-btn="merch-char"><img src="/static/images/btn_buy.png" alt=""></div>
                        </div>
                        <div class="status ${isHave ? 'show' : ''}">
                        <div class="title">?????????</div>
                        <div class="tips">???????????????????????????????????????????????????</div>
                        </div>
                    </div>
                </div>
                <div class="footer"></div>
            `).show();

            this.$('#js-buy').click(() => {
                this.openZoneMask('merch-char');
                const $attrBox = this.$zoneMask.find('[data-name="merch-char"]');
                $attrBox.find('.title').text(`${name}`)

                this.$('[data-btn="accept"]').off('click')
                this.$('[data-btn="accept"]').click(this.buyGameItem.bind(this));
            })

        } else {
            const isGamePoint = type === 3; // ???????????????????????????
            const isCarPlus = type === 4; // ?????????????????????
            const enoughPoint = isGamePoint ? this.carPlusPoint >= carPlusPoint : this.gamePoint >= this.count * gamePoint;
            // console.log(this.gamePoint, this.count * gamePoint)


            // ??????
            this.$prop.html(`
                <div class="button__back type-btn" onclick="history.back()"><img src="/static/images/btn_back.png" alt=""></div>
                <div class="header"></div>
                <div class="content">
                    <div class="merch__title">${name}</div>
                    <div class="merch__graph">
                        <div class="photo"><img src="${spriteFolderPath}details.png" alt=""></div>
                    </div>
                    <!-- merch__bouns???????????? ??? ??????merch__price ????????? -->
                    <div class="${isGamePoint ? 'merch__bouns' : 'merch__price'} type-shop"><span>${isGamePoint ? carPlusPoint : gamePoint}</span></div>
                    <div class="merch__info">${description}</div>
                    <div class="merch__amount">
                        ${isCarPlus ? '' : '<div id="js-less" class="button__less type-btn"><img src="/static/images/brn_less.png" alt=""></div>'}
                        <div id="js-count" class="item-amount">${this.count}</div>
                        ${isCarPlus ? '' : '<div id="js-plus" class="button__plus type-btn"><img src="/static/images/brn_plus.png" alt=""></div>'}
                    </div>
                    <div class="merch__status">
                        <!--  show: ?????? -->
                        <div class="status__tips ${enoughPoint ? '' : 'show'}">??????${isGamePoint ? '????????????' : '?????????'}??????!</div>
                        <!-- lock: ?????? -->
                        <div class="status ${enoughPoint && enableBuy ? 'show' : 'lock'}">
                        <div id="js-buy" class="button__buy type-btn" data-btn="merch-prop"><img src="/static/images/btn_buy.png" alt=""></div>
                        </div>
                    </div>
                </div>
                <div class="footer"></div>
            `).show();

            this.$('#js-buy').click(() => {
                this.openZoneMask('merch-prop');
                const $attrBox = this.$zoneMask.find('[data-name="merch-prop"]');
                $attrBox.find('.title').text(`${name} x ${this.count}`)
                $attrBox.find('.tips').text(`???????????????: ${this.memberItem ? this.memberItem.memberGameItemIds.length : 0}`);

                this.$('[data-btn="accept"]').off('click')
                this.$('[data-btn="accept"]').click(this.buyGameItem.bind(this));
            })

            this.$('#js-plus').click(() => { this.addCount(1) })
            this.$('#js-less').click(() => { this.addCount(-1) })
        }

    }

    addCount(num: number): void {
        this.count += num;
        if (this.count <= 0) {
            this.count = 1;
            return;
        }
        this.render();
    }

    async buyGameItem(): Promise<void> {
        if(this.isProcessing) return;
        this.closeZoneMask();
        this.toggleLoader(true);

        const useNow = this.$("#js-use").prop('checked');
        // ???????????????????????????

        this.isProcessing = true;
        const ret = await this.webSvc.game.buyGameItem({
            gameItemId: this.itemId,
            num: this.count
        });
        this.isProcessing = false;
        this.toggleLoader(false);

        if (!ret.success) {
            this.fakeAlert({
                title: 'Oops',
                text: ret.message
            });
            return;
        }

        if (useNow) {
            // ?????????????????????
            await this.getMemberItems();
            const id = this.memberItem.memberGameItemIds[0]
            if (id) {
                await this.webSvc.member.useGameItem(id);
            } 
        }

        this.fakeAlert({
            title: '????????????',
            text: '',
            closeCallback() {
                window.location.href = '/shop';
            }
        });

    }
}

const page = new ShopMerchPage();
