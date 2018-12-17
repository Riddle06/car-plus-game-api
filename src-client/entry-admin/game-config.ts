import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class GameConfigPage extends BasePage {
  async vueInit() {
    const _this = this;

    new Vue({
      el: '#app',
      data() {
        return {
          activeTab: 'catch',
          gameList: [],

          shotGame: {
            degreeConfig: {
              max: 100,
              min: 1,
            },
            rotationSpeed: 0.015,
            shellInitPower: 13,
            shellInitWeightSpeed: 0.1,
            moveModes: [
              { xSpeed: 1, ySpeed: 0, circleSpeed: 0, radius: 0 },
              { xSpeed: 0, ySpeed: 1, circleSpeed: 0, radius: 0 },
              { xSpeed: 1, ySpeed: 1, circleSpeed: 0, radius: 0 },
              { xSpeed: 0, ySpeed: 0, circleSpeed: 5, radius: 60 },
              { xSpeed: 0.5, ySpeed: 0.5, circleSpeed: 5, radius: 30 }
            ]
          },

          catchGame: {
            fallSpeed: 3,
            gameTime: 60,
            lessTime: 5,
            moveSpeed: 3,
            types: [
              { score: -2, name: 'bomb' },
              { score: 3, name: "gift01" },
              { score: 3, name: "gift02" },
              { score: 3, name: "gift03" }
            ]
          },

          isEdit: false,
        }
      },
      computed: {
        isCatchGame() {
          return this.activeTab === 'catch';
        },
        catchGameId() {
          return this.gameList.find(game => game.code === 'catch').id;
        },
        shotGameId() {
          return this.gameList.find(game => game.code === 'shot').id;
        },
      },
      watch: {
        isEdit(bool) {
          if (!bool) this.initData();
        },
      },
      methods: {
        async getGameList() {
          const ret = await _this.adminSvc.adminGame.getGameList();
          console.log(ret);
          if (!ret.success) return;

          this.gameList = ret.items;
        },

        initData() {
          this.gameList.forEach(game => {
            if (game.code === 'shot') {
              this.shotGame = { ...this.shotGame, ...JSON.parse(JSON.stringify(game.parameters)) };
            }
            if (game.code === 'catch') {
              this.catchGame = { ...this.catchGame, ...JSON.parse(JSON.stringify(game.parameters)) };
            }
          })
        },

        async updateGameData() {
          console.log(this.isCatchGame ? 'catchGameForm' : 'shotGameForm')
          const isValid = await this.$refs[this.isCatchGame ? 'catchGameForm' : 'shotGameForm'].validate().catch(() => false);
          if (!isValid) {
            return;
          }

          const bool = await this.$msgbox({
            ..._this.messageBoxOption,
            type: 'info',
            title: '確定要送出嗎？',
            message: ``
          }).catch(err => false);
          if (!bool) {
            return;
          }

          const params = this.isCatchGame ? this.catchGame : this.shotGame;
          const ret = await _this.adminSvc.adminGame.updateGame(this.isCatchGame ? this.catchGameId : this.shotGameId, params)
          console.log(ret);
          if (!ret.success) return;

          this.$notify({
            type: 'success',
            title: '修改成功'
          });
          await this.getGameList();
          this.isEdit = false;
        }
      },
      async created() {
        await this.getGameList();
        this.initData();
      }
    })
  }

}

const page = new GameConfigPage();
