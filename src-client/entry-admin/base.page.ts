import { adminSvc } from "../web-services";
import * as Vue from 'vue/dist/vue.common'
import ElementUI from 'element-ui';
import '../assets/scss/admin/index.scss';

export abstract class BasePage {
    protected adminSvc = adminSvc;
    
    constructor() {
      Vue.use(ElementUI);
      this.vueInit();
    }

    abstract vueInit()
}