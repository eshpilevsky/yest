<template>
<div>
    <div class="desktop-mode">
        <div class="rest-cotainer">
            <div xl8 class="left">
                <div class="left-top" :style="{backgroundImage:'url(https://img.eatmealby.com/resize/restaurant/900/'+restuarant.background_image+')'}">
                    <div class="top-wrapper">
                        <div class="rating">
                            <v-chip color="primary">
                                <v-icon color="#FFFADF">star</v-icon>
                                <div>{{restuarant.rating ? restuarant.rating: 'Мало оценок'}}</div>
                            </v-chip>
                            <div class="info-delivery white--text">
                                Доставка еды • {{this.getSelectedZone.name}}
                            </div>
                            <h1 class="restuarant-name white--text pb-3">
                                {{restuarant.name}}
                            </h1>
                            <v-divider dark />
                            <v-row cols12>
                                <v-col :md='6' class="white--text info-left">
                                    <div class="moped-block">
                                        <div class="moped"></div>
                                        <div class="treangule"></div>
                                    </div>
                                    <div class="restuarants-description pl-2">
                                        <div class="description-who">
                                            Доставка Yest.by
                                        </div>
                                        <div class="description-price ">
                                            Доставка {{restuarant.delivery.fee[restuarant.delivery.fee.length -1].deliveryFee}}-{{restuarant.delivery.fee[1].deliveryFee}} BYN. Бесплатно при заказе от {{restuarant.delivery.fee[restuarant.delivery.fee.length -1].min}} BYN
                                        </div>
                                    </div>
                                </v-col>
                                <v-col :md='3' class="white--text">
                                    <p>
                                        Заказ от
                                    </p>
                                    <p>
                                        {{restuarant.delivery.fee[0].min}}
                                    </p>
                                </v-col>
                                <v-col :md='3' class="white--text">
                                    <v-menu bottom origin="center center" transition="scale-transition" nudge-left='100' nudge-bottom='60'>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn color="primary" large v-bind="attrs" v-on="on">
                                                <p class="info-btn-text">
                                                    Информация о <br /> ресторане
                                                </p>
                                                <v-icon>info</v-icon>
                                            </v-btn>
                                        </template>
                                        <div>
                                            <div class="treangle"></div>
                                            <v-card max-width='460' class="restuarants-legal-info">
                                                <div class="pa-3">
                                                    <h3>
                                                        {{restuarant.name}}
                                                    </h3>
                                                    <div>
                                                        <ul>
                                                            <li v-for="branch in restuarant.branch">
                                                                {{branch.address}}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <span v-for="tag in restuarant.tags">
                                                            {{tag.name}}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        Исполнитель (продавец): {{restuarant.legal_info.business_firm_name}}, {{restuarant.legal_info.business_address}}, УНП {{restuarant.legal_info.business_unp}}.
                                                    </div>
                                                    <div>
                                                        Режим работы ресторана: с 09:00 до 21:00
                                                    </div>
                                                </div>
                                            </v-card>
                                        </div>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </div>
                <div class="catalog">
                    <v-tabs v-model="tab" class="catalog-tabs" center-active>
                        <v-tab height="70px" v-for="(category, index) in restuarant.menu" :key="category.cat_id" @click="scroll(`${index}`)">
                            {{category.name}}
                        </v-tab>
                    </v-tabs>
                    <v-divider />
                </div>
                <div class="catalog-list">
                    <div v-for="(category, index) in restuarant.menu" :key="category.cat_id">
                        <div class="category-title">
                            <h2 v-intersect="categoryNameIntersect" :id='`${index}`'>
                                {{category.name}}
                            </h2>
                            <span class="category-list-counter">
                                {{category.dishes.length}}
                            </span>
                        </div>
                        <div class="dishs-list">
                            <div v-for="(item, index2) in category.dishes" :key="`dishCard${index2}`" class="dishs-list-item" @click="addToBasket(item)">
                                <cardDish :name='item.name' :description='item.description' :img='item.image' :dishinfo='item.sizes' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div cols-2 xl8 class="right">
                <div class="right-my-order">
                    <div class="my-order-top">
                        <div class="order-title">
                            <p>
                                Мой заказ
                            </p>
                            <v-icon v-show="this.getSelectedDishs.length > 0" @click="dropBasket()">
                                delete_forever
                            </v-icon>
                        </div>
                        <div v-if="this.getSelectedDishs.length > 0" class="my-order-dishes-desktop">
                            <div v-for="order in this.getSelectedDishs" :key="order.id" class="order-item">
                                <div class="d-flex flex-column order-item-info">

                                        <div class="item-name">
                                        {{order.name}}
                                        </div>


                                    <div class="order-item-weight">
                                        {{order.sizes[0].weight}}
                                    </div>
                                </div>
                                <div class="d-flex flex-column my-counter">
                                    <div class="counter-plus" @click="increment(order.id)">
                                        <v-icon>
                                            add
                                        </v-icon>
                                    </div>
                                    <div class="counter-count">
                                        {{order.counter}}
                                    </div>
                                    <div class="counter-minus" @click="decrement(order.id)">
                                        <v-icon>
                                            remove
                                        </v-icon>
                                    </div>
                                </div>
                                <div class="pl-4">
                                    {{order.sizes[0].price}} BYN
                                </div>
                            </div>
                        </div>
                        <div v-else class="my-order">
                            <span class="my-order-text">
                                Выберите блюда и добавьте их к заказу
                            </span>
                        </div>
                    </div>
                    <div class="my-order-bottom">

                        <div class="total-price">
                            <p class="total-title">Итого</p>
                            <p class="price">{{this.getTotalPrice}} BYN</p>
                        </div>
                    </div>
                </div>
                <v-btn :disabled="this.getTotalPrice <= 0" color="primary" class="desctop_btn_confirm_order">Оформить заказ</v-btn>
            </div>
            <v-overlay z-index="999" v-model="showOptionsmenu">
                <v-card width="50vw" class="select-option-card">
                    <div class="d-flex flex-row justify-space-between">
                        <div class="select-option-title" color="secondary">
                            Выберите опции
                        </div>
                        <div class="close-select-option" @click="closeOptionMenu()">
                            <v-icon color="#000">close</v-icon>
                        </div>
                    </div>
                    <div class="options-list">
                        <div class="sizes">
                            <div class="multi-title">
                                РАЗМЕР НА ВЫБОР
                            </div>
                            <v-radio-group v-model="sizesRadioBtn" :mandatory="false" class="d-flex flex-row">
                                <v-radio v-for="size in this.selectedDish.sizes" :key="size.id" :label="size.name" :value="size.id" color="primary"></v-radio>
                            </v-radio-group>
                        </div>
                        <div class="options">
                            <div class="multi-title">
                                ДОПОЛНИТЕЛЬНЫЕ ИНГРЕДИЕНТЫ
                            </div>
                            <div v-for="option in this.selectedDish.options" :key="option.id" class="d-flex flex-column justify-start">
                                <div>
                                    {{option.title}}
                                </div>
                                <div class="d-flex flex-row justify-start align-center">
                                    <v-checkbox v-for="option in option.variants" :key="option.id" v-model="selected" :label="option.name" :value="option.dish_option_id" color="primary"></v-checkbox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <v-btn color="primary">Добавить</v-btn>
                        </div>
                        <div>
                            <div>
                                <v-icon>
                                    add
                                </v-icon>
                                {{this.selectedDish.counter}}
                                <v-icon>
                                    remove
                                </v-icon>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-overlay>
        </div>
    </div>
    <div class="mobile-mode">
        <div class="mobile-mode_header">
            <v-icon @click="goBack()">arrow_back</v-icon>
            <v-icon>search</v-icon>
        </div>
        <div class="mobile-rest-info">

          <div class="rest-info-content">
            <div class="rest-info-top">
              <h1 class="info-top-title">
                {{restuarant.name}}
              </h1>
              <v-icon>info</v-icon>
            </div>
            <div class="rest-info-center">
              <v-chip @click="showRatingSheet = !showRatingSheet" :color="showRatingSheet == true ? 'primary': null" class="rest-info-center-block-tag">
                <v-icon>star</v-icon>
                {{restuarant.rating ? restuarant.rating: 'Мало оценок'}}
              </v-chip>
              <!-- add to next line v-if="this.getCurrentCoords.length > 0"-->
              <!-- <v-chip>
                  {{restInfo.deliveryTime.min}} - {{restInfo.deliveryTime.max}} мин
              </v-chip> -->
              <!-- add to next line v-if="this.getCurrentCoords.length > 0"-->
              <v-chip @click="showDeliveryOption = !showDeliveryOption" :color="showDeliveryOption == true ? 'primary': null" class="rest-info-center-block-tag">
                Доставка 10 - 20 мин.
              </v-chip>
              <v-bottom-sheet v-model="showRatingSheet">
                <v-sheet>
                  <div class="sheet-top">
                    <h2 class="sheet-top-title">Рейтинг</h2>
                    <v-icon>close</v-icon>
                  </div>
                  <div class="rating-info-bottom">
                    {{restuarant.rating ? restuarant.rating : 'Мало оценок'}}
                  </div>
                </v-sheet>
              </v-bottom-sheet>
              <v-bottom-sheet v-model="showDeliveryOption">
                <v-sheet>
                  <div class="sheet-top">
                    <h2 class="sheet-top-title">Условия доставки</h2>
                    <v-icon>close</v-icon>
                  </div>
                  <div class="delivery-info">
                    <v-icon>
                      directions_walk
                    </v-icon>
                    <div>
                      Доставка {{restuarant.delivery.fee[restuarant.delivery.fee.length -1].deliveryFee}}-{{restuarant.delivery.fee[1].deliveryFee}} BYN. Бесплатно при заказе от {{restuarant.delivery.fee[restuarant.delivery.fee.length -1].min}} BYN
                    </div>
                    <div>
                      Заказ от: {{restuarant.delivery.fee[0].min}} BYN
                    </div>
                  </div>
                </v-sheet>
              </v-bottom-sheet>
            </div>
          </div>

            <div class="rest-info-bottom">
                <v-tabs v-model="tab" class="catalog-tabs catalog-tabs-mobile">
                    <v-tab v-for="(category, index) in restuarant.menu" :key="category.id" @click="scroll(`${index}`)" class="catalog-tab-mobile-container">
                        <v-chip>
                            {{category.name}}
                        </v-chip>
                    </v-tab>
                </v-tabs>
            </div>
            <div class="mobile-catalog">
                <div v-for="(category, index) in restuarant.menu" :key="category.id">
                    <h2 v-intersect="categoryNameIntersect" :id="`${index}`" class="category-title">
                        {{category.name}}
                    </h2>
                    <div class="dishs-list-mobile">
                        <div v-for="(item, index2) in category.dishes" :key="`dishCard${index2}`" class="dishs-list-mobile-item" @click="showSelectedDish(item)">
                            <v-card class="dish-card">


                              <div class="card-dish-top">
                                <v-img cover :src="'https://img.eatmealby.com/resize/dish/400/'+item.image" lazy-src='https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg' :alt="item.name" class="dish-img-mobile" />
                              </div>
                                <div class="card-dish-bottom">
                                  <div class="dish-name-container">
                                    <h3 class="dish-name">
                                        {{item.name}}
                                    </h3>
                                  </div>

                                    <div class="dish-info">
                                      <div class="info-weight">
                                        {{item.sizes[0].weight}}
                                      </div>

                                    </div>
                                  <div class="info-price">
                                    {{item.sizes[0].price}} BYN
                                  </div>
                                </div>
                            </v-card>

                        </div>
                    </div>
                    <v-bottom-sheet v-model="showDish" z-index='999'>
                        <v-sheet>
                            <div class="selected-dish-top">
                                <v-img :src="'https://img.eatmealby.com/resize/dish/400/'+selectedDish.image" lazy-src='https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg' :alt="selectedDish.name" class="dish-img-mobile" />
                            </div>
                            <div class="selected-dish-composition">
                                {{selectedDish.description}}
                            </div>
                            <div class="d-flex flex-row justify-space-between">
                                <div class="dish-bottom-name">
                                    {{selectedDish.name}}
                                </div>
                                <div class="dish-bottom-price">
                                    <!-- {{selectedDish.sizes[0].price}} BYN -->
                                </div>
                            </div>
                            <div class="d-flex flex-row justify-space-between m-5 pa-5">
                                <div class="d-flex flex-row counter-component">
                                    <v-icon @click="selectedDish.counter--">
                                        <!-- <v-icon > -->
                                        remove
                                    </v-icon>
                                    {{selectedDish.counter}}
                                    <!-- 1 -->
                                    <v-icon @click="selectedDish.counter++">
                                    <!-- <v-icon> -->
                                        add
                                    </v-icon>
                                </div>
                                <div class="add-btn">
                                    <v-btn color="primary" @click="addToBasketMobile()">Добавить</v-btn>
                                </div>
                            </div>
                        </v-sheet>
                    </v-bottom-sheet>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import ApiService from "../common/api.service";
