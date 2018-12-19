import { BasePage } from "./base.page";
import Swiper from 'swiper';
import * as jsCookie from 'js-cookie';
import * as moment from "moment";

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

    jsCookie.set('tutorial-read', '1', {
      expires: moment().add(200, 'years').toDate()
    })
  }



}

const page = new TutorialPage();
