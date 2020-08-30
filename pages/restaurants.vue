<template>
<div>
    <div class="desktop-mode">
        <div class="rest-cotainer">
            <div class="left">
                <div class="left-top" :style="{backgroundImage:'url(https://img.eatmealby.com/resize/restaurant/900/'+restuarant.background_image+')'}">
                    <div class="top-wrapper">
                        <div class="rating">
                            <v-chip color="primary" class="restaurant-rating">
                                <v-icon class="restaurant-rating__icon" color="#FFFADF">star</v-icon>
                                <div>{{restuarant.rating ? restuarant.rating: 'Мало оценок'}}</div>
                            </v-chip>
                            <div>
                                <nuxt-link to="/" class="info-delivery">
                                    Доставка еды
                                </nuxt-link>
                                <span class="white--text">
                                    •
                                </span>
                                <nuxt-link :to="`/${this.currentZone.alias}`" class="info-delivery">
                                    {{this.currentZone.name}}
                                </nuxt-link>
                            </div>
                            <h1 class="restuarant-name white--text pb-3">
                                {{restuarant.name}}
                            </h1>
                            <div class="delivery-options d-flex flex-row justify-space-between">

                                <v-menu content-class="delivery-modal-wrapper" min-width="356" bottom origin="center center" z-index="999" transition="scale-transition" nudge-bottom='65'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <div class="white--text info-left" v-bind="attrs" v-on="on">
                                            <div class="moped-block">
                                                <div class="moped"></div>
                                                <div class="treangule"></div>
                                            </div>
                                            <div class="restuarants-description pl-2">
                                                <div class="description-who">
                                                    Доставка Yest.by
                                                </div>
                                                <div class="description-price ">
                                                    Доставка {{sortDeliverFee[sortDeliverFee.length-2].deliveryFee}} - {{sortDeliverFee[0].delivery}} BYN. Бесплатно при заказе от {{sortDeliverFee[sortDeliverFee.length-1].min}} BYN
                                                </div>
                                            </div>
                                        </div>
                                        <div class="white--text price-text">
                                            <p>
                                                Заказ от
                                            </p>
                                            <p>
                                                {{sortDeliverFee[0].min}} BYN
                                            </p>
                                        </div>
                                    </template>
                                    <div class="delivery-modal">
                                        <v-card max-width='356' class="restuarants-legal-info">
                                            <v-card-title class="modal-title">
                                                Доставка Yest.by
                                            </v-card-title>
                                            <v-card-subtitle class="modal-text-gray">
                                                Доставку выполнят партнёры Yest.by
                                            </v-card-subtitle>

                                            <div v-for="fee in this.sortDeliverFee" :key="`deliveryFee${fee.min}`" class="d-flex flex-column">
                                                <div class="delivery-info">
                                                    <v-icon>
                                                        directions_run
                                                    </v-icon>
                                                    <div>
                                                        {{fee.delivery ? fee.delivery : fee.deliveryFee }} BYN
                                                        <span>
                                                            На заказ от {{fee.min}} BYN
                                                        </span>
                                                    </div>
                                                </div>
                                                <v-divider width='100%' class="mx-auto" />
                                            </div>
                                        </v-card>
                                    </div>
                                </v-menu>

                                <div class="white--text rest-info-text">
                                    <v-menu content-class="rest-info-wrapper" bottom origin="center center" z-index="999" transition="scale-transition" nudge-left='100' nudge-bottom='50'>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn color="transparent" class="restaurant-info-btn" large v-bind="attrs" v-on="on">
                                                <p class="info-btn-text">
                                                    Информация <br /> о ресторане
                                                </p>
                                                <img src="@/assets/restaurantInfoIcon.svg" alt="restaurant info" >
                                            </v-btn>
                                        </template>
                                        <div class="rest-info-modal">
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
                    <v-tabs hide-slider v-model="tab" class="catalog-tabs catalog-tabs--desktop" center-active>
                        <v-tab class="tab-item" active-class="tab-item--active" height="70px" v-for="(category, index) in restuarant.menu" :key="category.cat_id" @click="scroll(`desktop_${index}`)">
                            {{category.name}}
                        </v-tab>
                    </v-tabs>
                    <v-divider />
                </div>
                <div class="catalog-list">
                    <div v-for="(category, index) in restuarant.menu" :key="category.cat_id">
                        <div class="category-title">
                            <h2 v-intersect="{handler:categoryNameIntersect, options: {threshold: [1.0]}}" :id='`desktop_${index}`'>
                                {{category.name}}
                            </h2>
                            <span class="category-list-counter">
                                {{category.dishes.length}}
                            </span>
                        </div>
                        <div class="dishs-list">
                            <div v-for="(item, index2) in category.dishes" :key="`dishCard${index2}`" v-show="item.status" class="dishs-list-item" @click="addToBasket(item)">
                                <cardDish :id='item.id' :count='item.count' :name='item.name' :description='item.description' :img='item.image' :dishinfo='item.sizes' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div cols-2 xl8 class="right">
                <basket :orderList="this.orderList" :delivery='this.restuarant.delivery' />
                <v-btn :disabled="this.getTotalPrice <= 0" color="primary" class="desctop_btn_confirm_order" id="desctop_btn_confirm_order" @click="checkout()">Оформить заказ</v-btn>
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
                            <div class="sizes" v-show="selectedDish.sizes.length > 0">
                                <div class="multi-title">
                                    Размер на выбор
                                </div>
                                <v-radio-group v-model="sizesRadioBtn" :mandatory="false" class="d-flex flex-row">
                                    <v-radio v-for="size in selectedDish.sizes" :key="size.id" :value="size" color="primary">
                                        <template v-slot:label>
                                            <span class="option-main-text">
                                                {{size.name}}
                                            </span>
                                            <span class="option-main-price">
                                                {{size.price-selectedDish.sizes[0].price == 0 ? `` : `+${size.price-selectedDish.sizes[0].price} BYN`}}
                                            </span>
                                        </template>
                                    </v-radio>
                                </v-radio-group>
                            </div>
                            <div class="options" v-show="selectedDish.options.length > 0">
                                <div class="multi-title">
                                    Дополнительниые ингреденеты
                                </div>
                                <div v-for="option in selectedDish.options" :key="option.id" class="d-flex flex-column justify-start">
                                    <div>
                                        {{option.title}}
                                    </div>
                                    <div class="d-flex flex-row justify-start">
                                        <v-radio-group v-model="selectOption" :mandatory="false" class="d-flex flex-row">
                                            <v-radio v-for="optionV in option.variants" :key="optionV.id" :value="optionV" color="primary">
                                                <template v-slot:label>
                                                    <p class="option-main">
                                                        <span class="option-main-text">
                                                            {{optionV.name}}
                                                        </span>
                                                        <span class="option-main-price">
                                                            {{optionV.price[0] != undefined ? optionV.price[0].price : 0}} BYN
                                                        </span>
                                                    </p>
                                                </template>
                                            </v-radio>
                                        </v-radio-group>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='options-actions'>
                            <div class="d-flex flex-row">
                                <v-btn class="options-actions__add" color="primary" @click="addCraftDish()">Добавить</v-btn>
                                <div class="dish-counter">
                                    <v-icon @click="dencrementSelectedDish()" color="black">
                                        remove
                                    </v-icon>
                                    <span class="dish-counter__qty">{{selectedDishCounter}}</span>
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
                                    {{(this.sizesRadioBtn.price * selectedDishCounter).toFixed(1)}} BYN
                                </div>
                            </div>
                        </div>
                    </v-card>
                </v-overlay>
                <v-overlay opacity="0.5" :dark='false' z-index="999" v-model="showSmsForm">
                    <!-- <orderForm @closeCheckout='checkout()' /> -->
                    <smsForm @closeForm='closeSmsForm()' @closeFormShowOrderForm='closeFormShowOrderForm()' />
                </v-overlay>
            </client-only>
        </div>
    </div>
    <div class="mobile-mode">
        <div class="mobile-mode_header">
            <v-icon class="mobile-mode_header-btn" @click="goBack()">arrow_back</v-icon>
            <h1 class="info-top-title" v-show="showRestName">
                {{restuarant.name}}
            </h1>
            <v-icon class="mobile-mode_header-btn">search</v-icon>
        </div>
        <div class="mobile-rest-info">
            <div class="rest-info-content">
                <div class="rest-info-top">
                    <h1 class="info-top-title">
                        {{restuarant.name}}
                    </h1>
                    <v-icon @click="showHideRestInfo()">info</v-icon>
                    <v-bottom-sheet :light='true' overlay-opacity='0.5' v-model="showRestInfo" :eager=true>
                        <v-sheet class="mobile-rest-info-modal">
                            <div class="mobile-rest-info-modal__top">
                                <p class="mobile-rest-info-modal__title">{{restuarant.name}}</p>
                                <v-icon @click="showHideRestInfo()" color="#000">close</v-icon>
                            </div>
                            <restuarantInfo :restuarant='this.restuarant' />
                        </v-sheet>
                    </v-bottom-sheet>
                </div>
                <div class="rest-info-center">
                    <v-chip @click="showRatingSheet = !showRatingSheet" :color="showRatingSheet ? 'primary': null" class="rest-info-center-block-tag">
                        <v-icon class="rest-info-center__rating-icon">star</v-icon>
                        {{restuarant.rating ? restuarant.rating: 'Мало оценок'}}
                    </v-chip>
                    <v-chip @click="showDeliveryOption = !showDeliveryOption" :color="showDeliveryOption ? 'primary': null" class="rest-info-center-block-tag">
                        Условия доставки
                    </v-chip>
                    <v-bottom-sheet :light='true' overlay-opacity='0.5' v-model="showRatingSheet" :eager=true>
                        <v-sheet>
                            <div class="rest-ship-modal">
                                <div class="rest-ship-modal__top">
                                    <p class="rest-ship-modal__title">Рейтинг</p>
                                    <v-icon @click="closeSheetRating()">close</v-icon>
                                </div>
                            </div>
                            <div class="rest-ship-modal__rating">
                                {{restuarant.rating ? restuarant.rating : 'Мало оценок'}}
                            </div>
                        </v-sheet>
                    </v-bottom-sheet>
                    <v-bottom-sheet :light='true' overlay-opacity='0.5' v-model="showDeliveryOption" :eager=true>
                        <v-sheet class="rest-ship-modal">
                            <div class="rest-ship-modal__top">
                                <p class="rest-ship-modal__title">Условия доставки</p>
                                <v-icon @click="closeSheetDeliveryOprion()" color="#000">close</v-icon>
                            </div>
                            <div class="rest-ship-modal__wrapper">
                                <div v-for="fee in this.sortDeliverFee" :key="`deliveryFee${fee.min}`" class="rest-ship-modal__item">
                                    <div class="rest-ship-modal__item-box">
                                        <v-icon class="rest-ship-modal__item-icon">
                                            directions_run
                                        </v-icon>
                                        <span>
                                            {{fee.delivery ? fee.delivery : fee.deliveryFee }} BYN
                                            <span>на заказ от {{fee.min}} BYN</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p class="rest-ship-modal__descr">Доставку выполнят партнёры Yest.by</p>
                        </v-sheet>
                    </v-bottom-sheet>
                </div>
            </div>
            <div class="rest-info-bottom">
                <v-tabs hide-slider z-index='1' v-model="tab" class="catalog-tabs catalog-tabs-mobile">
                    <v-tab active-class="catalog-tab-mobile-container--active" v-for="(category, index) in restuarant.menu" :key="category.id" @click="scroll(`mob_${index}`)" :color="tab == index ? 'primary': null" class="catalog-tab-mobile-container">
                        <v-chip>
                            {{category.name}}
                        </v-chip>
                    </v-tab>
                </v-tabs>
            </div>
            <div class="mobile-catalog">
                <div v-for="(category, index) in restuarant.menu" :key="category.id">
                    <h2 v-intersect="{handler:categoryNameIntersect, options: {threshold: [1.0]}}" :id="`mob_${index}`" class="category-title">
                        {{category.name}}
                    </h2>
                    <div class="dishs-list-mobile">
                        <div v-for="(item, index2) in category.dishes" :key="`dishCard${index2}`" v-show="item.status" class="dishs-list-mobile-item">
                            <v-card class="dish-card">
                                <div @click="showSelectedDish(item)">
                                    <div class="card-dish-top">
                                        <span class="dash-info-compare" v-show="item.sizes[0].discount !== null">%</span>
                                        <img :src="'https://img.eatmealby.com/resize/dish/400/'+item.image" :alt="item.name" class="dish-img-mobile" />
                                    </div>
                                    <div class="card-dish-bottom">
                                        <div class="dish-name-container">
                                            <h3 class="dish-name">
                                                {{item.name}}
                                            </h3>
                                        </div>
                                        <div class="dish-info">
                                            <span class="dish-info__price" v-show="!checkInbasket(item)">{{computedPrice(item.sizes)}} BYN</span>
                                            <span class="info-weight">
                                                {{item.sizes[0] ? item.sizes[0].weight : ''}}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="info-price" v-show="checkInbasket(item)" @click='momentAdd(item)'>
                                        {{item.sizes[0] ? item.sizes[0].price.toFixed(1) : ''}} BYN
                                    </div>
                                    <div v-show="!checkInbasket(item)" class="dish-conter-mobile">
                                        <v-icon class="info-price px-3" @click="decrement(item)">
                                            remove
                                        </v-icon>
                                        <div class="dish-counter-mob">
                                            {{computedCount(item)}}
                                        </div>
                                        <v-icon class="info-price px-3" @click="increment(item)">
                                            add
                                        </v-icon>
                                    </div>
                                </div>
                            </v-card>
                        </div>
                    </div>
                </div>
                <v-bottom-sheet :light='true' overlay-opacity='0.5' v-model="showDish" scrollable persistent no-click-animation z-index='999' :eager=true>
                    <v-card class="mobile-addition">
                        <v-card-text class="pa-0 bgGray">
                            <div class="mobile-addition__top">
                                <div class="close-block">
                                    <v-btn class="close-block-btn" icon color="white" @click="showDish = false">
                                        <v-icon color="black">close</v-icon>
                                    </v-btn>
                                </div>
                                <div class="selected-dish-top">
                                    <img :src="'https://img.eatmealby.com/resize/dish/400/'+selectedDish.image" :alt="selectedDish.name" class="dish-img-mobile-selected" />
                                </div>
                                <div class="selected-dish-composition">
                                    {{selectedDish.description}}
                                </div>
                                <div class="bgGray" v-show="selectedDish.sizes.length>1">
                                    <div class="sizes px-3">
                                        <div class="multi-title">
                                            Размер на выбор
                                        </div>
                                        <v-radio-group v-model="sizesRadioBtn" :mandatory="false" class="d-flex flex-row">
                                            <v-radio class="radio-button" v-for="size in selectedDish.sizes" :key="size.id" :value="size" color="primary">
                                                <template v-slot:label>
                                                    <p class="option-main">
                                                        <span class="option-main-text">
                                                            {{size.name}}
                                                        </span>
                                                        <span class="option-main-price">
                                                            {{size.price-selectedDish.sizes[0].price == 0 ? `` : `+${size.price-selectedDish.sizes[0].price} BYN`}}
                                                        </span>
                                                    </p>
                                                </template>
                                            </v-radio>
                                        </v-radio-group>
                                    </div>
                                    <div class="options px-3" v-show="selectedDish.options.length > 1">
                                        <div class="multi-title">
                                            Дополнительниые ингреденеты
                                        </div>
                                        <div v-for="option in selectedDish.options" :key="option.id" class="d-flex flex-column justify-start">
                                            <div>
                                                {{option.title}}
                                            </div>
                                            <div class="d-flex flex-row justify-start">
                                                <v-radio-group v-model="selectOption" :mandatory="false" class="d-flex flex-row">
                                                    <v-radio class="radio-button" v-for="optionV in option.variants" :key="optionV.id" :value="optionV" color="primary">
                                                        <template v-slot:label>
                                                            <p class="option-main">
                                                                <span class="option-main-text">
                                                                    {{optionV.name}}
                                                                </span>
                                                                <span class="option-main-price">
                                                                    {{optionV.price[0] != undefined ? optionV.price[0].price : 0}} BYN
                                                                </span>
                                                            </p>
                                                        </template>
                                                    </v-radio>
                                                </v-radio-group>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mobile-addition__bottom">
                                <div class="d-flex flex-row justify-space-between bottom-withTitle">
                                    <div class="dish-bottom-name">
                                        {{selectedDish.name}}
                                    </div>
                                    <div class="dish-bottom-price d-flex align-center">
                                        {{sizesRadioBtn.price}} BYN
                                    </div>
                                </div>
                                <div class="d-flex flex-row justify-space-between align-center m-5">
                                    <div class="d-flex flex-row counter-component">
                                        <v-icon @click="dencrementSelectedDish()">
                                            remove
                                        </v-icon>
                                        <span class="counter-component__qty">{{selectedDishCounter}}</span>
                                        <v-icon @click="incrementSelectedDish()">
                                            add
                                        </v-icon>
                                    </div>
                                    <div class="add-btn">
                                        <v-btn color="primary" @click="addToBasketMobile()">Добавить</v-btn>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-bottom-sheet>
            </div>
            <div class="basket-btn-block" v-show="this.getTotalPrice > 0">
                <div>
                    <v-btn height="56px" block color="primary" class="basket-btn" @click="goToBasketPage()">
                        <span class="btn-sub-text">
                            {{this.restuarant.delivery.time.min}} - {{this.restuarant.delivery.time.max}} мин
                        </span>
                        <span>
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
    <v-overlay class="modal-change-products" :dark='false' opacity="0.5" z-index="999" v-model="showWarning">
        <v-card class="d-flex flex-column justify-space-between select-option-card">
            <p class="modal-change-products__title">Оформить заказ из ресторана {{this.restuarant.name}}</p>
            <div class="warning-info" color="secondary">
                Все ранее добавленные блюда из ресторана "{{this.getLatetestRestInfoWithOrder == null ? '404' : this.getLatetestRestInfoWithOrder.restName}}" будут удалены из корзины
            </div>
            <v-card-actions class="modal-change-products__actions d-flex flex-row">
                <v-btn class="modal-change-products__continue" color="primary" @click="coontinue()">
                    Продолжить
                </v-btn>
                <v-btn @click="cancelDeleteBasket()" class="modal-change-products__cancel" outlined>
                    Отмена
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-overlay>
</div>
</template>

