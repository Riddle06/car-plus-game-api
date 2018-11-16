import { BasePage } from "./base.page";


class HomePage extends BasePage {
    async didMount() {
        const profileRet = await this.webSvc.member.getProfile()
        console.log('[profile]', profileRet)

        if (this.$.trim(profileRet.item.nickName) === '') {
            const nickName = prompt('請輸入暱稱', '');
            await this.webSvc.member.updateNickName({ nickName: nickName })
            alert('首次登入，恭喜你獲得100超人幣')
        }

        return;
    }
    domEventBinding() {
        return;
    }

}

const homePage = new HomePage();
