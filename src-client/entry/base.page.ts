import webSvc from "../web-services";
import * as $ from "jquery";
import '../assets/scss/front/index.scss';

export abstract class BasePage {
    protected webSvc = webSvc;
    protected $: JQueryStatic = $
    constructor() {

        this.setStopMask();
        this.domEventBinding();
        this.didMount();
    }

    abstract domEventBinding()

    abstract didMount()

    private setStopMask() {
        const $stopMask = $("#js-stop-mask");

        if (window.orientation === 90 || window.orientation === -90) {
            $stopMask.addClass('is-active');
        }
        window.addEventListener('orientationchange', function (event) {
            if (window.orientation === 90 || window.orientation === -90) {
                $stopMask.addClass('is-active');
            } else {
                window.location.reload();
            }
        }, false)
    }

}