<script>
import ApiService from "../common/api.service";
import MapBtn from '@/components/map/map-btn'
import orderForm from '@/components/order-form'
import cardDish from '@/components/restaurant/cardDish'
import basket from '@/components/basket'
import restuarantInfo from '@/components/restaurant/restuarantInfo'
import smsForm from '@/components/restaurant/sms-form'
import axios from 'axios'

import {
    mapGetters
} from "vuex";
export default {
    name: 'restaurants',
    components: {
        MapBtn,
        cardDish,
        orderForm,
        restuarantInfo,
        basket,
        smsForm,
    },
    async asyncData({
        app,
        context,
        store,
        params,
        redirect,
    }) {
        console.log('START REST ASYNC');
        let restParams = params.resName
        let id = restParams.split('-')
        var lastRest = store.getters['basket/getLatetestRestInfoWithOrder']
        var orderList = store.getters['basket/getSelectedDishs']
        var totalPrice = store.getters['basket/getTotalPrice']

        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data
        store.dispatch('zone/setZone', zoneListData)
        let currentZone = zoneListData.find((zones) => {
            return zones.alias == params.region
        })

        if (currentZone !== undefined) {
            store.dispatch('zone/setSelectedZone', currentZone)
        } else {
            redirect('/')
        }

        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: currentZone.id
        })

        let categoriesListData = categoriesList.data

        store.dispatch('user/allCategory', categoriesListData)

        app.lastRest = lastRest
        app.orderList = orderList
        app.totalPrice = totalPrice
        let restuarant = await axios.post(`https://yestapi.xyz/restaurant/${id[0]}`, {
            zone_id: currentZone.id,
        })
        let restuarantData = restuarant.data
        console.log('restuarantData', restuarantData)

        return {
            restuarant: restuarantData,
            currentZone: currentZone,
        }
    },
    data() {
        return {
            tab: 0,
            showRatingSheet: false,
            showDeliveryOption: false,
            selectedDish: {
                sizes: [],
                options: [],
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
            showSmsForm: false,
            showRestInfo: false,
            showRestName: false,
            lastPath: null,
            calcPath: '',
        }
    },
    head() {
        return {
            title: this.restuarant.seo.title,
            meta: [
				{
                    hid: 'description',
                    name: 'description',
                    content: this.restuarant.seo.description
                },
                {
                    hid: 'keywords',
                    name: 'keywords',
                    content: this.restuarant.seo.keywords
                },
            ]
        }
    },
    methods: {
        computedPrice(prices) {
            if (prices.length == 0) {
                return 'Нет цены'
            } else if (prices.length > 1) {
                let chekDiffrentPrice = prices.find((dish, index, arr) => {
                    return dish.price == arr[index - 1]
                })
                if (chekDiffrentPrice !== undefined) {
                    return `От ${prices[0].price}`
                } else {
                    return `${prices[0].price}`
                }
            } else {
                return `${prices[0].price}`
            }
        },
        closeFormShowOrderForm() {
            this.showSmsForm = false
            this.showSmsForm = false
        },
        closeSmsForm() {
            this.showSmsForm = false
        },
        computedDeliveryCost() {
            let deliveryMass = this.sortDeliverFee
            let price = parseInt(this.getTotalPrice)
            let finded = deliveryMass.find((cost) => {
                return cost.min <= price && price <= cost.max
            })
            if (finded !== undefined) {
                return finded
            } else {
                return deliveryMass[deliveryMass.length - 1]
            }

        },
        computedFreeDeliveryCost() {
            let deliveryMass = this.sortDeliverFee
            let price = parseFloat(this.getTotalPrice)
            let finded = deliveryMass.findIndex((cost) => {
                return cost.min <= price && price <= cost.max
            })
            if (finded !== undefined) {
                if (deliveryMass[deliveryMass.length - 1].min < price) {
                    return ``
                } else {
                    let computedNextSum = deliveryMass[finded + 1].min - price
                    return `Закажите ещё на ${computedNextSum.toFixed(1)} BYN для доставки за ${deliveryMass[finded+1].delivery ? deliveryMass[finded+1].delivery : deliveryMass[finded+1].deliveryFee} BYN`
                }
            } else {
                return ``
            }
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
            let find = this.orderList.find((el) => {
                return el.id == this.selectedDish.id
            })
            if (find == undefined) {

                this.selectOption = this.selectedDish.options ? this.selectedDish.options[0] : []
                // sizesRadioBtn
                this.sizesRadioBtn.count = this.selectedDishCounter
                // this.selectedDish.sizes[0] = this.sizesRadioBtn
                // this.selectedDish.selectOption = this.selectOption
                this.selectedDishCounter = 1
                this.selectedDish.selectSize = []
                this.selectedDish.selectSize = this.sizesRadioBtn

                this.$store.dispatch('basket/addToBasket', this.selectedDish);
                this.$store.dispatch('basket/saveRestuarantUrl', {
                    params: this.$router.currentRoute.params,
                    restName: this.restuarant.name,
                    delivery: this.restuarant.delivery,
                });
                this.showOptionsmenu = false
            } else {
                this.increment(this.selectedDish)
            }
        },
        addToBasket(dish) {
            if (dish.sizes.length > 1 || dish.options.length > 1) {
                this.selectedDish = dish
                this.selectedDishCounter = 1
                this.showOptionsmenu = true
                this.sizesRadioBtn = dish.sizes[0]
            } else {
                this.selectedDish = dish
                this.selectedDishCounter = 1
                this.sizesRadioBtn = dish.sizes[0]
                if (this.getLatetestRestInfoWithOrder == null) {
                    this.saveBasket()
                } else if (this.getLatetestRestInfoWithOrder.params.resName !== this.$router.currentRoute.params.resName) {
                    this.showWarning = true
                } else {
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
        momentAdd(dish) {
            this.selectedDish = dish
            this.selectedDishCounter = 1
            this.sizesRadioBtn = dish.sizes[0]
            if (dish.sizes.length > 1) {
                this.showDish = true
            } else {
                this.saveBasket()
            }
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
                        delivery: this.restuarant.delivery,
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
                    delivery: this.restuarant.delivery,
                });
                this.showDish = false
            }
        },
        checkInbasket(item) {
            let findItem = this.getSelectedDishs.find((dish) => {
                return item.id == dish.id
            })
            if (findItem !== undefined) {
                return false
            } else {
                return true
            }
        },
        computedCount(item) {
            let findItem = this.getSelectedDishs.find((dish) => {
                return item.id == dish.id
            })
            if (findItem !== undefined) {
                return findItem.selectSize.count
            } else {
                return 0
            }
        },
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
            if (this.getUserPhoneNumber) {
                this.$router.push('/checkout')
            } else {
                this.showSmsForm = !this.showSmsForm
            }
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
        dencrementSelectedDish() {
            if (this.selectedDishCounter > 1) {
                this.selectedDishCounter--
            }
        },
        incrementSelectedDish() {
            this.selectedDishCounter++
        },
        goBack() {
            this.$router.push(`${this.calcPath}`)
        },
        closeOptionMenu() {
            this.showOptionsmenu = false
        },
        decrement(dish) {
            this.showDish = false
            dish.selectSize = dish.sizes[0]
            this.$store.dispatch('basket/decrementDishCounter', dish);
        },
        increment(dish) {
            dish.selectSize = dish.sizes[0]
            this.showDish = false
            this.$store.dispatch('basket/incrementDishCounter', dish);
        },
        dropBasket() {
            this.$store.dispatch('basket/dropBasket');
        },
        scroll(id) {
            const element = document.getElementById(id);
            const yOffset = window.innerWidth < 992 ? 80 : 140;
            const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
            this.tab = id
        },
        categoryNameIntersect(entries, observer, isIntersecting) {
            if (isIntersecting) {
                let visibleCategory = entries[0].target.id.split('_')
                this.tab = parseInt(visibleCategory[1])
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.path !== '/') {
                vm.calcPath = from.path
            } else {
                vm.calcPath = `/${to.params.region}`
            }
        })
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
            getUserPhoneNumber: "user/getUserPhoneNumber",
        }),
        sortDeliverFee() {
            let listt = this.restuarant.delivery.fee
            let sorted = listt.sort((a, b) => {
                return a.delivery ? a.delivery : a.deliveryFee > b.deliveryFee
            })
            return sorted
        },
    },
    watch: {
        getSelectedZone(newValue) {
            // this.dropBasket()
        },
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
            this.computedDeliveryCost()
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

    mounted() {
        window.scrollTo(0, 0);
        this.orderList = this.getSelectedDishs
        let lastScrollTop = 0
        window.addEventListener('scroll', () => {
            const st = window.pageYOffset || document.documentElement.scrollTop
            if (st > lastScrollTop) {
                // downscroll code
                if (st > 30) {
                    this.showRestName = true
                } else {
                    this.showRestName = false
                }
            } else if (st < 30) {
                this.showRestName = false
            } else {
                this.showRestName = true
            }
            lastScrollTop = st <= 0 ? 0 : st
        })
    },
}
</script>