import MapBtn from '@/components/map-btn'
import cardDish from '@/components/cardDish'
import axios from 'axios'

import {
    mapGetters
} from "vuex";
export default {
    name: 'restaurants',
    components: {
        MapBtn,
        cardDish,
    },
    async asyncData({
        app,
        context,
        store,
        params
    }) {
        console.log('START REST ASYNC');
        let restParams = params.resName
        let id = restParams.split('-')
        var currentZone = store.getters['zone/getSelectedZone']
        let restuarant = await axios.post(`https://yestapi.xyz/restaurant/${id[0]}`, {
            zone_id: currentZone.id,
        })
        console.log('restuarant', restuarant.data)

        return {
            restuarant: restuarant.data
        }
    },
    data() {
        return {
            tab: null,
            showRatingSheet: false,
            showDeliveryOption: false,
            selectedDish: {
                sizes: [],
            },
            showDish: false,
            dishCounter: 1,
            showOptionsmenu: false,
            sizesRadioBtn: '',
            selected: [],
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: "zone/getSelectedZone",
            getSelectedCategory: "user/getSelectedCategory",
            getCurrentCoords: "map/getCurrentCoords",
            getUserLocation: "user/getUserLocation",
            getSelectedDishs: "basket/getSelectedDishs",
            getTotalPrice: "basket/getTotalPrice",
        }),
    },
    watch: {
        getSelectedDishs(newValue) {
            return newValue
        },
        getTotalPrice(newValue) {
            return newValue
        },
        dishCounter(newValue) {
            return newValue
        },
        tab(newValue) {
            return newValue
        },
        '$route.params.region': function () {
            this.$router.push(`/${this.getSelectedZone.alias}`)
        }
    },
    methods: {
		goBack(){
			this.$router.go(-1)
		},
        addToBasketMobile() {
            this.showDish = false
        },
        closeOptionMenu() {
            this.showOptionsmenu = false
        },
        decrement(id) {
            this.$store.dispatch('basket/decrementDishCounter', id);
        },
        increment(id) {
            this.$store.dispatch('basket/incrementDishCounter', id);
        },
        dropBasket() {
            this.$store.dispatch('basket/dropBasket');
        },
        addToBasket(dish) {
            console.log('addToBasket -> dish', dish)
            this.selectedDish = dish
            dish.counter = 1
            if (dish.sizes.length > 1 || dish.options.length > 1) {
                this.showOptionsmenu = true
                this.sizesRadioBtn = dish.sizes[0].id
            } else {
                this.showDish = false
                this.$store.dispatch('basket/addToBasket', dish);
            }
        },
        showSelectedDish(dish) {
            console.log('showSelectedDish -> dish', dish)
            dish.counter = 1
            this.selectedDish = dish
            setTimeout(() => {
                this.showDish = true
            }, 100);
        },
        scroll(id) {
            console.log('scroll -> document.getElementById(id)', document.getElementById(id))
            document.getElementById(id).scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
            this.tab = id
            console.log('scroll -> this.tab', this.tab)
        },
        categoryNameIntersect(entries, observer) {
            this.tab = parseInt(entries[0].target.id, 10)
        }
    }
}
</script>

