import { LevelUpInformation } from '@view-models/variable.vm';
import { BasePage } from "./base.page";

class ProfilePage extends BasePage {
    private $info: JQuery<HTMLElement>;
    private nickName: string = '';

    private levelList: LevelUpInformation[];

    domEventBinding(): void {
        const _this = this;

        this.$info = this.$("#js-info");

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

        this.getMemberProfile();
        this.getMemberItem();
    }


    async getMemberProfile(): Promise<void> {
        
        const profileRet = await this.webSvc.member.getProfile()

        const { nickName, level, gamePoint, carPlusPoint, currentRoleGameItem, experience } = profileRet.item;
        const { spriteFolderPath } = currentRoleGameItem;
        
        const nowLevelInfo = this.levelList.find(item => item.level === level + 1);
        const levelUpNeedExperience = nowLevelInfo ? nowLevelInfo.experience : 0;
        const percentage = levelUpNeedExperience ? (experience / levelUpNeedExperience) * 100 : 100;

        this.$info.find("#js-gamePoint").text(gamePoint);
        this.$info.find("#js-carPlusPoint").text(carPlusPoint);
        this.$info.find("#js-nickName").text(nickName);
        this.$info.find("#js-level").text(`${level}級`);
        this.$info.find("#js-experience").text(`${experience}/${levelUpNeedExperience}`);
        this.$info.find("#js-percentage").css('width', `${percentage}%`);

        this.nickName = nickName;
        this.$("#js-nickNameValue").val(nickName)
        

        this.toggleLoader(false);
    }

    async getMemberItem(): Promise<void> {
        const ret = await this.webSvc.member.getMemberItems();
        console.log(ret)
    }

}

window['profilePage'] = new ProfilePage();
