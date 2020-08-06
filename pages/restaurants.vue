<template>
<div>
    <div class="desktop-mode">
        <div class="rest-cotainer">
            <div class="left">
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
                            <v-divider />
                            <div class="d-flex flex-row justify-space-between">
                                <div class="white--text info-left">
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
                                </div>
                                <div class="white--text">
                                    <p>
                                        Заказ от
                                    </p>
                                    <p>
                                        {{restuarant.delivery.fee[0].min}}
                                    </p>
                                </div>
                                <div class="white--text">
                                    <v-menu bottom origin="center center" z-index="999" transition="scale-transition" nudge-left='100' nudge-bottom='50'>
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
                                                <restuarantInfo :restuarant='this.restuarant' />
                                            </v-card>
                                        </div>
                                    </v-menu>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="catalog">
                    <v-tabs hide-slider v-model="tab" class="catalog-tabs" center-active>
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
                                <cardDish :id='item.id' :count='item.count' :name='item.name' :description='item.description' :img='item.image' :dishinfo='item.sizes' />
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
                            <v-icon v-show="this.orderList.length > 0" @click="dropBasket()">
                                delete_forever
                            </v-icon>
                        </div>
                        <div v-if="this.orderList.length > 0 && this.getLatetestRestInfoWithOrder.params.resName == this.$router.currentRoute.params.resName" class="my-order-dishes-desktop">
                            <div v-for="order in this.orderList" :key="order.selectSize[0].id" class="order-item">
                                <div class="d-flex flex-column">
                                    <div class="d-flex flex-column order-item-info">
                                        <div class="item-name">
                                            {{order.name}}
                                            <span class="order-item-subbtitle">
                                                {{order.selectSize[0].weight}}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="order-item-subbtitle">
                                        {{order.selectSize[0].name}}
                                    </div>

                                    <!-- <div v-if="order.selectOption.length > 1">
                                        <div v-for="option in order.selectOption" :key="`selectOption${option.id}`" class="order-item-subbtitle">
                                            {{option.name}}
                                        </div>
                                    </div>
                                    <div v-else class="order-item-subbtitle">
                                        {{order.selectOption.name}}
                                    </div> -->

                                </div>
                                <div class="d-flex flex-column my-counter">
                                    <div class="counter-plus" @click="increment(order)">
                                        <v-icon>
                                            add
                                        </v-icon>
                                    </div>
                                    <div class="counter-count">
                                        {{order.selectSize[0].count}}
                                    </div>
                                    <div class="counter-minus" @click="decrement(order)">
                                        <v-icon>
                                            remove
                                        </v-icon>
                                    </div>
                                </div>
                                <div class="pl-4">
                                    x {{order.selectSize[0].price }} BYN
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
                            <p v-if="this.orderList.length > 0 && this.getLatetestRestInfoWithOrder.params.resName == this.$router.currentRoute.params.resName" class="price">{{this.getTotalPrice}} BYN</p>
							<p v-else class="price">0.0 BYN</p>
                        </div>
                    </div>
                </div>
                <v-btn :disabled="this.getTotalPrice <= 0" color="primary" class="desctop_btn_confirm_order" @click="checkout()">Оформить заказ</v-btn>
            </div>
            <client-only>
                <v-overlay :dark='false' z-index="999" v-model="showOptionsmenu">
                    <v-card width="50vw" class="select-option-card">
                        <div class="d-flex flex-row justify-space-between pb-3">
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
                                    Размер на выбор
                                </div>
                                <v-radio-group v-model="sizesRadioBtn" :mandatory="false" class="d-flex flex-row">
                                    <v-radio v-for="size in selectedDish.sizes" :key="size.id" :label="size.name" :value="size" color="primary"></v-radio>
                                </v-radio-group>
                            </div>
                            <div class="options">
                                <div class="multi-title">
                                    Дополнительниые ингреденеты
                                </div>
                                <div v-for="option in selectedDish.options" :key="option.id" class="d-flex flex-column justify-start">
                                    <div>
                                        {{option.title}}
                                    </div>
                                    <div class="d-flex flex-row justify-start">
                                        <v-radio-group v-model="selectOption" :mandatory="false" class="d-flex flex-row">
                                            <v-radio v-for="optionV in option.variants" :key="optionV.id" :label="`${optionV.name} +${optionV.price[0] != undefined ? optionV.price[0].price : 0} BYN`" :value="optionV" color="primary"></v-radio>
                                        </v-radio-group>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='options-actions'>
                            <div class="d-flex flex-row">
                                <div>
                                    <v-btn color="primary" @click="addCraftDish()">Добавить</v-btn>
                                </div>
                                <div class="dish-counter">
                                    <v-icon @click="dencrementSelectedDish()" color="black">
                                        remove
                                    </v-icon>
                                    {{selectedDishCounter}}
                                    <v-icon @click="incrementSelectedDish()" color="black">
                                        add
                                    </v-icon>
                                </div>
                            </div>
                            <div class="total-price-calc">
                                <div class="price-calc-sum">
                                    Сумма
                                </div>
                                <div>
                                    <!-- {{this.sizesRadioBtn}} -->
                                    {{(this.sizesRadioBtn.price * selectedDishCounter).toFixed(1)}} BYN
                                </div>
                            </div>
                        </div>
                    </v-card>
                </v-overlay>
                <v-overlay opacity="0.5" :dark='false' z-index="999" v-model="showOrderCard">
                    <orderCard @closeCheckout='checkout()' />
                </v-overlay>
            </client-only>
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
                    <v-icon @click="showHideRestInfo()">info</v-icon>
                    <v-bottom-sheet :light='true' overlay-opacity='0.5' v-model="showRestInfo">
                        <v-sheet>
                            <div class="sheet-top">
                                <h2 class="sheet-top-title">Информация о ресторане</h2>
                                <v-icon @click="showHideRestInfo()">close</v-icon>
                            </div>
                            <restuarantInfo :restuarant='this.restuarant' />
                        </v-sheet>
                    </v-bottom-sheet>
                </div>
                <div class="rest-info-center">
                    <v-chip @click="showRatingSheet = !showRatingSheet" :color="showRatingSheet ? 'primary': null" class="rest-info-center-block-tag">
                        <v-icon>star</v-icon>
                        {{restuarant.rating ? restuarant.rating: 'Мало оценок'}}
                    </v-chip>
                    <v-chip @click="showDeliveryOption = !showDeliveryOption" :color="showDeliveryOption ? 'primary': null" class="rest-info-center-block-tag">
                        Условия доставки
                    </v-chip>
                    <v-bottom-sheet :light='true' overlay-opacity='0.5' v-model="showRatingSheet">
                        <v-sheet>
                            <div class="sheet-top">
                                <h2 class="sheet-top-title">Рейтинг</h2>
                                <v-icon @click="closeSheetRating()">close</v-icon>
                            </div>
                            <div class="rating-info-bottom">
                                {{restuarant.rating ? restuarant.rating : 'Мало оценок'}}
                            </div>
                        </v-sheet>
                    </v-bottom-sheet>
                    <v-bottom-sheet :light='true' overlay-opacity='0.5' v-model="showDeliveryOption">
                        <v-sheet>
                            <div class="sheet-top">
                                <h2 class="sheet-top-title">Условия доставки</h2>
                                <v-icon @click="closeSheetDeliveryOprion()">close</v-icon>
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
                <v-tabs hide-slider z-index='1' v-model="tab" class="catalog-tabs catalog-tabs-mobile">
                    <v-tab v-for="(category, index) in restuarant.menu" :key="category.id" @click="scroll(`${index}`)" :color="tab == index ? 'primary': null" class="catalog-tab-mobile-container">
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
                                    <img :src="'https://img.eatmealby.com/resize/dish/400/'+item.image" :alt="item.name" class="dish-img-mobile" />
                                </div>
                                <div class="card-dish-bottom">
                                    <div class="dish-name-container">
                                        <h3 class="dish-name">
                                            {{item.name}}
                                        </h3>
                                    </div>
                                    <div class="dish-info">
                                        <div class="info-weight">
                                            {{item.sizes[0] ? item.sizes[0].weight : '404'}}
                                        </div>
                                    </div>
                                    <div class="info-price">
                                        {{item.sizes[0] ? item.sizes[0].price.toFixed(1) : '404'}} BYN
                                    </div>
                                </div>
                            </v-card>
                        </div>
                    </div>
                </div>
                <v-bottom-sheet :light='true' overlay-opacity='0.5' v-model="showDish" scrollable persistent no-click-animation z-index='999'>
                    <v-card>
                        <v-card-text class="pa-0">
                            <div class="close-block">
                                <v-btn icon color="white" @click="showDish = false">
                                    <v-icon color="black">close</v-icon>
                                </v-btn>
                            </div>
                            <div class="selected-dish-top">
                                <v-img :src="'https://img.eatmealby.com/resize/dish/400/'+selectedDish.image" lazy-src='https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg' :alt="selectedDish.name" class="dish-img-mobile-selected" />
                            </div>
                            <div class="selected-dish-composition">
                                {{selectedDish.description}}
                            </div>
                            <div>
                                <div class="sizes px-3">
                                    <div class="multi-title">
                                        Размер на выбор
                                    </div>
                                    <v-radio-group v-model="sizesRadioBtn" :mandatory="false" class="d-flex flex-row">
                                        <v-radio v-for="size in selectedDish.sizes" :key="size.id" :label="size.name" :value="size" color="primary"></v-radio>
                                    </v-radio-group>
                                </div>
                                <div class="options px-3">
                                    <div class="multi-title">
                                        Дополнительниые ингреденеты
                                    </div>
                                    <div v-for="option in selectedDish.options" :key="option.id" class="d-flex flex-column justify-start">
                                        <div>
                                            {{option.title}}
                                        </div>
                                        <div class="d-flex flex-row justify-start">
                                            <v-radio-group v-model="selectOption" :mandatory="false" class="d-flex flex-row">
                                                <v-radio v-for="optionV in option.variants" :key="optionV.id" :label="`${optionV.name} +${optionV.price[0] != undefined ? optionV.price[0].price : 0} BYN`" :value="optionV" color="primary"></v-radio>
                                            </v-radio-group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-row justify-space-between px-3">
                                <div class="dish-bottom-name">
                                    {{selectedDish.name}}
                                </div>
                                <div class="d-flex align-center">
                                    {{sizesRadioBtn.price}} BYN
                                </div>
                            </div>
                            <div class="d-flex flex-row justify-space-between align-center m-5 pa-3">
                                <div class="d-flex flex-row counter-component">
                                    <v-icon @click="dencrementSelectedDish()">
                                        remove
                                    </v-icon>
                                    {{selectedDishCounter}}
                                    <v-icon @click="incrementSelectedDish()">
                                        add
                                    </v-icon>
                                </div>
                                <div class="add-btn">
                                    <v-btn color="primary" @click="addToBasketMobile()">Добавить</v-btn>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-bottom-sheet>
            </div>
            <div class="basket-btn-block" v-show="this.getTotalPrice > 0">
                <div>
                    <v-btn height="56px" block color="primary" class="basket-btn" @click="goToBasketPage()">
                        <span class="pr-5">
                            Корзина
                        </span>
                        <span class="btn-sub-text">
                            {{getTotalPrice}} BYN
                        </span>
                    </v-btn>

                </div>
            </div>
        </div>
    </div>
    <v-overlay :dark='false' opacity="0.5" z-index="999" v-model="showWarning">
        <v-card class="d-flex flex-column justify-space-between select-option-card">
            <div class="d-flex flex-row justify-space-between align-center pb-2">
                <div class="warning-title" color="secondary">
                    Оформить заказ из ресторана {{this.restuarant.name}}
                </div>
                <div>
                    <v-icon @click="cancelDeleteBasket()" color="black">close</v-icon>
                </div>
            </div>
            <div class="warning-info" color="secondary">
                Все ранее добавленные блюда из ресторана "{{this.getLatetestRestInfoWithOrder == null ? '404' : this.getLatetestRestInfoWithOrder.restName}}" будут удалены из корзины
            </div>
            <v-card-actions class="d-flex flex-row">
                <v-btn color="primary" @click="coontinue()">
                    Продолжить
                </v-btn>
                <v-btn @click="cancelDeleteBasket()" class="mx-3" outlined>
                    Отменить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-overlay>
