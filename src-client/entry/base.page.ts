import webSvc from "../web-services";
import * as $ from "jquery";

export abstract class BasePage {
    protected webSvc = webSvc;
    protected $: JQueryStatic = $

    constructor() {

        this.setStopMask();
        this.setInitialScale();

        this.domEventBinding();
        this.didMount();
    }

    abstract domEventBinding()

    abstract didMount()

    private setStopMask(): void {
        const $stopMask = $("#js-stop-mask");

        if (window.screen.width > window.screen.height) {
            $stopMask.addClass('is-active');
        }
        window.addEventListener('orientationchange', function (event) {
            if (window.screen.width > window.screen.height) {
                $stopMask.addClass('is-active');
            } else {
                window.location.reload();
            }
        }, false)
    }

    private setInitialScale(): void {
        const $meta: HTMLMetaElement = document.querySelector('[name=viewport]');
        const scale: number = window.screen.width / 640;
        const pathname = window.location.pathname;

        if (window.screen.width > window.screen.height || pathname.includes('/shot-game/') || pathname.includes('/catch-game/')) {
            // 手機是橫的 或是為遊戲頁時
            $meta.content = 'width=device-width, initial-scale=1,user-scalable=0';
            return;
        }
        $meta.content = `width=device-width, initial-scale=${scale},user-scalable=0`;
    }

    fakeAlert({ title = '', text = '',  }): void {
        let html = `
            <div class="zoneMask" style="z-index: 9999">
                <div class="attrBox">
                    <div class="content">
                        <div class="inputList">
                            <div class="title">${title}</div>
                            <div class="text">${text}</div>
                        </div>
                    </div>
                    <div class="button__accept button__accept--singel type-btn" data-btn="close"><img src="/static/images/btn_accept.png" alt=""></div>
                    <div class="item-bg"><img src="/static/images/img_attrPanel.png" alt=""></div>
                </div>
            </div>
        `

        const $alert = this.$(html);
        this.$('body').append($alert);
        $alert.click(() => {
            $alert.remove();
        })
    }
}