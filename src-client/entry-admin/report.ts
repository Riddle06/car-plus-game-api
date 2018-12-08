import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class ReportPage extends BasePage {
  async vueInit() {
    const _this = this;
    
    new Vue({
      el: '#app',
      data() {
        return {
          reports: [
            { id: 1, name: '無名', level: 10, coin: 100, }
          ],
          page: {
            index: 1,
            size: 10,
            dataAmount: 50,
          }
        }
      },
      methods: {
        handlePageChange() {
          
        }
      },
      created() {

      }
    })
  }

}

const page = new ReportPage();
