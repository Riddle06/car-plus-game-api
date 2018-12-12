import { adminSvc } from "../web-services";
import { GameItemType } from '@view-models/game.vm';
import * as Vue from 'vue/dist/vue.common'
import ElementUI from 'element-ui';
import * as cookie from "js-cookie";
import '../assets/scss/admin/index.scss';

export abstract class BasePage {
    protected adminSvc = adminSvc;
    protected loadingInstance = null;

    protected messageBoxOption = {
      dangerouslyUseHTMLString: true,
      center: true,
      showConfirmButton: true,
      showCancelButton: true, 
      confirmButtonText: '確定',
      cancelButtonText: '取消'
    }
    
    constructor() {
      Vue.use(ElementUI);
      this.vueInit();
    }

    getAdminToken(): string {
      const token = cookie.get('admin');

      return token;
  }

    getGameItemTypeName(type: number): Number | String {
      switch(type) {
        case GameItemType.role:
          return '角色';
        case GameItemType.tool:
          return '道具'
        case GameItemType.gamePoint:
          return '超人幣'
        case GameItemType.carPlusPoint:
          return '格上紅利'
        default:
          return type;
      }
    }
    
    openLoader() {
      this.loadingInstance = ElementUI.Loading.service({
        fullscreen: true,
        background: 'rgba(0,0,0, .7)',
        spinner: 'el-icon-loading',
      })
    }

    closeLoader() {
      Vue.nextTick(() => {
        this.loadingInstance.close();
      })
    }

    abstract vueInit()
}