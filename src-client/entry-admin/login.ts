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

          isLoading: false,
        }
      },
      methods: {
        async login() {
          this.isLoading = true;
          const ret = await _this.adminSvc.adminAuth.login({
            account: this.account,
            password: this.password
          });
          this.isLoading = false;

          if (!ret.success) {
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
