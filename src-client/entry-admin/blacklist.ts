import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class BlackList extends BasePage {
  async vueInit() {
    const webSvc = this.webSvc;
    
    new Vue({
      el: '#app',
      data() {
        return {
          blacklist: [
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

const page = new BlackList();