<style>
  @media screen and (min-width: 992px){
    .v-tabs-bar {
      height: 70px !important;
    }
  }
  @media screen and (max-width: 992px){
    .v-slide-group__prev, .v-slide-group__next{
      display: none!important;
    }
    .catalog-tab-mobile-container{
      color: #21201F;
      height: 36px;
      opacity: 0.4;
      padding: 0 14px;
      display: flex;
      font-size: 15px;
      max-width: 80vw;
      box-sizing: border-box;
      line-height: 36px;
      white-space: nowrap;
      align-items: center;
      transition-property: opacity;
      transition-duration: 200ms;
      background: #ffffff;
    }
    .v-tab--active.catalog-tab-mobile-container{
      opacity: 1;
      height: 36px;
      position: absolute;
      border-radius: 16px;
      background-color: #F1F0ED;
      transition-property: width;
      transition-duration: 200ms;
    }
  }

.v-application p {
    margin-bottom: 0 !important;
}
</style><style scoped>
  .rest-info-content{
    padding:  0 16px 16px 16px;
    background: #fff;
    border-bottom: 10px solid #fafafa;
  }
  .catalog-tabs {
    z-index: 0;
  }

.right-my-order .my-order {
    flex: auto;
}

.my-order-top {
    display: contents;
}

