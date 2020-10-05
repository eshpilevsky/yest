<template>
  <div class='specialOffer-restaurants-container'>
    <p class="specialOffer-title">Акции:</p>
    <div v-swiper="swiperOptions" id='swiper' class="specialOffer-slider">
      <div class="swiper-wrapper specialOffer-wrapper">

        <div v-for='(item, index) in this.restaurantsList' :key='index' class="swiper-slide">
          <nuxt-link :to="`/${get_rest_url(item)}`"  class="restorane-list-item">
            <div class="list-item-block">
              <div class="item-logo-block" v-if="item.logo !== undefined">
                <img contain :alt="item.name" v-lazy="item.logo" class="restorane-logo-image-small">
              </div>
              <img contain :alt="item.name" v-lazy="item.cover" class="restorane-logo" :class="{closeRestorane:item.is_open == false }" />
              <div class="block-bottom">
                <div class="card-time" v-show="checkAddress">
                  <p class="card-time__quantity">{{item.time.min}} &mdash; {{item.time.max}}</p>
                  <p class="card-time__unit">мин</p>
                </div>
                <div class="card-title">
                  <span class="restorane-list-item-name" :class="{hidetime: checkAddress}">{{ item.name }}</span>
                  <v-chip class="item-bottom-right-mob" color="primary" v-show="item.rating !== 0">
                    <v-icon color="#FFFADF">star</v-icon>
                    <div class="rating">{{ item.rating }}</div>
                  </v-chip>
                </div>
                <div class="card-options">
                  <img class="card-options__delivery" src="@/assets/deliveryIcon.svg" alt="deliveryIcon" />
                  <span class="restaurant_block_free_delivery">
                  Бесплатная доставка
                </span>
                  <span class="card-options__rating" v-show="item.rating !== 0">
                            <v-icon class="rating-icon" color="#FFFADF">star</v-icon>
                            <span>{{ item.rating }}</span>
                        </span>
                  <!--<span class="card-options__currency">-->
                  <!--<img class="currency-icon" src="@/assets/purseIcon.svg" alt="purseIcon" />-->
                  <!--заказ от 0.01 BYN-->
                  <!--</span>-->

                </div>
              </div>
              <div class="card-sale">
                <span class="card-sale__img">%</span>
                <span class="card-sale__text">Скидка 20%</span>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="customBtnPrev" slot="button-prev">
        <div class="customBtnPrev-box"></div>
      </div>
      <div class="customBtnNext" slot="button-next">
        <div class="customBtnNext-box"></div>
      </div>
      <div class="swiper-pagination" slot="pagination"></div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import {mapGetters, mapActions} from "vuex";
    import * as Cookie from 'js-cookie'
    import {
      directive
    } from 'vue-awesome-swiper'

    export default {
      name: "restuarants-special-offers-list.vue",
      directives: {
        swiper: directive
      },
      props: {
        restaurantsList: Array,
        currentCategory: Object,
        currentZone: Object,
      },
      data() {

        // let restaurant = props.

        return {
          restaurantsList:[],
          swiperOptions: {
            observer: true,
            observeParents: false,
            slidesPerView: 4,
            spaceBetween: 40,
            navigation: {
              nextEl: '.customBtnNext',
              prevEl: '.customBtnPrev',
            },
            // effect: 'fade',
            breakpoints: {
              1200: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              992: {
                slidesPerView: 3,
              },
              865: {
                slidesPerView: 3.2,
              },
              720: {
                slidesPerView: 2.7,
              },
              600: {
                slidesPerView: 2.4,
              },
              500: {
                slidesPerView: 1.9,
              },
              440: {
                slidesPerView: 1.7,
              },
              320: {
                slidesPerView: 1.2,
                spaceBetween: 20,
              }
            }
          }
        };
      },
      computed: {
        ...mapGetters({
          getCurrentAddress: "map/getCurrentAddress",
          getCurrentCoords: "map/getCurrentCoords"
        }),

      },
      watch: {
        restaurantsList(newValue) {
          this.restaurantsList = newValue;
          return newValue
        },
      },
      methods: {
        translite(str) {
          str = str.replace(/[^A-Za-zА-Яа-яЁё]^-/g, "")
          var ru = {
              'а': 'a',
              'б': 'b',
              'в': 'v',
              'г': 'g',
              'д': 'd',
              'е': 'e',
              'ё': 'e',
              'ж': 'j',
              'з': 'z',
              'и': 'i',
              'к': 'k',
              'л': 'l',
              'м': 'm',
              'н': 'n',
              'о': 'o',
              'п': 'p',
              'р': 'r',
              'с': 's',
              'т': 't',
              'у': 'u',
              'ф': 'f',
              'х': 'h',
              'ц': 'c',
              'ч': 'ch',
              'ш': 'sh',
              'щ': 'shch',
              'ы': 'y',
              'э': 'e',
              'ю': 'u',
              'я': 'ya'
            },
            n_str = [];
          str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');
          for (var i = 0; i < str.length; ++i) {
            n_str.push(
              ru[str[i]] ||
              ru[str[i].toLowerCase()] == undefined && str[i] ||
              ru[str[i].toLowerCase()].replace(/^(.)/, function (match) {
                return match.toUpperCase()
              })
            );
          }
          return n_str.join('');
        },
        get_rest_url(info){
          // return 'minsk';
          let name = this.translite(info.name)
          let modifName = name.replace(' ', '-')
          let url = `${this.currentZone.alias}/restaurant/${info.restaurant_id}-${modifName.toLowerCase()}`
          return url;
        },
      },
      created() {

      },
    };
