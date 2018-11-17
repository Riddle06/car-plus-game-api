import webSvc from "../web-services";
import * as Vue from 'vue/dist/vue.common'
import ElementUI from 'element-ui';
import '../assets/scss/index.scss';

export abstract class BasePage {
    protected webSvc = webSvc;
    
    constructor() {
      Vue.use(ElementUI);
      this.vueInit();
    }

    abstract vueInit()
}