<style>
.mobile-rest-info-modal {
    border-radius: 10px 10px 0 0 !important;
}

.mobile-rest-info-modal__top {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #ddd;
}

.mobile-rest-info-modal__title {
    font-size: 20px;
    font-weight: 600;
}

.rest-ship-modal {
    border-radius: 10px 10px 0 0 !important;
    padding-bottom: 14px;
}

.rest-ship-modal__top {
    display: flex;
    align-items: center;
    padding: 16px;
    margin-bottom: 14px;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
}

.rest-ship-modal__title {
    font-size: 20px;
    font-weight: 600;
}

.rest-ship-modal__item {
    width: 100%;
    padding: 6px 16px 0;
}

.rest-ship-modal__item-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    padding: 0 0 6px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
}

.rest-ship-modal__item:last-child .rest-ship-modal__item-box {
    border-bottom: none;
}

.rest-ship-modal__item-icon {
    margin-right: 10px;
}

.rest-ship-modal__descr {
    color: #b0b0b0;
    font-size: 12px;
    margin: 0;
    padding: 12px 16px 2px;
}

.rest-ship-modal__rating {
    padding: 0px 16px 28px;
    color: #3f3f3f;
    font-size: 36px;
    font-weight: 600;
    line-height: 1em;
}

.rest-cotainer .right #desctop_btn_confirm_order.v-btn--disabled {
    background-color: #4ca647 !important;
}