.my-order-dishes-desktop {
    flex: auto;
}

.desctop_btn_confirm_order {
    width: 100%;
    font-weight: 900;
    letter-spacing: inherit;
}

.dish-bottom-name {
    color: #000000;
    line-height: 1.25;
    padding: 20px;
}

.options-list {
    background: #fafafa;
    padding: 0 20px;
    margin: 0 -20px;
}

.select-option-card {
    background: #f5f5f5 !important;
    color: #000 !important;
    padding: 20px;
}

.multi-title {
    color: #b0b0b0;
    font-size: 14px;
}

.close-select-option {
    cursor: pointer;
}

.select-option-title {
    font-size: 24px;
    font-weight: bold;
    line-height: 36px;
}

.counter-count {
    display: flex;
    align-items: center;
    justify-content: center;
}

.my-counter:hover .counter-count,
.my-counter:hover .counter-plus,
.my-counter:hover .counter-minus {
    display: flex;
    border: .5px solid rgb(176, 176, 176);
    background: #f2f2f2;
}

.counter-plus,
.counter-minus {
    display: none;
    cursor: pointer;
}

.order-item-info {
    flex: 1 1 60%;
}

.order-item-weight {
    color: #b0b0b0;
    font-size: 12px;
    white-space: nowrap;
}

