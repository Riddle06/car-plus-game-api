import { LevelUpInformation } from '@view-models/variable.vm';
import { GameItemVM } from '@view-models/game.vm';
import { BasePage } from "./base.page";

class ProfilePage extends BasePage {
    private $info: JQuery<HTMLElement>;
    private $infoCard: JQuery<HTMLElement>;
    private nickName: string = '';
    private levelList: LevelUpInformation[];
    private currentRoleGameItem: GameItemVM;

    domEventBinding(): void {
        const _this = this;

        this.$info = this.$("#js-info");
        this.$infoCard = this.$("#js-info-card");

        this.$('#js-submit').click(async () => {
            // 送出暱稱
            const nickName = this.$("#js-nickNameValue").val() as string;
            if(this.nickName === nickName) {
                // 沒換
                this.closeZoneMask();
                return;
            }
            const ret = await this.webSvc.member.updateNickName({ nickName: nickName })
            console.log('[updateNickName]', ret);
            if (!ret.success) {
                this.fakeAlert({
                    title: 'Oops',
                    text: ret.message
                });
                return;
            }
            
            this.getMemberProfile();
        })

        this.$("[data-btn='edit']").click(() => { this.openZoneMask('edit') });

        return;
    }
    async didMount() {
        const ret = await this.webSvc.member.getLevelInfo();
        this.levelList = ret.items;

        await this.getMemberProfile();
        this.getMemberItems();
    }


    async getMemberProfile(): Promise<void> {
        
        const profileRet = await this.webSvc.member.getProfile()

        const { nickName, level, gamePoint, carPlusPoint, currentRoleGameItem, experience } = profileRet.item;
        this.currentRoleGameItem = currentRoleGameItem;
        const { spriteFolderPath } = currentRoleGameItem;
        
        const nowLevelInfo = this.levelList.find(item => item.level === level + 1);
        const levelUpNeedExperience = nowLevelInfo ? nowLevelInfo.experience : 0;
        const percentage = levelUpNeedExperience ? (experience / levelUpNeedExperience) * 100 : 100;

        this.$info.find("#js-gamePoint").text(gamePoint);
        this.$info.find("#js-carPlusPoint").text(carPlusPoint);

        this.$infoCard.find("#js-nickName").text(nickName);
        this.$infoCard.find("#js-level").text(`${level}級`);
        this.$infoCard.find("#js-experience").text(`${experience}/${levelUpNeedExperience}`);
        this.$infoCard.find("#js-percentage").css('width', `${percentage}%`);

        this.nickName = nickName;
        this.$("#js-nickNameValue").val(nickName)
        

        this.toggleLoader(false);
    }

    async getMemberItems(): Promise<void> {
        const ret = await this.webSvc.member.getMemberItems();
        console.log(ret)

        this.$("#js-itemList").html(ret.items.map(item => {
            if (item.type === 1) {
                const isCurrent = this.currentRoleGameItem.id === item.id;
                // 角色
                return `
                    <a href="/profile/game-item/${item.id}">
                        <div class="item item-char">
                            <div class="item__icon ${isCurrent ? 'icon__accept': '' }"></div>
                            <div class="item__main">
                                <div class="goods"><img src="/static/images/img_character02.png" alt=""></div>
                            </div>
                        </div>
                    </a>
                `
            }

            return `
                <a href="/profile/game-item/${item.id}">
                    <div class="item item-prop">
                        <div class="item__icon icon__amount"><span>x${item.memberGameItemIds.length}</span></div>
                        <div class="item__main">
                            <div class="goods"><img src="${item.spriteFolderPath}list.png" alt=""></div>
                        </div>
                    </div>
                </a>
            `
        }).join(''))
    }

}

window['profilePage'] = new ProfilePage();