.v-input--selection-controls__input .v-icon {
    background-color: rgba(211, 211, 211, 0.4) !important;
    border-radius: 50% !important;
}

.v-application p {
    margin-bottom: 0 !important;
}

.catalog-tabs--desktop {
    height: 70px;
}

.catalog-tabs--desktop .tab-item {
    height: 70px;
}

.catalog-tabs--desktop .v-tabs-bar {
    height: 70px;
}

@media screen and (max-width: 992px) {
    .catalog-tabs {
        padding: 0 !important;
    }

    .catalog-tabs .v-slide-group__prev--disabled {
        display: none !important;
    }

    .catalog-tabs .v-slide-group__wrapper {
        margin-left: 12px;
    }

    .catalog-tabs .v-ripple__container {
        display: none !important;
    }

    .catalog-tabs .catalog-tab-mobile-container {
        text-transform: capitalize !important;
        padding: 0 4px !important;
        min-width: initial !important;
    }

    .catalog-tabs .catalog-tab-mobile-container:before {
        background: none !important;
    }

    .catalog-tabs .catalog-tab-mobile-container span {
        background-color: transparent !important;
        color: #a3a3a3 !important;
    }

    .catalog-tabs .catalog-tab-mobile-container.catalog-tab-mobile-container--active span {
        background-color: #f1f0ed !important;
        color: #000 !important;
    }
}

