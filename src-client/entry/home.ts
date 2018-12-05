import { BasePage } from "./base.page";


class HomePage extends BasePage {
    private $zoneMask: JQuery<HTMLElement>;
    private $info: JQuery<HTMLElement>;

    async didMount() {
        this.$zoneMask = this.$("#js-zoneMask")
        this.$info = this.$("#js-info");

        this.getMemberProfile();

        return;
    }

    domEventBinding(): void {
        const _this = this;

        this.$('[data-btn="close"]').click(this.closeZoneMask.bind(this));

        this.$('#js-submit').click(async () => {
            // 送出暱稱
            const nickName = this.$("#js-nickNameValue").val() as string;
            const ret = await this.webSvc.member.updateNickName({ nickName: nickName })
            console.log('[updateNickName]', ret);
            if (!ret.success) {
                this.fakeAlert({
                    title: 'Oops',
                    text: ret.message
                });
                return;
            }
            this.openZoneMask('next');
        })

        return;
    }

    openZoneMask(name: string): void {
        this.$zoneMask.fadeIn(400);
        this.$zoneMask.find(`[data-name]`).hide();
        this.$zoneMask.find(`[data-name='${name}']`).show();
    }

    closeZoneMask(): void {
        this.$zoneMask.fadeOut(400);
    }

    async getMemberProfile(): Promise<void> {
        const profileRet = await this.webSvc.member.getProfile()
        console.log('[profile]', profileRet)

        const { nickName, level, gamePoint, carPlusPoint, currentRoleGameItem } = profileRet.item;
        const { spriteFolderPath } = currentRoleGameItem;
        let infoHtml = this.$info.html()
            .replace('{nickName}', nickName)
            .replace('{level}', `${level}級`)
            .replace('{gamePoint}', `${gamePoint}`)
            .replace('{carPlusPoint}', `${carPlusPoint}`)
        this.$info.html(infoHtml);

        if (this.$.trim(profileRet.item.nickName) === '') {
            this.openZoneMask('attrBox');
        }
    }

}

window['homePage'] = new HomePage();
