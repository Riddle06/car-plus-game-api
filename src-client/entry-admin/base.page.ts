import { adminSvc } from "../web-services";
import { GameItemType } from '@view-models/game.vm';
import { PointType } from '@view-models/admin.point.vm';
import * as Vue from 'vue/dist/vue.common'
import ElementUI from 'element-ui';
import * as cookie from "js-cookie";
import * as moment from 'moment';
import '../assets/scss/admin/index.scss';

export abstract class BasePage {
    protected adminSvc = adminSvc;
    protected moment = moment;
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

      Vue.mixin({
        methods: {
          $g_formatDateTime(date: any): string {
            return moment(date).format('YYYY/MM/DD HH:ss')
          }
        }
      })

      this.vueInit();
    }

    getAdminToken(): string {
      const token = cookie.get('admin');

      return token;
  }

    getGameItemTypeName(type: number): number | string {
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

    getPointTypeText(type: number): number | string {
      switch(type) {
        case PointType.carPlus:
          return '格上紅利';
        case PointType.gamePoint:
          return '超人幣'
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