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
            dataAmount: 50,
          }
        }
      },
      methods: {
        handlePageChange(index) {
          this.page.index = index;
          // this.getGameHistory();
        }
      },
      created() {

      }
    })
  }

}

const page = new ReportPage();