</script>

<style scoped>
  .card-sale {
    display: flex;
    margin-top: 14px;
    position: absolute;
    top: 0;
    left: 6px;
  }
  .card-sale__img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 32px;
    font-size: 16px;
    font-weight: 600;
    background-color: #4ca648;
    color: #fff;
    margin-top: -8px;
    position: relative;
  }
  .card-sale__text {
    padding: 8px 12px 8px 18px;
    font-size: 13px;
    background: #F1F0ED;
    line-height: 16px;
    flex-shrink: 0;
    border-radius: 999px;
    margin-left: -12px;
  }

  .specialOffer-restaurants-container {
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 4px solid rgba(245, 245, 245, 0.6);
  }

  .customBtnPrev,
  .customBtnNext {
    position: absolute;
    top: 0;
    background: #fff;
    z-index: 1;
    overflow: hidden;
    width: 70px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none
  }

  .customBtnPrev {
    left: 0;
  }

  .customBtnNext {
    right: 0;
  }

  .customBtnNext-box, .customBtnPrev-box {
    z-index: 10;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    height: 40px;
    width: 40px;
    background-position: center;
    background-color: #00a646;
  }

  .customBtnNext .customBtnNext-box {
    background-image: url("../assets/nextArrowIcon.svg");
  }

  .customBtnPrev .customBtnPrev-box {
    background-image: url("../assets/prevArrowIcon.svg");
  }

  .customBtnPrev.swiper-button-disabled .customBtnPrev-box,
  .customBtnNext.swiper-button-disabled .customBtnPrev-box {
    display: none;
  }

  .specialOffer-title {
    font-size: 28px;
    font-weight: bold;
    color: black;
    padding: 20px 90px 0;
  }

  .specialOffer-slider {
    padding: 0 90px;
    overflow: hidden;
  }

  .card-options {
    display: flex;
    align-items: center;
  }
  .card-options__delivery {
    margin-right: 10px;
  }
  .card-options__rating {
    display: flex;
    align-items: center;
    font-size: 14px;
    background-color: #00a646;
    height: 22px;
    padding: 2px 10px 2px 2px;
    margin-right: 10px;
    border-radius: 100px;
    color: #fff;
  }
  .card-options__rating .rating-icon {
    font-size: 18px;
    margin-right: 5px;
  }
  .card-options__currency {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .card-options__currency .currency-icon {
    margin-right: 5px;
  }
  .card-time {
    position: absolute;
    top: -20px;
    right: 13px;
    background-color: #fff;
    border-radius: 23px;
    padding: 10px 17px;
  }
  .card-time .card-time__quantity {
    text-align: center;
    font-size: 16px;
    line-height: 16px;
    font-weight: 600;
  }
  .card-time .card-time__unit {
    text-align: center;
    font-size: 12px;
    line-height: 10px;
    color: #646464;
    font-weight: 600;
  }
  .card-time:before {
    content: "";
    position: absolute;
    top: calc(100% - 35px);
    left: -7px;
    display: block;
    width: 10px;
    height: 10px;
    background-image: url("../assets/timeLeftPath.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .card-time:after {
    content: "";
    position: absolute;
    top: calc(100% - 35px);
    right: -7px;
    display: block;
    width: 10px;
    height: 10px;
    background-image: url("../assets/timeRightPath.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .block-bottom {
    width: calc(100% - 40px);
    padding: 16px 20px 20px;
    position: relative;
  }
  .card-title {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  .list-item-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgb(240, 240, 240);
    position: relative;
  }
  .informMe-btn {
    color: #000 !important;
    font-weight: 500;
    text-transform: none;
  }
  .notFoundDescription {
    color: rgba(0, 0, 0, 0.5);
    font-size: 16px;
    max-width: 992px;
    text-align: center;
    margin: auto;
  }
  .notfound {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .notfoundTitle {
    text-align: center;
    font-weight: bold;
    font-size: 30px;
  }
  .closeRestorane {
    filter: grayscale(100%);
  }
  .rating {
    color: #000 !important;
    margin-left: 5px;
  }
  .item-bottom-right-mob {
    display: none;
  }
  .item-work-time {
    padding-bottom: 10px;
  }
  .show-btn-block {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 90px;
  }
  .showMore-btn {
    width: 100% !important;
    margin-bottom: 20px !important;
    color: #fff !important;
    font-weight: bold !important;
    text-transform: none !important;
    height: 40px !important;
    font-size: 16px !important;
  }
  .loading-item {
    width: 100%;
    max-width: 375px;
    margin: 10px 20px;
  }
  .loading {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
  }
  .restorane-logo {
    height: 100%;
    width: 100%;
    min-height: 188px;
    max-height: 188px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    object-fit: cover;
    background: #000;
  }
  .restorane-logo-image-small{
    height: 100%;
    width: 100%;
    background-size: cover;
  }
  .restorane-list-item-tags {
    font-size: 11px;
    color: rgba(0, 0, 0, 0.5);
    width: 100%;
    margin-bottom: 10px !important;
  }
  .restorane-list-item-name {
    overflow: hidden;
    font-size: 20px;
    line-height: 1.2;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    min-height: 30px;
    text-align: left;
    z-index: 2;
    position: relative;
    text-decoration: none;
  }
  .restorane-list-item {
    text-decoration: none;
    color: #000 !important;
  }
  .restorane-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 20px 90px;
  }
  .restorane-title {
    font-size: 28px;
    font-weight: bold;
    color: black;
    padding: 20px 90px;
    padding-bottom: 0;
  }
  .specialOfferSwiper {
    cursor: pointer;
  }
  .restuarants-container {
    width: 100%;
    max-width: 1420px;
    margin: auto;
    margin-bottom: .5rem;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    border-top: 4px solid rgba(245, 245, 245, 0.6) !important;
    box-shadow: none !important;
  }
  .item-logo-block{
    width: 60px;
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    padding: 6px;
    margin: 108px 20px 20px 20px;
    background: #fff;
    border-radius: 10px;
  }
  .restaurant_block_free_delivery{
    font-size: 14px;
  }
  /*@media screen and (max-width: 1000px) {*/
  /*  .list-item-block {*/
  /*    min-height: 273px;*/
  /*    margin: 10px 20px;*/
  /*  }*/
  /*}*/
  @media screen and (max-width: 992px) {
    .item-logo-block {
      width: 48px;
      height: 48px;
    }
    .specialOffer-slider {
      padding: 0 20px;
    }
    .specialOffer-title {
      padding: 16px 30px 0;
      font-size: 20px;
    }
    .customBtnPrev,
    .customBtnNext {
      display: none;
    }
    .show-btn-block {
      padding: 0 20px;
    }
    .restorane-list {
      padding: 0;
    }
    .restorane-title {
      padding: 20px 20px 0px 20px;
    }
    .hidetime {
      padding-top: 0px;
    }
    .restorane-list-item:hover {
      transition: none;
      transform: none;
    }
    .restorane-list-item:not(:hover) {
      transition: none;
    }
    .block-bottom {
      /*height: 55px;*/
    }
    .card-title {
      width: 100%;
      height: 25px;
      margin-bottom: 6px;
    }
    .noLocation {
      justify-content: flex-end !important;
    }
    .item-bottom-right-mob {
      display: flex;
      position: relative;
      right: 1rem;
      bottom: 3rem;
    }
    .restorane-list-item-name {
      min-height: 50px;
      padding-bottom: 0px;
    }
    .restuarants-container {
      margin-bottom: 0;
      border-top: none;
    }
    .showMore-btn {
      margin-bottom: 30px !important;
    }
    .restorane-title {
      padding: 16px 30px;
      font-size: 20px;
    }
    .restorane-list {
      padding: 0;
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    .restorane-list-item {
      border-radius: 20px;
      min-width: 300px;
    }
    .restorane-logo {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }
  }
</style>