</div>
</template>

<script>
import ApiService from "../common/api.service";
import MapBtn from '@/components/map-btn'
import orderCard from '@/components/orderCard'
import cardDish from '@/components/cardDish'
import restuarantInfo from '@/components/restuarantInfo'
import axios from 'axios'

import {
    mapGetters
} from "vuex";
export default {
    name: 'restaurants',
    components: {
        MapBtn,
        cardDish,
        orderCard,
        restuarantInfo,
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
        var lastRest = store.getters['basket/getLatetestRestInfoWithOrder']
        var orderList = store.getters['basket/getSelectedDishs']
        var totalPrice = store.getters['basket/getTotalPrice']

        app.lastRest = lastRest
        app.orderList = orderList
        app.totalPrice = totalPrice
        let restuarant = await axios.post(`https://yestapi.xyz/restaurant/${id[0]}`, {
            zone_id: currentZone.id,
        })
        console.log('restuarant', restuarant.data)

        return {
            restuarant: restuarant.data,
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
            selectOption: [],
            selectedDishCounter: 1,
            countTotalPices: {},
            selectedListDish: [],
            showWarning: false,
            lastRest: {},
            totalPrice: 0,
            orderList: [],
            showOrderCard: false,
            showRestInfo: false,
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
            getLatetestRestInfoWithOrder: "basket/getLatetestRestInfoWithOrder",
        }),
    },
    watch: {
        showRatingSheet(newValue) {
            return newValue
        },
        showDeliveryOption(newValue) {
            return newValue
        },
        showDeliveryOption(newValue) {
            return newValue
        },
        getSelectedDishs(newValue) {
            this.orderList = newValue
            return newValue
        },
        getLatetestRestInfoWithOrder(newValue) {
            this.lastRest = newValue
            return newValue
        },
        getTotalPrice(newValue) {
            this.totalPrice = newValue
            return newValue
        },
        dishCounter(newValue) {
            return newValue
        },
        tab(newValue) {
            return newValue
        },
        selectedDishCounter(newValue) {
            return newValue
        },
        '$route.params.region': function () {
            this.$router.push(`/${this.getSelectedZone.alias}`)
        }
    },
    methods: {
        showHideRestInfo() {
            this.showRestInfo = !this.showRestInfo
        },
        closeShowDish() {
            this.selectedDish = {}
            this.sizesRadioBtn = {}
            this.selectOption = []
            this.showDish = false
        },
        closeSheetRating() {
            this.showRatingSheet = false
        },
        closeSheetDeliveryOprion() {
            this.showDeliveryOption = false
        },
        checkout() {
            this.showOrderCard = !this.showOrderCard
        },
        goToBasketPage() {
            this.$router.push(`/cart`)
        },
        cancelDeleteBasket() {
            this.showWarning = false
        },
        coontinue() {
            this.showDish = false
            this.dropBasket()
            this.saveBasket()
            this.showWarning = false
        },
        addCraftDish() {
            if (this.getLatetestRestInfoWithOrder !== null) {
                if (this.getLatetestRestInfoWithOrder.params.resName !== this.$router.currentRoute.params.resName) {
                    this.showWarning = true
                } else {
                    this.saveBasket()
                }
            } else {
                this.saveBasket()
            }
        },
        saveBasket() {
            this.selectOption = this.selectedDish.options ? this.selectedDish.options[0] : []
            // sizesRadioBtn
            this.sizesRadioBtn.count = this.selectedDishCounter
            this.selectedDish.sizes[0] = this.sizesRadioBtn
            // this.selectedDish.selectOption = this.selectOption
            this.selectedDishCounter = 1
            this.selectedDish.selectSize = []
            this.selectedDish.selectSize.push(this.sizesRadioBtn)

            this.$store.dispatch('basket/addToBasket', this.selectedDish);
            this.$store.dispatch('basket/saveRestuarantUrl', {
                params: this.$router.currentRoute.params,
                restName: this.restuarant.name,
            });
            this.showOptionsmenu = false
        },
        dencrementSelectedDish() {
            if (this.selectedDishCounter > 1) {
                this.selectedDishCounter--
            }
        },
        incrementSelectedDish() {
            this.selectedDishCounter++
        },
        goBack() {
            this.$router.go(-1)
        },
        closeOptionMenu() {
            this.showOptionsmenu = false
        },
        decrement(dish) {
            this.$store.dispatch('basket/decrementDishCounter', dish);
        },
        increment(dish) {
            this.$store.dispatch('basket/incrementDishCounter', dish);
        },
        dropBasket() {
            this.$store.dispatch('basket/dropBasket');
        },
        addToBasket(dish) {
            if (dish.sizes.length > 1 || dish.options.length > 1) {
                this.selectedDish = dish
                this.selectedDishCounter = 1
                this.showOptionsmenu = true
                this.sizesRadioBtn = dish.sizes[0]
            } else {
                if (this.getLatetestRestInfoWithOrder == null) {
                    this.selectedDish = dish
                    this.selectedDishCounter = 1
                    this.sizesRadioBtn = dish.sizes[0]
                    this.saveBasket()
                } else if (this.getLatetestRestInfoWithOrder.params.resName !== this.$router.currentRoute.params.resName) {
                    this.showWarning = true
                    this.selectedDish = dish
                    this.selectedDishCounter = 1
                    this.sizesRadioBtn = dish.sizes[0]
                } else {
					this.selectedDish = dish
                    this.selectedDishCounter = 1
                    this.sizesRadioBtn = dish.sizes[0]
                    this.saveBasket()
                }
            }
        },
        showSelectedDish(dish) {
            this.selectedDish = dish
            this.selectedDishCounter = 1
            this.sizesRadioBtn = dish.sizes[0]
            this.showDish = true
        },
        addToBasketMobile() {
            if (this.getLatetestRestInfoWithOrder !== null) {
                if (this.getLatetestRestInfoWithOrder.params.resName !== this.$router.currentRoute.params.resName) {
                    this.showWarning = true
                } else {
                    this.selectedDish.selectOption = this.selectOption
                    this.selectedDish.selectSize = this.sizesRadioBtn
                    this.selectedDish.selectSize.count = this.selectedDishCounter
                    this.$store.dispatch('basket/addToBasket', this.selectedDish);
                    this.$store.dispatch('basket/saveRestuarantUrl', {
                        params: this.$router.currentRoute.params,
                        restName: this.restuarant.name,
                    });
                    this.showDish = false
                }
            } else {
                this.selectedDish.selectOption = this.selectOption
                this.selectedDish.selectSize = this.sizesRadioBtn
                this.selectedDish.selectSize.count = this.selectedDishCounter
                this.$store.dispatch('basket/addToBasket', this.selectedDish);
                this.$store.dispatch('basket/saveRestuarantUrl', {
                    params: this.$router.currentRoute.params,
                    restName: this.restuarant.name,
                });
                this.showDish = false
            }
        },
        scroll(id) {
            console.log('scroll -> id', id)
            console.log('scroll -> document.getElementById(id)', document.getElementById(id))
            document.getElementById(id).scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
            this.tab = id
        },
        categoryNameIntersect(entries, observer) {
            this.tab = parseInt(entries[0].target.id, 10)
        }
    },
    mounted() {
        window.scrollTo(0, 0);
        this.orderList = this.getSelectedDishs
    },
}
</script>

