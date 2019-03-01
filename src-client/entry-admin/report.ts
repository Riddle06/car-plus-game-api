import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class ReportPage extends BasePage {

  async vueInit() {
    const _this = this;

    new Vue({
      el: '#app',
      data() {
        return {
          dateGap: [],

          reports: [],

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
          return _this.moment(this.dateGap[1]).endOf('days').toISOString();
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

          this.reports = ret.items;
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
        if(!this.$g_isAdmin) {
          window.location.replace('/administration')
        }
      }
    })
  }

}

const page = new ReportPage();
