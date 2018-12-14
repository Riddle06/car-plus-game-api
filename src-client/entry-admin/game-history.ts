import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class GameHistoryPage extends BasePage {
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
          return _this.moment(this.dateGap[0]).toISOString();
        },
        dateEnd() {
          if (!this.dateGap || !this.dateGap.length) return ''
          return _this.moment(this.dateGap[1]).add(1, 'days').toISOString();
        }
      },
      methods: {

        async getGameHistory(init = false) {
          if (init) this.page.index = 1;

          const ret = await _this.adminSvc.adminMember.getGameHistories({
            pageIndex: this.page.index,
            pageSize: this.page.size,
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
          }, { memberId: this.memberId })

          this.history = ret.items;
          this.page = { ...this.page, ...ret.page };
        },

        exportExcel() {
          window.open(_this.adminSvc.adminExport.getExportGameHistoryLink({
            token: _this.getAdminToken(),
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
          }))
        },

        handlePageChange(index) {
          this.page.index = index;
          this.getGameHistory();
        }
      },
      created() {
        this.getGameHistory();
      }
    })
  }

}

const page = new GameHistoryPage();