<style>
.v-input--selection-controls__input .v-icon {
    background-color: rgba(211, 211, 211, 0.4) !important;
    border-radius: 50% !important;
}

@media screen and (max-width: 992px) {
    .v-slide-group__wrapper {
        margin-left: -48px !important;
    }
}

.v-application p {
    margin-bottom: 0 !important;
}
</style><style scoped>
.card-dish-top {
    height: 167px;
    width: 45vw;
}

.close-block {
    position: fixed;
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
    padding-top: 10px;
    margin-bottom: -40px;
    right: 0px;
    z-index: 999;
}

.basket-btn {
    border-radius: 16px !important;
    display: flex;
    justify-content: space-between;
}

.btn-sub-text {
    flex: 0 0 auto;
    padding: 7px 0px;
    font-size: 14px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.03);
}

.basket-btn-block {
    position: fixed;
    bottom: 0px;
    width: 100%;
    padding: 8px;
    overflow: hidden;
    box-shadow: 0 -4px 8px 0 rgba(0, 0, 0, 0.05);
    transition: all 200ms ease-in;
    background-color: #ffffff;
    margin: auto;
}

.warning-title {
    font-size: 24px;
    font-weight: bold;
    line-height: 36px;
}

.warning-info {
    border-top: solid 1px #f5f5f5;
    border-bottom: solid 1px #f5f5f5;
    background: #fafafa;
    margin: 0 -20px;
    padding: 16px 20px;
}

