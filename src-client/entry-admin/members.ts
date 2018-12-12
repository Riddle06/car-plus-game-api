import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class MembersPage extends BasePage {
  async vueInit() {
    const _this = this;

    new Vue({
      el: '#app',
      data() {
        return {
          memberId: '',
          member: {},
          members: [
            { id: 1, name: '無名', level: 10, coin: 100, }
          ],
          page: {
            index: 1,
            size: 10,
            dataAmount: 0,
          },

          blockForm: {
            memberId: '',
            reason: '',
            adminUserName: '',
          },


          isDialogOpen: false,
          isBlockDialogOpen: false,
        }
      },
      watch: {
        isDialogOpen(bool) {
          if (!bool) this.member = {};
        },
        isBlockDialogOpen(bool) {
          if (!bool) {
            this.member = {};
            this.$refs.form.resetFields();
          }
        }
      },
      methods: {
        async getMembers(init = false) {
          if (init) this.page.index = 1;

          const ret = await _this.adminSvc.adminMember.getMembers({
            pageIndex: this.page.index,
            pageSize: this.page.size
          }, { memberId: this.memberId });

          this.members = ret.items;
          this.page = { ...this.page, ...ret.page };
        },

        async openMemberDetail(member) {
          _this.openLoader();
          const ret = await _this.adminSvc.adminMember.getMemberDetail(member.id);
          _this.closeLoader();
          console.log(ret)

          this.member = ret.item;
          this.isDialogOpen = true;
        },

        openBlockDialog(member) {
          this.member = member;
          this.blockForm.memberId = member.id;
          this.isBlockDialogOpen = true;
        },

        async addBlockMember() {
          const isValid = await this.$refs.form.validate().catch(() => false);
          if (!isValid) {
            return;
          }
          const ret = await _this.adminSvc.adminMember.blockMember(this.blockForm);
          if (!ret.success) {
            this.$notify({
              type: 'error',
              title: '封鎖失敗',
              message: ret.message
            });
            return;
          }
          this.$notify({
            type: 'success',
            title: '封鎖成功'
          });
          this.isBlockDialogOpen = false;
        },

        exportExcel() {
          window.open(_this.adminSvc.adminExport.getExportMemberWithGameItems({
            token: _this.getAdminToken(),
          }))
        },

        getGameItemTypeName(type) {
          return _this.getGameItemTypeName(type);
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