.order-item {
    padding: 0 20px;
    font-size: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.price {
    font-size: 25px;
}

.total-title {
    color: #b0b0b0;
    font-size: 14px;
}

.total-price {
    border-top: 1px solid rgba(0, 0, 0, .05);
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-items: center;
    padding: 10px 0;
}

.my-order-text {
    color: #b0b0b0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    /*padding-top: 80%;*/
    margin: auto;
    text-align: center;
}

.right-my-order {
    height: calc(100vh - 145px);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #f2f2f2;
    border-radius: 5px;
    margin-bottom: 10px;
}

.order-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
}

.order-title p {
    font-size: 20px;
    font-weight: bold;
    margin-right: auto;
}

.left {
    width: calc(100% - 320px);
    border: 1px solid #d5d5d5;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.counter-component {
    border: solid 1px #f5f5f5;
    display: flex;
    padding: 13px 20px;
    align-items: center;
    margin-right: 5px;
    justify-content: center;
    background-color: #ffffff;
}

.selected-dish-composition {
    padding: 16px;
    font-size: 14px;
    background: #fafafa;
    line-height: 22px;
}

.rest-info-bottom {
    position: sticky;
    top: 0px;
    z-index: 999;
}

.dish-img-mobile {
    width: 100%;
    height: 167px;
}



.card-dish-bottom {
    display: flex;
    flex-direction: column;
}

.dish-name {
  color: #21201F;
  display: -webkit-box;
  overflow: hidden;
  font-size: 16px;
  text-align: center;
  word-break: break-word;
  line-height: 19px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.dish-info {
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.info-price {
  color: #3f3f3f;
  font-size: 14px;
  font-weight: 600;
  height: 48px;
  display: flex;
  transition: opacity, background-color 100ms;
  align-items: center;
  border-radius: 16px;
  align-content: center;
  justify-content: center;
  background-color: #F1F0ED;
  margin: 0 9px 8px;
}

.info-weight {
  color: #c2c0be;
  font-size: 13px;
  text-align: center;
  display: block;
  margin: auto;
}

.dish-card {
  flex: 0 1 calc(50% - 11px * 1.5);
  /*height: 296px;*/
  display: block;
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  box-shadow: 0px 8px 20px rgba(117, 115, 111, 0.2);
  border-radius: 24px!important;
}

.delivery-info div {
    padding-left: 10px;
}

.delivery-info {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    padding: 20px;
}

.rating-info-bottom {
    color: #3f3f3f;
    font-size: 36px;
    font-weight: bold;
    padding-left: 16px;
}

.sheet-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 0 16px;
}

.sheet-top-title {
    flex: 0 0 auto;
    padding: 20px 0px;
    font-size: 20px;
    min-height: 24px;
    box-sizing: content-box;
    line-height: 24px;
    font-weight: bold;
    padding-right: 80px;
    border-bottom: 1px solid rgba(0, 0, 0, .05);
}

.rest-info-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;
}

