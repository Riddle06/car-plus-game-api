import { BasePage } from "./base.page";
import Swiper from 'swiper';

class TutorialPage extends BasePage {

    domEventBinding() {
      this.toggleLoader(false);
    }
    didMount() {
      new Swiper('.swiper-container', {
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }



}

const page = new TutorialPage();
