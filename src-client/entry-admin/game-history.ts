import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class GameHistoryPage extends BasePage {
  async vueInit() {
    const _this = this;
    
    new Vue({
      el: '#app',
      data() {
        return {
          history: [
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

const page = new GameHistoryPage();
