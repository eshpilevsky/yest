<template>
  <v-card class="restuarants-container">
    <h2 class="restorane-title" id="restTitle" v-show='!notFound'>Рестораны</h2>
    <v-flex cols-12 wrap class="restorane-list">
      <v-flex cols-12 md4 sm6 xs12 v-for="(item, index) in this.restaurants" :key="index" class="restorane-list-item" @click="restOverlay = !restOverlay">
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
          </div>
        </nuxt-link>
      </v-flex>

    </v-flex>
    <div v-show="notFound" class="notFound">
      <div class="notfoundTitle">Нас тут ещё нет :(</div>
      <div class="notFoundDescription pa-4">Но мы подключаем десятки новых мест каждую неделю. Может быит, и здесь окажемся! Если оставите свою почту, сразу вам сообщим. Обещаем не спамить.</div>
      <div class="d-flex justify-center align-center pb-4">
        <v-btn color="primary" class="informMe-btn">Сообщить мне</v-btn>
      </div>
    </div>
    <div class="show-btn-block">
      <v-btn color="primary" class="showMore-btn" @click="showMore()" v-show="(this.restaurantsList).length > this.limit" :loading="loadingShowMore">Показать ещё</v-btn>
    </div>
    <v-overlay :value="restOverlay" z-index="100">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
  import axios from 'axios'
  import {mapGetters} from "vuex";
  import * as Cookie from 'js-cookie'

  export default {
    name: "Restorane",
    props: {
      restaurantsList: Array,
      currentCategory: Object,
      currentZone: Object,
    },
    data() {
      return {
        restOverlay: false,
        absolute: true,
        serachAdress: "",
        restaurants: [],
        selcatmass: [],
        mergeMassive: [],
        loadingRest: true,
        notFound: false,
        startLimit: 0,
        limit: 12,
        itemCounter: 0,
        params: {},
        notFindImg: require("../assets/logo.svg"),
        swiperOptions: {
          slidesPerView: 3,
          spaceBetween: 30,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
          }
        },
        restList: null,
        counterRest: 0,
        urlStr: '',
        loadingShowMore: false,
      };
    },
    computed: {
      ...mapGetters({
        getCurrentAddress: "map/getCurrentAddress",
        getCurrentCoords: "map/getCurrentCoords"
      }),
      checkAddress() {
        return this.getCurrentAddress.length > 0 ? true : false
      },
      swiper() {
        return this.$refs.mySwiper.$swiper;
      },
      wiw() {
        if (process.client) {
          return window.innerWidth
        }
      },
    },
    watch: {
      loadingShowMore(newValue) {
        return newValue
      },
      restaurantsList(newValue) {
        console.log('restaurantsList');
        console.log(newValue);

        this.startLimit = 0;
        this.limit = 12;
        this.restaurantsList = newValue;
        this.restaurants = newValue.slice(this.startLimit, this.limit);

        return newValue
      },
      getCurrentAddress(newValue) {
        // this.getRestWithCoords()
      },
      overlay (val) {
        val && setTimeout(() => {
          this.overlay = false
        }, 5000)
      },
    },
    methods: {
      async getRestWithCoords() {

      },
      calcTime(mass) {
        const today = new Date().getDay();
        const openTime = mass[today - 1].open_time;
        const closeTime = mass[today].close_time;
        return `${openTime.slice(0, 5)} - ${closeTime.slice(0, 5)}`;
      },
      translite(str){
        let text = this.to_latin(str);
        return text.toLowerCase();
      },
      to_latin(str) {
        str = str.replace(/\n/, "");
        str = str.replace(/\r/, "");
        str = str.replace(/\s+/, " ");
//   str = str.replace(/[^0-9a-z-_ ]/i, "");

        const ru = new Map([
          ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'],
          ['є', 'e'], ['ё', 'e'], ['ж', 'j'], ['з', 'z'], ['и', 'i'], ['ї', 'yi'], ['й', 'i'],
          ['к', 'k'], ['л', 'l'], ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'],
          ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'], ['х', 'h'], ['ц', 'c'], ['ч', 'ch'],
          ['ш', 'sh'], ['щ', 'shch'], ['ы', 'y'], ['э', 'e'], ['ю', 'u'], ['я', 'ya'],
        ]);

        str = str.replace(/[ъь]+/g, '');

        return Array.from(str)
          .reduce((s, l) =>
            s + (
              ru.get(l)
              || ru.get(l.toLowerCase()) === undefined && l
              || ru.get(l.toLowerCase()).toUpperCase()
            )
            , '');

      },
      get_rest_url(info){
        // return 'minsk';
        let name = this.translite(info.name)
        let modifName = name.replace(' ', '-')
        let url = `${this.currentZone.alias}/restaurant/${info.restaurant_id}-${modifName.toLowerCase()}`
        return url;
      },
      goToRes(info) {
        ym(67033669,'reachGoal','openRestaurantPage');
      },
      async showMore() {
        this.loadingShowMore = true;
        this.startLimit += 12;
        this.limit += 12;

        console.log('startLimit:'+this.startLimit);
        console.log('limit:'+this.limit);

        this.restaurants = (this.restaurants).concat(this.restaurantsList.slice(this.startLimit, this.limit));
        this.loadingShowMore = false
      }
    },
    created() {
      if (this.restaurantsList[0] !== '404') {
        this.restOverlay = true
        this.counterRest = this.restaurantsList.length
        // this.counterRest = 500;

        this.restaurants = this.restaurantsList
        setTimeout(() => {
          this.restaurants = this.restaurantsList.slice(0, this.limit)
        }, 1000);
        this.restOverlay = false
      } else {
        this.restaurants = [];
        this.notFound = true;
        this.counterRest = 0
        this.restOverlay = false
      }
    },
  };
</script>

<style scoped>
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
    width: 100%;
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
    margin: 20px;
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
  .restorane-list-item:hover {
    transition: 0.5s;
    transform: scale(1.05);
  }
  .restorane-list-item:not(:hover) {
    transition: 0.5s;
  }
  .restorane-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 20px 70px;
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
    border-top: none !important;
    border-radius: 0 0 4px 4px !important;
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
  @media screen and (max-width: 1000px) {
    .list-item-block {
      min-height: 273px;
      margin: 10px 20px;
    }
  }
  @media screen and (max-width: 992px) {
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
      height: 85px;
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
