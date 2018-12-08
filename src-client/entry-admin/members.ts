import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class MembersPage extends BasePage {
  async vueInit() {
    const _this = this;
    
    new Vue({
      el: '#app',
      data() {
        return {
          members: [
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
        async getMembers() {
          const ret = await _this.adminSvc.adminMember.getMembers();
          console.log(ret);
        },
        handlePageChange() {
          
        }
      },
      created() {
        this.getMembers();
      }
    })
  }

}

const membersPage = new MembersPage();
