import { BasePage } from "./base.page";
import * as Vue from 'vue/dist/vue.common'

class GameConfigPage extends BasePage {
  async vueInit() {
    const _this = this;

    new Vue({
      el: '#app',
      data() {
        return {
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
      created() {

      }
    })
  }

}

const page = new GameConfigPage();
