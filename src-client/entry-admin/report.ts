import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class ReportPage extends BasePage {
  constructor() {
    super();

    if(!this.isAdmin) {
      window.location.replace('/administration')
    }
  }

  async vueInit() {
    const _this = this;

    new Vue({
      el: '#app',
      data() {
        return {
          dateGap: [],

          dashboard: {
            gameCount: 0,
            memberCount: 0,
            memberHasPlayGameCount: 0,
          },

          page: {
            index: 1,
            size: 10,
            dataAmount: 0,
          }
        }
      },
      computed: {
        dateStart() {
          if (!this.dateGap || !this.dateGap.length) return ''
          return _this.moment(this.dateGap[0]).toISOString();
        },
        dateEnd() {
          if (!this.dateGap || !this.dateGap.length) return ''
          return _this.moment(this.dateGap[1]).add(1, 'day').toISOString();
        },
        reports() {
          return [this.dashboard];
        }
      },
      watch: {
        dateGap() {
          if(this.dateStart) this.getDashboard(true)
        }
      },
      methods: {
        async getDashboard(init = true) {
          if (init) this.page.index = 1;

          const ret = await _this.adminSvc.adminGame.getDashboard({
            pageIndex: this.page.index,
            pageSize: this.page.size,
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
          })

          this.dashboard = ret.item;
        },
        
        exportExcel() {
          window.open(_this.adminSvc.adminExport.getExportDashboardLink({
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

      }
    })
  }

}

const page = new ReportPage();