.mobile-mode_header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 5;
  background: #ffffff;
  padding-top: 8px;
  display: flex;
  padding: 0 8px;
  align-items: center;
  justify-content: space-between;
}

.desktop-mode {
    display: flex;
}

.mobile-mode {
    display: none;
}

.restuarants-legal-info {
    position: relative !important;
    z-index: 101 !important;
}

.category-list-counter {
    color: #b0b0b0;
    margin-left: 10px;
}

.category-title h2 {
    font-size: 24px;
}

.category-title {
  color: #3F3F3F;
  font-size: 28px;
  line-height: 33px;
  font-weight: bold;
  display: flex;
  position: relative;
  padding-top: 27px;
  align-items: center;
  padding-left: 24px;
  padding-right: 24px;
  flex-direction: row;
}

.treangle {
    border-left: 5px solid transparent;
    border-right: 155px solid transparent;
    border-bottom: 50px solid white;
}

.catalog {
    position: sticky;
    top: 80px;
    z-index: 10;
}

.dishs-list-item {
    width: calc(50% - 20px);
    margin: 10px;
}

.dishs-list-mobile {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
	  /*padding-left: 10px;*/
}

.dishs-list-mobile-item {
    margin: 5px;
    max-width: calc((100% - 20px)/2);
}
@media screen and (min-width: 500px){
  .dishs-list-mobile-item {
  max-width: calc((100% - 30px)/3);
  }
}

  @media screen and (min-width: 620px){
    .dishs-list-mobile-item {
    max-width: calc((100% - 40px)/4);
    }
  }

  @media screen and (min-width: 850px){
    .dishs-list-mobile-item {
    max-width: calc((100% - 50px)/5);
    }
  }

  @media screen and (min-width: 992px) {
    .dishs-list-mobile-item {
    max-width: calc((100% - 60px) / 6);
    }
  }

.dishs-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.card {
    height: 100px;
    width: 100px;
}

