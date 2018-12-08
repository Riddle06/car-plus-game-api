import { BasePage } from "./base.page";


class HomePage extends BasePage {
    private $info: JQuery<HTMLElement>;

    domEventBinding(): void {
        const _this = this;

        this.$info = this.$("#js-info");

        this.$('#js-submit').click(async () => {
            // 送出暱稱
            const nickName = this.$("#js-nickNameValue").val() as string;
            const ret = await this.webSvc.member.updateNickName({ nickName: nickName })
            if (!ret.success) {
                this.fakeAlert({
                    title: 'Oops',
                    text: ret.message
                });
                return;
            }
            this.$("#js-nick-name").text(nickName);
            this.openZoneMask('next');
        })

        return;
    }

    didMount(): void {

        this.getMemberProfile();

        return;
    }

    async getMemberProfile(): Promise<void> {
        const profileRet = await this.webSvc.member.getProfile()
        // console.log('[profile]', profileRet)

        const { nickName, level, gamePoint, carPlusPoint, currentRoleGameItem } = profileRet.item;
        const { spriteFolderPath } = currentRoleGameItem;
        let infoHtml = this.$info.html()
            .replace('{nickName}', nickName)
            .replace('{level}', `${level}級`)
            .replace('{gamePoint}', `${gamePoint}`)
            .replace('{carPlusPoint}', `${carPlusPoint}`)

        this.$info.html(infoHtml);
        this.$("#js-superMan").attr('src', `${spriteFolderPath}/default.png`)

        if (this.$.trim(profileRet.item.nickName) === '') {
            this.openZoneMask('attrBox');
        }

        this.toggleLoader(false);
    }

}

const homePage = new HomePage();
