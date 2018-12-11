import { BasePage } from "./base.page";
import * as cookie from "js-cookie";
import * as Vue from 'vue/dist/vue.common'

class LoginPage extends BasePage {
  async vueInit() {
    const _this = this;

    new Vue({
      el: '#app',
      data() {
        return {
          account: '',
          password: '',
        }
      },
      methods: {
        async login() {
          const ret = await _this.adminSvc.adminAuth.login({
            account: this.account,
            password: this.password
          });

          if (!ret.success) {
            this.$notify({
              type: 'error',
              title: '登入失敗',
              message: ret.message
            });
            return;
          }
          cookie.set('admin', ret.item, { expires: 1 });
          window.location.href = '/administration'

        }
      },
      created() {

      }
    })
  }

}

const loginPage = new LoginPage();
