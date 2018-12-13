import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class PointHistoryPage extends BasePage {
  async vueInit() {
    const _this = this;
    
    new Vue({
      el: '#app',
      data() {
        return {
          memberId: '',
          dateGap: [],
          history: [],

          page: {
            index: 1,
            size: 10,
            dataAmount: 0,
          },
        }
      },
      computed: {
        dateStart() {
          if (!this.dateGap || !this.dateGap.length) return ''
          return _this.moment(this.dateGap[0]);
        },
        dateEnd() {
          if (!this.dateGap || !this.dateGap.length) return ''
          return _this.moment(this.dateGap[1]).endOf('day');
        }
      },
      methods: {

        async getGamePointExchangeHistories(init = false) {
          if (init) this.page.index = 1;

          const ret = await _this.adminSvc.adminMember.getGamePointExchangeHistories({
            pageIndex: this.page.index,
            pageSize: this.pageSize,
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
          }, { memberId: this.memberId })

          this.history = ret.items;
          this.page = { ...this.page, ...ret.page };
        },

        getPointTypeText(type) {
          return _this.getPointTypeText(type);
        },

        exportExcel() {
          window.open(_this.adminSvc.adminExport.getExportGamePointHistoryLink({
            token: _this.getAdminToken(),
          }))
        },

        handlePageChange(index) {
          this.page.index = index;
          this.getGamePointExchangeHistories();
        }
      },
      created() {
        this.getGamePointExchangeHistories();
      }
    })
  }

}

const page = new PointHistoryPage();
