import webSvc from "../web-services";
import * as $ from "jquery";
import * as jsCookie from 'js-cookie';
import device from 'current-device'

export abstract class BasePage {
    protected webSvc = webSvc;
    protected $: JQueryStatic = $
    protected mql: MediaQueryList = window.matchMedia("(orientation: portrait)");

    private isInputFocus: Boolean = false;

    public $zoneMask: JQuery<HTMLElement>;
    public $loader: JQuery<HTMLElement>;

    constructor() {

        if (device.desktop()) {
            // 是桌機
            this.fakeAlert({
                title: '要使用手機才能進行遊戲唷',
                text: '',
                showConfirmButton: false,
            });
        }

        this.setInitialScale();
        this.setWindowChecker();
        this.setZoneMask();

        this.domEventBinding();
        this.didMount();
    }

    abstract domEventBinding()

    abstract didMount()

    private setWindowChecker(): void {
        const $meta: HTMLMetaElement = document.querySelector('[name=viewport]');
        const $stopMask: JQuery<HTMLElement> = $("#js-stop-mask");
        const _this = this;

        if (!this.mql.matches) {
            // 手機是橫的
            $stopMask.addClass('is-active');
            $meta.content = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no';
        }

        this.mql.addListener(function (m) {
            const pathname = window.location.pathname;
            if (m.matches) {
                if (pathname.includes('/shot-game/') || pathname.includes('/catch-game/')) {
                    // 只有遊戲頁面轉正需要再次reload
                    window.location.reload();
                }
            }
            else if (!_this.isInputFocus) {
                // 手機是橫的 且 不是正在使用鍵盤
                $meta.content = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no';
                $stopMask.addClass('is-active');
            }
        });
        // https://stackoverflow.com/questions/37808180/disable-viewport-zooming-ios-10-safari

        this.$('input').focus(() => {
            // console.log('input focus')
            this.isInputFocus = true;
        });
        this.$('input').blur(() => {
            // console.log('input blur')
            this.isInputFocus = false;
        })
    }

    private setInitialScale(): void {
        const windowWidth = jsCookie.get('windowWidth');

        if (!windowWidth && this.mql.matches) {
            jsCookie.set('windowWidth', `${window.screen.width}`)
        }

        // const $meta: HTMLMetaElement = document.querySelector('[name=viewport]');
        // const scale: number = window.screen.width / 640;
        // const pathname = window.location.pathname;

        // if (window.screen.width > window.screen.height || pathname.includes('/shot-game/') || pathname.includes('/catch-game/')) {
        //     // 手機是橫的 或是為遊戲頁時
        //     $meta.content = 'width=device-width, initial-scale=1,user-scalable=0';
        //     return;
        // }
        // $meta.content = `width=device-width, initial-scale=${scale},user-scalable=0`;
    }

    private setZoneMask(): void {
        this.$zoneMask = this.$("#js-zoneMask");
        this.$('[data-btn="close"]').click(this.closeZoneMask.bind(this));
    }

    toggleLoader(bool: Boolean): void {
        if (!this.$loader) this.$loader = this.$("#js-loader");
        if (bool) {
            this.$loader.addClass('is-active')
        } else {
            this.$loader.removeClass('is-active')
        }
    }

    openZoneMask(name: string): void {
        this.$zoneMask.fadeIn(400);
        this.$zoneMask.find(`[data-name]`).hide();
        this.$zoneMask.find(`[data-name='${name}']`).show();
    }

    closeZoneMask(): void {
        this.$zoneMask.fadeOut(400);
    }

    fakeAlert(options: AlertOptions): void {
        __fakeAlert(options);
    }
}

function __fakeAlert(options: AlertOptions): void {
    const { title = '', text = '', showCancelButton = false, closeCallback, showConfirmButton = true } = options;

    let html = `
            <div class="zoneMask type-actual" style="z-index: 1000000">
                <div class="attrBox">
                    <div class="content">
                        <div class="inputList">
                            <div class="title">${title}</div>
                            <div class="text">${text}</div>
                        </div>
                    </div>
                    <div class="attrBox__button">
                        ${showCancelButton ? '<div class="button__x type-btn" fake-alert="close"><img src="/static/images/btn_x.png" alt=""></div>' : ''}
                        ${showConfirmButton ? '<div class="button__accept type-btn" fake-alert="accept"><img src="/static/images/btn_accept.png" alt=""></div>' : ''}
                    </div>
                    <div class="item-bg type-actual"><img src="/static/images/img_attrPanel.png" alt=""></div>
                </div>
            </div>
        `

    const $alert = $(html);
    $('body').append($alert);
    $alert.find("[fake-alert='close']").click(() => {
        $alert.remove();
    })
    $alert.find("[fake-alert='accept']").click(() => {
        $alert.remove();
        if (!!closeCallback) closeCallback();
    })
}
window['__fakeAlert'] = __fakeAlert;

interface AlertOptions {
    title: String
    text: String
    showCancelButton?: Boolean
    showConfirmButton?: Boolean
    closeCallback?: Function
}

export enum PlusItem {
    pointPlus = "920A9F93-102F-4B55-9ED5-A93F887DAF27",
    coinPlus = "28CCBE12-023B-42D9-97E0-23B1AFB56029",
    gamePoint = "BCDC5657-F5EF-4D97-ADEE-5BD2129202C2",
    carsPlusPoint = ""
}