.modal-change-products {
    padding: 0 20px;
}

.modal-change-products__actions {
    flex: 1 0 auto;
    display: flex !important;
    flex-direction: row !important;
    padding: 0 !important;
}

.modal-change-products__continue {
    font-size: 16px !important;
    font-weight: 600;
    text-transform: initial !important;
    padding: 4px 20px !important;
    letter-spacing: 0.1px;
    margin-right: 10px;
    height: 41px !important;
}

.modal-change-products__cancel {
    height: 41px !important;
    text-transform: initial !important;
    padding: 4px 20px !important;
    font-size: 16px !important;
    letter-spacing: 0.1px;
}

.options-list div[role=radiogroup] {
    flex-direction: row !important;
    flex-wrap: wrap !important;
}

.options-list div[role=radiogroup] .v-radio {
    width: 50% !important;
}
</style>
<style scoped>
  .radio-button {
    margin-bottom: 0 !important;
  }

  .option-main {
    padding: 10px 0 !important;
    margin-bottom: 0 !important;
    border-bottom: 1px solid #f5f5f5;
    width: 100% !important;
  }

  .option-main-text {
    font-size: 14px;
  }

  .option-main-price {
    color: #b0b0b0;
    font-size: 14px;
    margin-left: 10px;
    white-space: nowrap;
  }
