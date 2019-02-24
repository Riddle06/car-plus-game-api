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

          dashboard: {
            // FIXME: 這是舊的資料格式
            date: '',
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
          // FIXME: 這是假資料
          let temp = [];
          for(let i=0; i < 50; i++) {
            temp.push(this.dashboard)
          }
          return temp;
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
        // if(!this.$g_isAdmin) {
        //   window.location.replace('/administration')
        // }
      }
    })
  }

}

const page = new ReportPage();
