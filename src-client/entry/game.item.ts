import { BasePage } from "./base.page";
import { MemberGameItemVM, GameItemVM, UseGameItemVM, GameItemType } from '@view-models/game.vm';

class ShopPage extends BasePage {
    private $info: JQuery<HTMLElement>;
    private $character: JQuery<HTMLElement>;
    private $prop: JQuery<HTMLElement>;

    private itemId: string;
    private currentRoleGameItem: GameItemVM;
    private memberItem: MemberGameItemVM;
    private useableGameItem: UseGameItemVM;

    private isProcessing: boolean = false;

    domEventBinding() {
        const _this = this;

        this.itemId = this.$("#hidden_item_id").val() as string;
        this.$info = this.$("#js-info");
        this.$character = this.$("#js-character");
        this.$prop = this.$("#js-prop");
    }
    async didMount() {
        await Promise.all([this.getMemberProfile(), this.getMemberItems(), this.getUsableGameItems()])
        this.render();
    }


    async getMemberProfile(): Promise<void> {

        const profileRet = await this.webSvc.member.getProfile()

        const { gamePoint, carPlusPoint, currentRoleGameItem } = profileRet.item;
        this.currentRoleGameItem = currentRoleGameItem;
        const { spriteFolderPath } = currentRoleGameItem;

        this.$info.find("#js-gamePoint").text(gamePoint);
        this.$info.find("#js-carPlusPoint").text(carPlusPoint);


    }

    async getMemberItems(): Promise<void> {
        const ret = await this.webSvc.member.getMemberItems();
        this.memberItem = ret.items.find(obj => obj.id === this.itemId);

        this.toggleLoader(false);
    }

    async getUsableGameItems(): Promise<void> {
        const ret = await this.webSvc.member.getUsableGameItems()
        this.useableGameItem = ret.items.find(obj => obj.gameItemId === this.itemId);
    }

    render(): void {
        const { type, name, description, spriteFolderPath } = this.memberItem;

        if (type === 1) {
            // 角色
            const isCurrent = this.currentRoleGameItem.id === this.memberItem.id;

            this.$character.html(`
                <div id="js-character" class="merch merch-character">
                    <div class="button__back type-btn" onclick="history.back()"><img src="/static/images/btn_back.png" alt=""></div>
                    <div class="header"></div>
                    <div class="content">
                    <div class="merch__title">${name}</div>
                    <div class="merch__graph">
                        <div class="photo"><img src="/static/images/img_character02.png" alt=""></div>
                    </div>
                    <div class="merch__info">${description}</div>
                    <div class="merch__status">
                        <div class="status ${isCurrent ? '' : 'show'}">
                            <div id="js-use" class="button__use type-btn"><img src="/static/images/btn_use.png" alt=""></div>
                        </div>
                        <div class="status ${isCurrent ? 'show' : ''}">
                            <div class="button__use"><img src="/static/images/btn_uselock.png" alt=""></div>
                        </div>
                    </div>
                    </div>
                    <div class="footer"></div>
                </div>
            `).show();

            this.$('#js-use').click(() => {
                this.openZoneMask('user-char');
                const $attrBox = this.$zoneMask.find('[data-name="user-char"]');
                $attrBox.find('.title').text(`${name}`)

                this.$('[data-btn="accept"]').off('click')
                this.$('[data-btn="accept"]').click(() => {
                    this.useGameItem(this.memberItem.memberGameItemIds[0]);
                });
            })


        } else {
            const isUsing = this.useableGameItem.isUsing;
            // 道具
            this.$prop.html(`
                <div class="button__back type-btn" onclick="history.back()"><img src="/static/images/btn_back.png" alt=""></div>
                <div class="header"></div>
                <div class="content">
                    <div class="merch__title">${name}</div>
                    <div class="merch__graph">
                        <div class="photo"><img src="${spriteFolderPath}/details.png" alt=""></div>
                    </div>
                    <div class="merch__info">${description}</div>
                    <div class="merch__status">
                        <div class="status ${isUsing ? '' : 'show'}">
                            <div id="js-use" class="button__use type-btn"><img src="/static/images/btn_use.png" alt=""></div>
                        </div>
                        <div class="status ${isUsing ? 'show' : ''}">
                            <div class="button__use"><img src="/static/images/btn_uselock.png" alt=""></div>
                        </div>
                    </div>
                </div>
                <div class="footer"></div>
            `).show();

            this.$('#js-use').click(() => {
                this.openZoneMask('user-prop');
                const $attrBox = this.$zoneMask.find('[data-name="user-prop"]');
                $attrBox.find('.title').text(`${name}`)
                let itemCount = 0;
                switch (this.memberItem.type) {
                    case GameItemType.role:
                    case GameItemType.tool:
                        itemCount = this.memberItem.memberGameItemIds.length;
                        break;
                    case GameItemType.carPlusPoint:
                        itemCount = parseInt(this.$info.find("#js-carPlusPoint").text())
                        break;
                    case GameItemType.gamePoint:
                        itemCount = parseInt(this.$info.find("#js-gamePoint").text())
                        break;
                }

                $attrBox.find('.tips').text(`目前持有數: ${itemCount}`)

                this.$('[data-btn="accept"]').off('click')
                this.$('[data-btn="accept"]').click(() => {
                    this.useGameItem(this.memberItem.memberGameItemIds[0]);
                });
            })
        }

    }

    async useGameItem(id: string): Promise<void> {
        if (this.isProcessing) return;
        this.closeZoneMask();
        this.toggleLoader(true);

        this.isProcessing = true;
        const ret = await this.webSvc.member.useGameItem(id);
        this.isProcessing = false;
        this.toggleLoader(false);

        if (!ret.success) {
            this.fakeAlert({
                title: 'Oops',
                text: ret.message
            });
            return;
        }
        this.fakeAlert({
            title: '使用成功',
            text: '',
            closeCallback() {
                window.location.href = '/profile';
            }
        });
    }

}

const page = new ShopPage();