.modal-change-products__title {
    padding-top: 6px;
    margin-bottom: 20px !important;
    font-size: 24px;
    font-weight: bold;
    white-space: pre-line;
    line-height: 36px;
}

.modal-change-products .select-option-card {
    max-width: 600px;
}

.rest-info-wrapper,
.delivery-modal-wrapper {
    overflow-y: visible !important;
    overflow-x: visible;
    contain: none;
    z-index: 10 !important;
    box-shadow: none !important;
}

.rest-info-modal,
.delivery-modal {
    position: relative;
    overflow: visible;
}

.rest-info-modal:before,
.delivery-modal:before {
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 17px solid #fff;
    width: 10%;
    margin: auto;
    z-index: 200;
}

.modal-title {
    font-size: 20px;
    font-weight: 600;
    padding: 20px 20px 0;
    margin-bottom: 10px;
}

.modal-text-gray {
    padding: 3px 20px;
    font-size: 14px;
    color: #a0a0a0;
}

.bgGray {
    background-color: #fafafa;
}

.mobile-addition {
    position: relative !important;
    border-radius: 12px 12px 0 0 !important;
    overflow: hidden !important;
}

.mobile-addition__top {
    overflow: auto;
    padding-bottom: 125px;
}

.mobile-addition__bottom {
    padding: 16px;
    width: 100%;
    background-color: #fff;
    flex: 0 0 auto;
    border-top: 1px solid #ececec;
    box-shadow: 0 -2px 10px 0 #ececec;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}

.bottom-withTitle {
    margin-bottom: 16px;
}

.close-block-btn {
    top: 12px;
    width: 40px;
    right: 12px;
    height: 40px;
    z-index: 6;
    position: absolute;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.07);
    border-radius: 50%;
    background-color: white;
    background-repeat: no-repeat;
    background-position: center;
}

.fs10 {
    font-size: 10px !important;
}

.delivery-info-text {
    padding: 0 20px;
    font-size: 12px;
}

.tab-item {
    transition: none;
    text-transform: initial;
    border-bottom: 4px solid #fff !important;
    font-size: 16px !important;
}

.tab-item.tab-item--active {
    color: #000;
    border-bottom: 4px solid #00a646 !important;
}

