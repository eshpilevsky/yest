<template>
<div style="padding-bottom: 0px">
    <setAdress :currentZone='currentZone' :currentCategory='this.currentCategory' :categoryInfoData='categoryInfoData' :class="{hide: showSetAdress == false}" />
    <specialOffers :offers="specilaOffers" v-show="showSpecialOffer" />
    <categories v-show="categoriesList.length > 1" :currentZone='currentZone' :categoriesList='categoriesList' :currentCategory='this.currentCategory' />

    <restuarantsSpecialOffersList :restaurantsList='SpecialOfferRestaurants'  :currentCategory='this.currentCategory' :currentZone='currentZone'/>
    <restuarantsList :restaurantsList='restaurantsList' :currentCategory='this.currentCategory' :currentZone='currentZone' />

  <!-- SEO блок -->

      <!-- Выбор региона -->
      <!-- Выбор региона -->

      <!-- (IF) Если в городе нет станций метро то не выводим -->
      <!-- Рестораны вблизи станции метро -->
      <!-- Рестораны вблизи станции метро -->

      <!-- (IF) Если в системе нет информации о районах то не выводим -->
      <!-- Рестораны по районам  -->
      <!-- Рестораны по районам  -->

      <!-- (IF) Если у системы нет информации об улицах то не выводим-->
      <!-- Рестораны по улицам  -->
      <!-- Рестораны по улицам  -->

      <!-- (IF) Если на странице не предусмотрен SEO-текст не выводим его -->
      <!--SEO текст -->
      <!--SEO текст -->

  <!-- SEO блок -->
  <client-only>
    <div class="basket-home-btn" v-show="this.getTotalPrice > 0">
      <v-btn block color='primary' class="basket-home-btn__box d-flex flex-row justify-space-between rounded-xl" height="60px" @click="goToRestuarant()">
            <span class="basket-home-btn__name">
                {{this.restInfo ? this.restInfo.restName : ''}}
            </span>
        <span class="basket-home-btn__price">
                {{this.getTotalPrice}} BYN
            </span>
      </v-btn>
    </div>
  </client-only>

</div>
</template>

<script>
import setAdress from '~/components/setAdress'
import categories from '~/components/categories.vue'
import specialOffers from '~/components/specialOffers.vue'
import restuarantsList from '~/components/restuarants-list.vue'
import restuarantsSpecialOffersList from '~/components/restuarants-special-offers-list.vue'
import ApiService from "~/common/api.service";
import axios from 'axios'
import * as Cookie from 'js-cookie'

import {
    mapGetters,
  mapActions
} from 'vuex'

