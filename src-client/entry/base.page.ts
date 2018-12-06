import webSvc from "../web-services";
import * as $ from "jquery";
import * as jsCookie from 'js-cookie';

export abstract class BasePage {
    protected webSvc = webSvc;
    protected $: JQueryStatic = $
    protected mql: MediaQueryList = window.matchMedia("(orientation: portrait)");

    public $zoneMask: JQuery<HTMLElement>;

    constructor() {

        this.setInitialScale();
        this.setStopMask();
        this.setZoneMask();

        this.domEventBinding();
        this.didMount();
    }

    abstract domEventBinding()

    abstract didMount()

    private setStopMask(): void {
        const $meta: HTMLMetaElement = document.querySelector('[name=viewport]');
        const $stopMask: JQuery<HTMLElement> = $("#js-stop-mask");

        if (!this.mql.matches) {
            $stopMask.addClass('is-active');
            $meta.content = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no';
        }

        this.mql.addListener(function (m) {
            if (m.matches) {
                window.location.reload();
            }
            else {
                // 手機是橫的
                $meta.content = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no';
                $stopMask.addClass('is-active');
            }
        });
        // https://stackoverflow.com/questions/37808180/disable-viewport-zooming-ios-10-safari

        // window.addEventListener('orientationchange', function (event) {
        //     if (window.screen.width > window.screen.height) {
        //         $stopMask.addClass('is-active');
        //     } else {
        //         window.location.reload();
        //     }
        // }, false)
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

    openZoneMask(name: string): void {
        this.$zoneMask.fadeIn(400);
        this.$zoneMask.find(`[data-name]`).hide();
        this.$zoneMask.find(`[data-name='${name}']`).show();
    }

    closeZoneMask(): void {
        this.$zoneMask.fadeOut(400);
    }

    fakeAlert(options: AlertOptions): void {
        const { title = '', text = '', showCancelButton = false, closeCallback } = options;

        let html = `
            <div class="zoneMask" style="z-index: 9999">
                <div class="attrBox">
                    <div class="content">
                        <div class="inputList">
                            <div class="title">${title}</div>
                            <div class="text">${text}</div>
                        </div>
                    </div>
                    <div class="attrBox__button">
                        ${showCancelButton ? '<div class="button__x type-btn" fake-alert="close"><img src="/static/images/btn_x.png" alt=""></div>' : ''}
                        <div class="button__accept type-btn" fake-alert="accept"><img src="/static/images/btn_accept.png" alt=""></div>
                    </div>
                    <div class="item-bg"><img src="/static/images/img_attrPanel.png" alt=""></div>
                </div>
            </div>
        `

        const $alert = this.$(html);
        this.$('body').append($alert);
        $alert.find("[fake-alert='close']").click(() => {
            $alert.remove();
        })
        $alert.find("[fake-alert='accept']").click(() => {
            $alert.remove();
            if (!!closeCallback) closeCallback();
        })
    }
}

interface AlertOptions {
    title: String,
    text: String,
    showCancelButton?: Boolean,
    closeCallback?: Function,
}