.price-calc-sum {
    color: #b0b0b0;
    font-size: 12px;
    margin-bottom: 3px;
}

.total-price-calc {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
}

.dish-counter i {
    margin: 0 5px;
}

.dish-counter {
    display: flex;
    flex-direction: row;
    align-items: center;
    border: .1px solid rgba(0, 0, 0, 0.15);
    border-radius: 3px;
    padding: 0 10px;
    margin: 0 10px;
}

.options-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    max-height: 48px;
    padding-top: 20px;
}

.rest-info-content {
    padding: 0 16px 16px 16px;
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
    padding-top: 20px;
    text-transform: uppercase;
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

.order-item-subbtitle {
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
    width: 70%;
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

.dish-img-mobile-selected {
    width: 100%;
    object-fit: contain;
}

.dish-img-mobile {
    width: 100%;
    height: 167px;
    object-fit: cover;
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
    border-radius: 24px !important;
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
    padding-bottom: 12px;
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
    line-height: 33px;
    font-weight: bold;
    display: flex;
    position: relative;
    padding-top: 27px;
    align-items: center;
    padding-left: 10px;
    flex-direction: row;
}

.treangle {
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 17px solid #fff;
    width: 10%;
    margin: auto;
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
    padding-left: 10px;
}

.dishs-list-mobile-item {
    margin: 5px;
    max-width: calc((100% - 20px)/2);
}

@media screen and (min-width: 500px) {
    .dishs-list-mobile-item {
        max-width: calc((100% - 30px)/3);
    }
}

@media screen and (min-width: 620px) {
    .dishs-list-mobile-item {
        max-width: calc((100% - 40px)/4);
    }
}

@media screen and (min-width: 850px) {
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

@media screen and (max-width: 1265px) {
    .top-wrapper {
        margin: 0 40px;
    }

    .rest-cotainer {
        max-width: 900px;
    }
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

.dish-name-container {
    height: 38px;
    margin: 8px 0 2px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.rest-info-center-block-tag {
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
    background: #fff !important;
}

.info-top-title {
    color: #3f3f3f;
    font-size: 24px;
    line-height: 28px;
    font-weight: bold;
}
</style>
