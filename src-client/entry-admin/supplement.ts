import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class SipplementPage extends BasePage {
  async vueInit() {
    const _this = this;
    
    new Vue({
      el: '#app',
      data() {
        return {
         
          // dateGap: [],
          history: [],

          form: {
            carPlusMemberId: '',
            gamePoint: 0,
            reason: '',
            adminUserName: '',
          },

          page: {
            index: 1,
            size: 10,
            dataAmount: 0,
          },

          isDialogOpen: false,
        }
      },
      computed: {
        // dateStart() {
        //   if (!this.dateGap || !this.dateGap.length) return ''
        //   return _this.moment(this.dateGap[0]).toISOString();
        // },
        // dateEnd() {
        //   if (!this.dateGap || !this.dateGap.length) return ''
        //   return _this.moment(this.dateGap[1]).endOf('day').toISOString();
        // }
      },
      watch: {
        isDialogOpen(bool) {
          if (!bool) {
            this.$refs.form.resetFields();
          }
        }
      },
      methods: {

        async getManualGamePointHistories(init = false) {
          if (init) this.page.index = 1;

          const ret = await _this.adminSvc.adminMember.getManualGamePointHistories({
            pageIndex: this.page.index,
            pageSize: this.page.size,
            // dateStart: this.dateStart,
            // dateEnd: this.dateEnd,
          })

          this.history = ret.items;
          this.page = { ...this.page, ...ret.page };
        },

        async addGamePoint() {
          const isValid = await this.$refs.form.validate().catch(() => false);
          if (!isValid) {
            return;
          }
          const ret = await _this.adminSvc.adminMember.addGamePoint(this.form);
          if (!ret.success) return;
          this.$notify({
            type: 'success',
            title: '補幣成功'
          });
          this.isDialogOpen = false;

          this.getManualGamePointHistories(true)
        },

        handlePageChange(index) {
          this.page.index = index;
          this.getManualGamePointHistories();
        }
      },
      created() {
        this.getManualGamePointHistories();
      }
    })
  }

}

const page = new SipplementPage();
