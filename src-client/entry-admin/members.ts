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
            dataAmount: 0,
          }
        }
      },
      methods: {
        async getMembers(init = false) {
          if (init) this.page.index = 1;

          const ret = await _this.adminSvc.adminMember.getMembers({
            pageIndex: this.page.index,
            pageSize: this.page.size
          });
          this.members = ret.items;
          this.page = { ...this.page, ...ret.page };
        },
        handlePageChange(index) {
          console.log(index);
          this.page.index = index;
          this.getMembers();
        }
      },
      created() {
        this.getMembers();
      }
    })
  }

}

const membersPage = new MembersPage();
