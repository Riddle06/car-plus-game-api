import webSvc from "../web-services";
import * as $ from "jquery";

export abstract class BasePage {
    protected webSvc = webSvc;
    protected $: JQueryStatic = $
    constructor() {

        this.domEventBinding();
        this.didMount();
    }

    abstract domEventBinding()

    abstract didMount()

}