.catalog-list {
    /*border: solid 1px #eeeeee;*/
    padding: 25px 80px;
    background: #f2f2f2;
    border-top: none;
    background-image: linear-gradient(to bottom, #ffffff, #f2f2f2 480px);
}

.info-btn-text {
    margin: 10px;
}

.description-who {
    font-size: 14px;
}

.description-price {
    font-size: 16px;
}

.info-left {
    display: flex;
    flex-direction: row;
}

.moped-block {
    width: 37px;
    height: 42px;
    position: relative;
}

.treangule {
    top: 6px;
    right: -7px;
    width: 30px;
    height: 30px;
    z-index: 1;
    position: absolute;
    transform: scaleX(0.4) rotate(45deg);
    background-color: #fce000;
    border-top-right-radius: 4px;
}

.moped {
    background-color: #fce000;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    width: 24px;
    height: 24px;
    padding: 9px 0;
    z-index: 2;
    position: relative;
    box-sizing: content-box;
    margin-left: 5px;
    background-size: 100%;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMjB2MjBIMHoiLz48ZyBzdHJva2U9IiMwMDAiPjxwYXRoIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik04Ljg1NyA5LjE0M2MwIC43Ni0xLjE0MyAxLjQ1NS0xLjE0MyAyLjU0NyAwIC42Mi40OTkuODEgMS4xNDMuODFIMTBjMS4xMjYgMCA2LjA4LTQuNTQyIDUuMTQyLTYuOTkiLz48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNi4xODkgMTMuNDFhMS43MTQgMS43MTQgMCAxIDEtMy4xODkuODc1YzAtLjE4Mi4xMzItLjYxNy4zMzMtLjc5OCIvPjxwYXRoIGQ9Ik0xMy4wMTUgNC4wMDVjMi43NzQuMDM1IDQuODI1IDcuNDg5IDQuODI1IDkuMDgxIDAgLjI5Ni0uMTg4LjU3NC0uNTYzLjgzNS0uNjcyLS42MTQtLjg3My0uNTA5LTEuMTYyLS41MDltLTMuMS42OTRjLS4yODIuNDYyLTIuODI1LjM5My0zLjI1Mi4zOTRNOC42ODYgOS42MDVMNC40NSA5LjQ4N2EuNzM2LjczNiAwIDAgMS0uNzM3LS43MzZ2LS4xOTRjMC0uNDI1LjM5LTEuMTA2LjgxNC0xLjA4bDMuOTY5LjU1MWMuMzg4LjAyNS40NzcuMzguNDc3Ljc3IDAgLjQwNy4xMTkuODA3LS4yODguODA3eiIvPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTMuNTI1IDEyLjcyOWMtLjA5MS4wNS0uMjEyLjE0NC0uMzYuMjgyLS4xNi4xNjItLjI0OC4yNTQtLjI2My4yNzZhMS42OCAxLjY4IDAgMCAwLS4zMy45OTkgMS43MTQgMS43MTQgMCAxIDAgMy40MjggMCIvPjxwYXRoIGQ9Ik00LjI4NiA5LjE0M0M0LjI4NiAxMC4yODYgMiAxMC43OSAyIDEyLjc5OGMwIDAgLjQyOC4yOTIuOTQ2LjUybTMuMDY2Ljk3N2MuNTM4LjEyNSAxLjA2Ny4yMDUgMS41NDIuMjA1aDMuMjA1TTEzLjA0MyA0SDExIi8+PC9nPjwvZz48L3N2Zz4=);
    background-repeat: no-repeat;
    background-position: center;

}

.info-delivery {
    opacity: .8;
    margin-top: 15px;
}

.restuarant-name {
    margin: 8px 0;
    font-size: 60px;
    font-weight: bold;
    line-height: 1.08;
}

.rating {}

.top-wrapper {
    height: 100%;
    margin: 0 80px;
    padding-top: 13vh;
}

.left-top {
    background-image: url("https://eda.yandex/images/1387779/4f8c9613c25d940949b9e45825d4f1ca-1100x825.jpeg");
    background-blend-mode: multiply;
    background-repeat: no-repeat;
    background-color: rgba(0, 0, 0, .3);
    background-position: center;
    background-size: cover;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.right {
    width: 320px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-left: 20px;
    position: sticky;
    top: 90px;
}

.mapimg {
    background-image: url("https://static-maps.yandex.ru/1.x/?l=map&ll=30.309158,59.963836&size=620,1572&scale=2&z=16&key=AP5KxFsBAAAAr4rWXAIApROgjMkXM-bOIOmMi2amb4pKEysAAAAAAAAAAADynFDWdJDGB1mMpov177fEMLqcCA==");
    background-size: cover;
    height: 83vh;
    width: 100%;
    margin-left: 1rem;
    margin-bottom: 1rem;
    border-radius: 5px;
}

.rest-cotainer {
    display: flex;
    flex-direction: row;
    padding-top: 3rem;
    padding-bottom: 1rem;
    margin: auto;
    max-width: 1420px;
    width: 100%;
}

@media screen and (max-width: 992px) {

    .desktop-mode {
        display: none;
    }

    .mobile-mode {
        display: flex;
        flex-direction: column;
        margin-top: -3rem;
		z-index: 10;
    	background: white;
		position: relative;
    }
}
  .dish-name-container{
    height: 38px;
    margin: 8px 0 2px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rest-info-center-block-tag{
    height: 36px;
    display: inline-flex;
    padding: 9px 13px;
    box-shadow: 0 2px 16px 0px rgba(0, 0, 0, 0.07);
    align-items: center;
    margin-right: 8px;
    margin-bottom: 8px;
    border-radius: 18px;
    flex-direction: row;
    justify-content: center;
    background: #fff!important;
  }
  .info-top-title{
    color: #3f3f3f;
    font-size: 24px;
    line-height: 28px;
    font-weight: bold;
    padding-bottom: 12px;
  }
</style>
