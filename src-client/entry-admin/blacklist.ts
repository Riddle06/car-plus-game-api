import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class BlackList extends BasePage {
  async vueInit() {
    const _this = this;

    new Vue({
      el: '#app',
      data() {
        return {
          memberId: '',
          blockList: [],
          page: {
            index: 1,
            size: 10,
            dataAmount: 0,
          },

          blockForm: {
            shortId: '',
            reason: '',
            adminUserName: '',
          },

          isBlockDialogOpen: false,
        }
      },
      watch: {
        isBlockDialogOpen(bool) {
          if (!bool) {
            this.$refs.form.resetFields();
          }
        }
      },
      methods: {
        async getBlockMember(init = false) {
          if (init) this.page.index = 1;

          const ret = await _this.adminSvc.adminMember.getBlockMember({
            pageIndex: this.page.index,
            pageSize: this.page.size
          }, { shortId: this.memberId });

          if (!ret.success) {
            return;
          }

          this.blockList = ret.items;
          this.page = { ...this.page, ...ret.page };
        },

        async addBlockMember() {
          const isValid = await this.$refs.form.validate().catch(() => false);
          if (!isValid) {
            return;
          }
          const ret = await _this.adminSvc.adminMember.blockMember(this.blockForm);
          if (!ret.success) {
            return;
          }
          this.$notify({
            type: 'success',
            title: '封鎖成功'
          });
          this.isBlockDialogOpen = false;
          this.getBlockMember();
        },

        async unblockMember(history) {
          const bool = await this.$msgbox({
            ..._this.messageBoxOption,
            type: 'info',
            title: '您確定要解除封鎖嗎？',
            message: `
              <div>會員Id：${history.carPlusMemberId}</div>
              <div>會員暱稱：${history.memberNickName}</div>
            `
          }).catch(err => false);
          if(!bool) {
            return;
          }
          const ret = await _this.adminSvc.adminMember.unblockMember(history.id);
          if (!ret.success) {
            return;
          }
          this.$notify({
            type: 'success',
            title: '解除封鎖成功'
          });
          this.getBlockMember();
        },

        handlePageChange(index) {
          this.page.index = index;
          this.getBlockMember();
        }
      },
      created() {
        this.getBlockMember();
      }
    })
  }

}

const page = new BlackList();