export default {
    name: 'city',
    components: {
        categories,
        specialOffers,
        restuarantsList,
        restuarantsSpecialOffersList,
        setAdress
    },
    data() {
        return {
            showSetAdress: true,
            rest: [],
            categoryInfoData: null,
            currentZone: null,
            restName: '',
            totalPrice: 0,
        }
    },
    async asyncData({
        app,
        context,
        store,
        params,
        req,
        redirect,
    }) {

        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data;
        store.dispatch('zone/setZone', zoneListData);

        let currentZone = zoneListData.find((zones) => {
            return zones.alias == params.region
        });
        if (currentZone !== undefined) {
            store.dispatch('zone/setSelectedZone', currentZone)
        } else {
            redirect('/')
        }

        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: currentZone.id
        });

        let categoriesListData = categoriesList.data;

        store.dispatch('user/allCategory', categoriesListData);
        let categoryAll = [{
            name: 'Все',
            id: 0,
            alias: 'all'
        }];

        let currentCategory = categoriesListData.find((category) => {
            return category.alias == params.alias
        });

        let categoryInfo;
        let categoryInfoData;

        if (currentCategory !== undefined) {
            categoryInfo = await axios.post('https://yestapi.xyz/categories/info', {
                zone_id: currentZone.id,
                category_id: currentCategory.id
            });

            if (categoryInfo.status != 404) {
                categoryInfoData = categoryInfo.data
                if (categoryInfoData.background == '') {
                    categoryInfoData.background = 'https://yastatic.net/s3/eda-front/prod-www/assets/default-d3a889e26c9ac9089ce5b007da1ac51b.png'
                }
                app.categoryInfoData = categoryInfoData
            } else {
                categoryInfoData = {
                    header: 'Быстрая доставка',
                    city: currentZone.accusative,
                    background: 'https://yastatic.net/s3/eda-front/prod-www/assets/default-d3a889e26c9ac9089ce5b007da1ac51b.png',
                    category_icon: 'https://menu-menu.by/images/category_background/mobile/pizza.jpg',
                    meta: {
                        title: currentZone.seo.title,
                        description: currentZone.seo.description,
                        keywords: currentZone.seo.keywords,
                    }
                }
            }
            store.dispatch('user/setActiveCategoryInfoData',categoryInfoData);
            store.dispatch('user/selectCategory', currentCategory)
        } else {
            if (params.alias) {
                redirect(`/${currentZone.alias}`)
            } else {
                categoryInfoData = {
                    header: 'Быстрая доставка',
                    city: currentZone.accusative,
                    background: 'https://yastatic.net/s3/eda-front/prod-www/assets/default-d3a889e26c9ac9089ce5b007da1ac51b.png',
                    category_icon: 'https://menu-menu.by/images/category_background/mobile/pizza.jpg',
                    meta: {
                        title: currentZone.seo.title,
                        description: currentZone.seo.description,
                        keywords: currentZone.seo.keywords,
                    }
                };
                currentCategory = categoryAll[0];
                store.dispatch('user/selectCategory', currentCategory)
            }
        }

    // Определение широты и долготы пользователя
    let latitude
    let longitude
    if (process.server) {
        if (req.headers.cookie) {

            if (req.headers.cookie.indexOf('latitude') > 0 && req.headers.cookie.indexOf('longitude') > 0) {
                latitude = await getCookie('latitude', req.headers.cookie)
                longitude = await getCookie('longitude', req.headers.cookie)

                function getCookie(cookieName, stringCookie) {
                    let strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie)[0]
                    return unescape(strCookie ? strCookie.toString().replace(/^[^=]+./, '') : '')
                }
            } else {
                latitude = undefined;
                longitude = undefined;
            }
        }
    }
    // КОНЕЦ Определение широты и долготы пользователя

    // Получение списка всех ресторанов в зоне по категории
    let sortByCoord = {};
    if (latitude == undefined && longitude == undefined) {
        sortByCoord = {
            zone_id: currentZone.id,
            limit: 1000,
            start: 0,
        }
    } else {
        sortByCoord = {
            zone_id: parseInt(currentZone.id),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            start: 0,
            limit: 1000
        }
    }

    let restaurantsList;
    let checkCatId = currentCategory ? currentCategory.id : 0;
    let restaurantsListData;

    if (checkCatId === 0) {
        restaurantsList = await axios.post('https://yestapi.xyz/restaurants', sortByCoord);
        restaurantsListData = restaurantsList.data.restaurants
    } else {
        restaurantsList = await axios.post(`https://yestapi.xyz/restaurants/category/${currentCategory.id}`, sortByCoord)
        restaurantsListData = restaurantsList.data.restaurants
    }

    // Конец получения всех ресторанов в городе по категории

    // Фильтрация ресторанов по режиму работы
    let filtByTime;
    if (restaurantsList.data.status == 404) {
        restaurantsListData = [404]
    } else {
        filtByTime = await store.dispatch('user/caclWorkTime', restaurantsListData)
    }
    // Конец фильтрации ресторанов по режиму работы


    // Получение специальных предложений
    let specialOffer;
    let specialOfferData;
    let showSpecialOffer;

      specialOffer = await axios.post('https://yestapi.xyz/restaurants/special-offers', {
          zone_id: parseInt(currentZone.id),
      });
      specialOfferData = specialOffer.data
      if (specialOfferData.length == 0) {
          showSpecialOffer = false
      } else {
          showSpecialOffer = true
      }
      // Конец получения специальных предложений

      let SpecialOfferRestaurants_list = [];
      let SpecialOfferRestaurants = [];

      if (checkCatId === 0) {
        SpecialOfferRestaurants_list = await axios.post('https://yestapi.xyz/restaurants/restaurants-special-offers/', sortByCoord);
        if(SpecialOfferRestaurants_list.data.status === 200){
          SpecialOfferRestaurants = SpecialOfferRestaurants_list.data.restaurants
        }
      } else {
        SpecialOfferRestaurants_list = await axios.post(`https://yestapi.xyz/restaurants/restaurants-special-offers/category/${currentCategory.id}`, sortByCoord)
        if(SpecialOfferRestaurants_list.data.status === 200){
          SpecialOfferRestaurants = SpecialOfferRestaurants_list.data.restaurants
        }
      }

      if(SpecialOfferRestaurants.length > 0){
        SpecialOfferRestaurants = await store.dispatch('user/calcWorkTime_onlyOpen', SpecialOfferRestaurants);
      }


      return {
          restaurantsList: filtByTime,
          SpecialOfferRestaurants: SpecialOfferRestaurants,
          categoriesList: categoryAll.concat(categoriesListData),
          currentCategory: currentCategory,
          categoryInfoData: categoryInfoData,
          currentZone: currentZone,
          specilaOffers: specialOfferData,
          showSpecialOffer: showSpecialOffer,
      }
    },
  methods: {
    ...mapActions({
      Action__calcWorkTime: 'user/caclWorkTime',
      calcWorkTime_onlyOpen: 'user/calcWorkTime_onlyOpen'
    }),
    goToRestuarant() {
      this.$router.push(`/${this.restInfo.params.region}/restaurant/${this.restInfo.params.resName}`)
    },
    async getSpecialOffer() {
      await axios.post('https://yestapi.xyz/restaurants/special-offers', {
        zone_id: parseInt(this.getSelectedZone.id),
        latitude: parseFloat(this.getCurrentCoords[0]),
        longitude: parseFloat(this.getCurrentCoords[1]),
      }).then((res) => {
        if (res.data.length == 0) {
          this.showSpecialOffer = false
        } else {
          this.showSpecialOffer = true
          this.specilaOffers = res.data
        }
      })
    },
    async getRestList() {
      var sortByCoord = {}
      if (this.getCurrentCoords.length > 0) {
        sortByCoord = {
          zone_id: parseInt(this.getSelectedZone.id),
          latitude: parseFloat(this.getCurrentCoords[0]),
          longitude: parseFloat(this.getCurrentCoords[1]),
          start: 0,
          limit: 10000
        }
      } else {
        sortByCoord = {
          zone_id: this.getSelectedZone.id,
          limit: 10000,
          start: 0,
        }
      }

      let url;
      if (this.getSelectedCategory.id == 0) {
        url = 'https://yestapi.xyz/restaurants'
      } else {
        url = `https://yestapi.xyz/restaurants/category/${this.getSelectedCategory.id}`
      }

      let rest = await axios.post(`${url}`, sortByCoord).then((res) => {
        return res.data.restaurants
      });

      let SpecialOfferRestaurants_list = [];
      let SpecialOfferRestaurants = [];

      if (this.getSelectedCategory.id === 0) {
        SpecialOfferRestaurants_list = await axios.post('https://yestapi.xyz/restaurants/restaurants-special-offers/', sortByCoord);
        if(SpecialOfferRestaurants_list.data.status === 200){
          SpecialOfferRestaurants = SpecialOfferRestaurants_list.data.restaurants
        }
      } else {
        SpecialOfferRestaurants_list = await axios.post(`https://yestapi.xyz/restaurants/restaurants-special-offers/category/${this.getSelectedCategory.id}`, sortByCoord)
        if(SpecialOfferRestaurants_list.data.status === 200){
          SpecialOfferRestaurants = SpecialOfferRestaurants_list.data.restaurants
        }
      }

      if(SpecialOfferRestaurants.length > 0){
        this.SpecialOfferRestaurants = await this.calcWorkTime_onlyOpen(SpecialOfferRestaurants);
      }else {
        this.SpecialOfferRestaurants = [];
      }

      this.restaurantsList = await this.Action__calcWorkTime(rest);
    }
  },
    watch: {
        getCurrentCoords(newValue, oldValue) {
            this.getSpecialOffer()
            this.getRestList()
            if (window.innerWidth < 450) {
                if (newValue.length > 0) {
                    this.showSetAdress = false
                } else {
                    this.showSetAdress = true
                }
            }
        },
        restaurantsList(newValue) {
            return newValue
        },
        selectedCategory(newValue){
          this.currentCategory = newValue;
          // Обновить данные о ресторанах
          this.getRestList();
          // Обновить данные о специальных предложениях
        },
        getActiveCategoryInfoData(newValue){
            this.categoryInfoData = newValue
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: 'zone/getSelectedZone',
            getZoneList: 'zone/getZoneList',
            getCategoryList: 'user/getCategoryList',
            selectedCategory: 'user/getSelectedCategory',
            getSelectedCategory: 'user/getSelectedCategory',
            getCurrentCoords: 'map/getCurrentCoords',
            getCurrentAddress: "map/getCurrentAddress",
            getLatetestRestInfoWithOrder: "basket/getLatetestRestInfoWithOrder",
            getTotalPrice: "basket/getTotalPrice",
            getActiveCategoryInfoData: 'user/getActiveCategoryInfoData'
        })
    },
    created() {
        this.$store.dispatch('zone/setSelectedZone', this.currentZone);
        this.$store.dispatch('user/selectCategory', this.currentCategory);
        if (this.getLatetestRestInfoWithOrder) {
            this.restInfo = this.getLatetestRestInfoWithOrder
        }
    },
    mounted() {
        window.scrollTo(0, 0);
        if (this.getCurrentAddress.length > 0) {
            this.getSpecialOffer()
        }
        setTimeout(() => {
            if (window.innerWidth < 992) {
                document.getElementById('bgImg').setAttribute('style', 'background-image: url("' + this.categoryInfoData.category_icon + '");')
            } else {
                document.getElementById('bgImg').setAttribute('style', 'background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))), url("' + this.categoryInfoData.background + '");')
            }
        }, 200);
        let lastScrollTop = 0
        if (window.innerWidth < 992) {
            if (this.getCurrentAddress.length > 0) {
                this.showSetAdress = false
            } else {
                this.showSetAdress = true
            }
        }
    },
    head() {
        return {
            title: this.categoryInfoData.meta.title !== undefined ? this.categoryInfoData.meta.title : 'Все',
            meta: [{
                    hid: 'description',
                    name: 'description',
                    content: this.categoryInfoData.meta.description !== undefined ? this.categoryInfoData.meta.description : ''
                },
                {
                    hid: 'keywords',
                    name: 'keywords',
                    content: this.categoryInfoData.meta.keywords !== undefined ? this.categoryInfoData.meta.keywords : ''
                },
            ]
        }
    },
}
</script>

<style scoped>
.basket-home-btn {
    display: none;
}

@media screen and (max-width: 992px) {
    .basket-home-btn {
        display: flex;
        position: fixed;
        z-index: 3;
        bottom: 0;
        width: 100%;
        background: #fff;
        padding: 16px 16px 26px;
        box-shadow: 0 -4px 8px 0 rgba(0, 0, 0, 0.05);
    }

    .basket-home-btn__box {
        border-radius: 16px !important;
        display: flex;
        height: 56px !important;
        justify-content: space-between;
        text-transform: initial;
        font-size: 16px;
    }

    .basket-home-btn__name {
        font-size: 16px;
        letter-spacing: 0.1px;
        text-transform: initial;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .basket-home-btn__price {
        color: #fff;
    }
}
</style><style>
html {
    overflow-x: hidden !important;
}

.home-container {
    position: relative;
    z-index: 1;
}

.hide {
    display: flex !important;
}

@media screen and (max-width: 992px) {

    .hide {
        display: none !important;
    }
}
</style>