.restaurant-rating {
    margin-bottom: 16px;
}

.restaurant-rating .restaurant-rating__icon {
    margin-right: 6px;
    font-size: 18px;
}

.delivery-options {
    padding: 10px 0 11px;
    border-top: 1px solid hsla(0, 0%, 100%, .2);
    flex-wrap: wrap;
    margin-top: auto;
}

.price-text p:first-child {
    font-size: 14px;
    margin-bottom: 0 !important;
}

.price-text p:last-child {
    font-size: 16px;
    line-height: 21px;
    padding-top: 6px;
    margin-bottom: 0 !important;
}

.restaurant-info-btn {
    background-color: transparent !important;
    border: none;
    box-shadow: none;
    margin-right: -20px;
}

.restaurant-info-btn .info-btn-text {
    text-align: left;
    color: #fff;
    text-transform: initial;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 0;
    margin-right: 6px;

}

.dish-conter-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 999;
}

.dish-counter-mob {
    font-size: 20px;
    color: #000;
    margin-bottom: 8px;
}

.card-dish-top {
    height: 167px;
    width: 45vw;
    position: relative;
}

.dash-info-compare {
    position: absolute;
    top: 7px;
    left: 8px;
    background-color: #4ca647;
    width: 40px;
    height: 28px;
    display: flex;
    justify-content: center;
    line-height: 28px;
    color: #fff;
    font-weight: 400;
    font-size: 20px;
    border-radius: 16px;
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
    text-transform: initial;
    font-size: 16px;
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
    bottom: 0;
    width: 100%;
    padding: 16px 16px 26px;
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
    font-weight: 400;
    margin: 0 -20px 20px;
    padding: 16px 20px;
    line-height: 1em;
    background-color: #fafafa;
    border-top: solid 1px #f5f5f5;
    border-bottom: solid 1px #f5f5f5;
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
    line-height: 1em;
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

.dish-counter__qty {
    margin: 0 12px;
    min-width: 24px;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.options-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 0;
    margin: 0 -20px;
    border-top: 1px solid #ececec;
}

.options-actions__add {
    width: auto;
    margin: 0 8px 0 0;
    padding: 15.5px 14px !important;
    min-width: 213px !important;
    min-height: auto;
    border-radius: 4px;
    height: 47px !important;
    text-transform: capitalize !important;
    font-size: 16px !important;
    letter-spacing: 0.1px !important;
}

.rest-info-content {
    padding: 50px 16px 16px 16px;
    background: #fff;
    border-bottom: 10px solid #fafafa;
}

.catalog-tabs {
    z-index: 0;
    padding: 0 60px;
    background-color: #fff;
}

.right-my-order .my-order {
    flex: auto;
}

.my-order-top {
    display: flex;
    flex-direction: column;
    overflow: auto;
    max-height: calc(100% - 160px);
}

.my-order-top__total {
    padding: 8px 20px 0 !important;
}

.my-order-dishes-desktop {
    margin-bottom: auto;
    padding-bottom: 20px;
}

.desctop_btn_confirm_order {
    width: 100%;
    font-weight: 600;
    letter-spacing: inherit;
    text-transform: inherit;
    font-size: 16px !important;
    min-height: 41px;
}

.dish-bottom-name {
    flex: 0 1 auto;
    color: #000000;
    line-height: 1.25;
    margin-right: auto;
    font-size: 16px;
}

.dish-bottom-price {
    flex: 0 0 auto;
    color: #000000;
    align-self: center;
    line-height: 1.25;
    padding-left: 4px;
    font-size: 16px;
}

.options-list {
    background: #fafafa;
    padding: 6px 20px 0;
    max-height: calc(100vh - 220px);
    overflow-y: auto;
    margin: 0 -20px;
}

.select-option-card {
    color: #000 !important;
    padding: 14px 20px 20px;
    max-width: 660px;
    border-radius: 10px !important;
    max-height: calc(100vh - 80px);
    overflow: hidden;
}

.multi-title {
    color: #b0b0b0;
    font-size: 12px;
    padding-top: 8px;
    text-transform: uppercase;
}

.close-select-option {
    cursor: pointer;
    margin-top: 2px;
}

.select-option-title {
    font-size: 24px;
    font-weight: bold;
    line-height: 36px;
}

.my-counter {
    min-width: 35px;
    height: 35px;
    min-height: 35px;
    display: flex;
    align-items: center;
    position: relative;
    flex: 0 1 10%;
    margin-top: -6px;
}

.my-counter .counter-count {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b0b0b0;
    font-weight: 300;
    font-size: 14px;
    min-width: 35px;
    min-height: 35px;
    line-height: 35px;
    height: 35px;
}

.my-counter .counter-plus {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    border-bottom: none !important;
}

.my-counter .counter-minus {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border-top: none !important;
}

.my-counter:hover .counter-count,
.my-counter:hover .counter-plus,
.my-counter:hover .counter-minus {
    display: flex;
    border: .5px solid rgb(176, 176, 176);
    cursor: pointer;
    background-color: #fff !important;
}

.counter-plus,
.counter-minus {
    display: none;
    cursor: pointer;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 35px;
    background-color: #fff !important;
    z-index: 1;
}

.order-item__title {
    flex: 1 1 60%;
}

.order-item__price {
    flex: 0 1 20%;
    font-size: 14px;
    text-align: right;
    padding-left: 10px !important;
}

.order-item-info {
    flex: 1 1 60%;
    line-height: 1em;
}

.order-item-subbtitle {
    color: #b0b0b0;
    font-size: 12px;
    white-space: nowrap;
}

.order-item {
    padding: 10px 20px;
    font-size: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
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
    height: calc(100vh - 154px);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #f2f2f2;
    border-radius: 5px;
    margin-bottom: 10px;
}

.left {
    border: 1px solid #d5d5d5;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.counter-component {
    border: solid 1px #f5f5f5;
    display: flex;
    padding: 15px 20px;
    height: 56px;
    align-items: center;
    margin-right: 5px;
    justify-content: center;
    background-color: #ffffff;
    border-radius: 16px;
}

.counter-component__qty {
    margin: 0 10px;
    min-width: 24px;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
}

.add-btn {
    border-radius: 16px;
    flex: 1;
    margin-left: 5px;
    color: #000;
    height: 56px;
}

.add-btn button {
    width: 100%;
    text-transform: capitalize;
    font-size: 17px;
    letter-spacing: 0.1px;
    border-radius: 16px;
    height: 56px !important;
}

.selected-dish-top {
    display: flex;
    height: 280px;
    overflow: hidden;
}

.selected-dish-composition {
    padding: 16px;
    font-size: 14px;
    background: #fafafa;
    line-height: 22px;
    color: #000;
}

.rest-info-bottom {
    position: sticky;
    top: 60px;
    z-index: 9;
}

.dish-img-mobile-selected {
    display: block;
    height: 100%;
    flex: 1;
    object-fit: cover;
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
    font-weight: 400;
    line-height: 19px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.dish-info {
    height: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 8px;
}

.info-price {
    color: #000 !important;
    font-size: 17px;
    font-weight: 400;
    letter-spacing: -0.5px;
    height: 48px;
    min-width: 48px;
    display: flex;
    transition: opacity, background-color 100ms;
    align-items: center;
    border-radius: 16px;
    align-content: center;
    justify-content: center;
    background-color: #F1F0ED;
    margin: 0 9px 8px;
}

.dish-info__price {
    color: #c2c0be;
    font-size: 13px;
    margin-right: 14px;
    position: relative;
}

.dish-info__price:after {
    content: "";
    position: absolute;
    left: calc(100% + 7px);
    top: 50%;
    transform: translateY(-50%);
    display: block;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background-color: #c2c0be;
}

.info-weight {
    color: #c2c0be;
    font-size: 13px;
    text-align: center;
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
    width: 100%;
    font-size: 14px;
    margin: 9px 0;
}

.delivery-info {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    padding: 2px 20px 4px;
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
    width: 100%;
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;
    padding-bottom: 12px;
}

.mobile-mode_header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    z-index: 5;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: calc(100% - 8px);
    overflow: hidden;
    max-width: 100%;
}

.mobile-mode_header-btn {
    flex: 0 0 24px;
    width: 24px;
    height: 24px;
    margin: 20px;
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
    font-size: 22px;
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
    padding-left: 20px;
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
    width: calc(50% - 40px);
    margin: 20px;
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
    position: relative;
    z-index: 0;
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
    /*background-image: linear-gradient(to bottom, #ffffff, #f2f2f2 480px);*/
    padding: 25px 60px;
    background-color: #f2f2f2;
    border-top: none;
}

.description-who {
    font-size: 14px;
}

.description-price {
    font-size: 14px;
}

.delivery-options .info-left {
    display: flex;
    flex-direction: row;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
}

.delivery-options .info-left:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.delivery-options .price-text {
    padding-top: 10px;
}

.delivery-options .rest-info-text {
    padding-top: 10px;
}

.moped-block {
    width: 28px;
    height: 42px;
    position: relative;
    padding-left: 5px;
    margin-right: 16px;
    background-color: #00a646;
    border-radius: 4px;
}

.treangule {
    top: 6px;
    right: -15px;
    width: 30px;
    height: 30px;
    position: absolute;
    transform: scaleX(0.4) rotate(45deg);
    background-color: #00a646;
    border-top-right-radius: 4px;
}

.moped {
    background-color: #00a646;
    border-radius: 3px;
    width: 24px;
    height: 24px;
    padding: 9px 0;
    z-index: 1;
    position: relative;
    box-sizing: content-box;
    background-size: 100%;
    background-image: url("../assets/deliveryRestIcon.svg");
    background-repeat: no-repeat;
    background-position: center;
}

.info-delivery {
    opacity: .8;
    margin-top: 15px;
    color: #fff;
    text-decoration: none;
}

.restuarant-name {
    margin: 2px 0 8px;
    font-size: 60px;
    font-weight: bold;
    line-height: 1.08;
}

.top-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 80px 28px;
    height: 100%;
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
    height: 398px;
}

