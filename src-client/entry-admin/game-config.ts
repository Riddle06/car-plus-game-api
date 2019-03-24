import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'
import { cloneDeep as _cloneDeep, merge as _merge } from 'lodash';
import { GameItemType } from "@view-models/game.vm";

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
            ],
            levelRewards: [
              { level: 1, score: 1, gamePoint: { min: 1, max: 1 } },
              { level: 2, score: 2, gamePoint: { min: 1, max: 1 } },
              { level: 3, score: 3, gamePoint: { min: 1, max: 1 } },
              { level: 4, score: 4, gamePoint: { min: 1, max: 1 } },
              { level: 5, score: 5, gamePoint: { min: 1, max: 1 } },
              { level: 6, score: 6, gamePoint: { min: 1, max: 1 } },
              { level: 7, score: 7, gamePoint: { min: 1, max: 1 } },
              { level: 8, score: 8, gamePoint: { min: 1, max: 1 } },
              { level: 9, score: 9, gamePoint: { min: 1, max: 1 } },
              { level: 10, score: 10, gamePoint: { min: 1, max: 1 } },
              { level: 11, score: 11, gamePoint: { min: 1, max: 1 } },
              { level: 12, score: 12, gamePoint: { min: 1, max: 1 } },
              { level: 13, score: 13, gamePoint: { min: 1, max: 1 } },
              { level: 14, score: 14, gamePoint: { min: 1, max: 1 } },
              { level: 15, score: 15, gamePoint: { min: 1, max: 1 } },
            ],
            maxGamePoint: 35,
          },

          catchGame: {
            fallSpeed: 3,
            gameTime: 60,
            lessTime: 5,
            moveSpeed: 3,
            types: [
              { score: -2, name: 'bomb', gamePoint: { min: 0, max: 0 } },
              { score: 3, name: "gift01", gamePoint: { min: 0, max: 1 } },
              { score: 3, name: "gift02", gamePoint: { min: 0, max: 1 } },
              { score: 3, name: "gift03", gamePoint: { min: 0, max: 1 } }
            ],
            maxGamePoint: 35,
          },

          carPlusEnable: false,
          isEdit: false,
          isLoading: true,
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
          this.isLoading = true;
          const ret = await _this.adminSvc.adminGame.getGameList();
          console.log(ret);
          if (!ret.success) return;

          this.gameList = ret.items;
        },
        async getGameItemStatus() {
          // 取得所有道具
          const ret = await _this.adminSvc.adminGame.getGameItemList();
          console.log(ret);
          if (!ret.success) return;

          // 尋找兌換格上紅利，沒有就代表沒啟用
          this.carPlusEnable = ret.items.findIndex(obj => obj.type === GameItemType.carPlusPoint ) >= 0;
        },

        initData() {
          this.gameList.forEach(game => {
            if (game.code === 'shot') {
              this.shotGame = _merge(this.shotGame, _cloneDeep(game.parameters));
            }
            if (game.code === 'catch') {
              this.catchGame = _merge(this.catchGame, _cloneDeep(game.parameters));
            }
          })
          this.isLoading = false;
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
        },

        async updateGameItem() {
          const bool = await this.$msgbox({
            ..._this.messageBoxOption,
            type: 'info',
            title: '確定要送出嗎？',
            message: ``
          }).catch(err => false);
          if (!bool) {
            return;
          }

          const ret = await _this.adminSvc.adminGame.updateCarPlusPointGameItemEnable({ enable: this.carPlusEnable })
          console.log(ret);
          if (!ret.success) return;

          this.$notify({
            type: 'success',
            title: '修改成功'
          });
          this.getGameItemStatus();
          this.isEdit = false;
        }
      },
      async created() {
        this.getGameItemStatus();
        await this.getGameList();
        this.initData();
      }
    })
  }

}

const page = new GameConfigPage();