.right {
    width: 310px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: sticky;
    top: 90px;
    height: calc(100vh - 100px);
    overflow: hidden;
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
    display: grid;
    grid-template-columns: calc(100% - 320px) 310px;
    grid-column-gap: 10px;
    margin: auto;
    max-width: 1500px;
    width: 100%;
    padding: 3rem 0 1rem;
}

@media screen and (max-width: 1265px) {
    .top-wrapper {
        padding: 0 40px 28px;
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

    .modal-change-products__title {
        display: none;
    }

    .modal-change-products__continue {
        flex: 1 0 0;
        margin-right: 8px;
        height: 56px !important;
        border-radius: 16px;
    }

    .modal-change-products__cancel {
        border-radius: 16px;
        flex: 1 0 0;
        height: 56px !important;
        margin-left: 8px !important;
        margin-right: 0 !important;
        background: transparent;
        border: 1px solid #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: initial !important;
    }

    .warning-info {
        font-weight: 600;
        line-height: 21px;
        margin: 0 -20px;
        padding: 4px 20px 26px;
        background-color: transparent;
        border-top: none;
        border-bottom: none;
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

.rest-info-center__rating-icon {
    font-size: 18px !important;
    margin-right: 6px;
    color: #000000 !important;
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
    margin-right: 8px;
}
</style>
