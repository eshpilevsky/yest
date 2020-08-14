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
                            <div class="info-delivery white--text">
                                Доставка еды • {{this.getSelectedZone.name}}
                            </div>
                            <h1 class="restuarant-name white--text pb-3">
                                {{restuarant.name}}
                            </h1>
                            <div class="delivery-options d-flex flex-row justify-space-between">
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
                                            Доставка {{this.sortDeliverFee[this.sortDeliverFee.length-2].deliveryFee}} - {{this.sortDeliverFee[0].delivery}} BYN. Бесплатно при заказе от {{this.sortDeliverFee[this.sortDeliverFee.length-1].min}} BYN
                                        </div>
                                    </div>
                                </div>
                                <div class="white--text price-text">
                                    <p>
                                        Заказ от
                                    </p>
                                    <p>
                                        {{this.sortDeliverFee[0].min}} BYN
                                    </p>
                                </div>
                                <div class="white--text">
                                    <v-menu bottom origin="center center" z-index="999" transition="scale-transition" nudge-left='100' nudge-bottom='50'>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn color="transparent" class="restaurant-info-btn" large v-bind="attrs" v-on="on">
                                                <p class="info-btn-text">
                                                    Информация <br /> о ресторане
                                                </p>
                                                <img src="../assets/restaurantInfoIcon.svg" alt="restaurant info">
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
                        <v-tab class="tab-item" active-class="tab-item--active" height="70px" v-for="(category, index) in restuarant.menu" :key="category.cat_id" @click="scroll(`desktop_${index}`)">
                            {{category.name}}
                        </v-tab>
                    </v-tabs>
                    <v-divider />
                </div>
                <div class="catalog-list">
                    <div v-for="(category, index) in restuarant.menu" :key="category.cat_id">
                        <div class="category-title">
                            <h2 v-intersect="categoryNameIntersect" :id='`desktop_${index}`'>
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
                            <div v-for="order in this.orderList" :key="order.selectSize.id" class="order-item">
                                <div class="d-flex flex-column">
                                    <div class="d-flex flex-column order-item-info">
                                        <div class="item-name">
                                            {{order.name}}
                                            <span class="order-item-subbtitle">
                                                {{order.selectSize.weight}}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="order-item-subbtitle">
                                        {{order.selectSize.name}}
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
                                        {{order.selectSize.count}}
                                    </div>
                                    <div class="counter-minus" @click="decrement(order)">
                                        <v-icon>
                                            {{order.selectSize.count == 1 ? 'close' : 'remove'}}
                                        </v-icon>
                                    </div>
                                </div>
                                <div class="pl-4">
                                    x {{order.selectSize.price }} BYN
                                </div>
                            </div>
                            <div class="delivery-options">
                                <v-divider />
                                <div class="d-flex flex-row justify-space-between align-center py-2">
                                    <span class="delivery-title">
                                        Доставка
                                    </span>
                                    <span class="delivery-count">
                                        {{computedDeliveryCost().delivery ? computedDeliveryCost().delivery : computedDeliveryCost().deliveryFee}} BYN
                                    </span>
                                </div>
                                <p class="more-delivery">
                                    {{computedFreeDeliveryCost()}}
                                </p>
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
                        <div class="d-flex flex-row justify-space-between pb-3" >
                            <div class="select-option-title" color="secondary">
                                Выберите опции
                            </div>
                            <div class="close-select-option" @click="closeOptionMenu()">
                                <v-icon color="#000">close</v-icon>
                            </div>
                        </div>
                        <div class="options-list" v-show="this.selectedDish.sizes.length > 0">
                            <div class="sizes">
                                <div class="multi-title">
                                    Размер на выбор
                                </div>
                                <v-radio-group v-model="sizesRadioBtn" :mandatory="false" class="d-flex flex-row">
                                    <v-radio v-for="size in selectedDish.sizes" :key="size.id" :label="size.name" :value="size" color="primary"></v-radio>
                                </v-radio-group>
                            </div>
                            <div class="options" v-show="this.selectedDish.options.length > 0">
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
                                    {{(this.sizesRadioBtn.price * selectedDishCounter).toFixed(1)}} BYN
                                </div>
                            </div>
                        </div>
                    </v-card>
                </v-overlay>
                <v-overlay opacity="0.5" :dark='false' z-index="999" v-model="showorderForm">
                    <orderForm @closeCheckout='checkout()' />
                </v-overlay>
            </client-only>
        </div>
    </div>
    <div class="mobile-mode">
        <div class="mobile-mode_header">
            <v-icon @click="goBack()">arrow_back</v-icon>
            <h1 class="info-top-title" v-show="showRestName">
                {{restuarant.name}}
            </h1>
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
                        <v-icon class="rest-info-center__rating-icon">star</v-icon>
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
                                <v-divider width='90%' class="mx-auto" />
                            </div>
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
                    <h2 v-intersect="categoryNameIntersect" :id="`mob_${index}`" class="category-title">
                        {{category.name}}
                    </h2>
                    <div class="dishs-list-mobile">
                        <div v-for="(item, index2) in category.dishes" :key="`dishCard${index2}`" v-show="item.status" class="dishs-list-mobile-item">
                            <v-card class="dish-card">
                                <div @click="showSelectedDish(item)">
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
                                                {{item.sizes[0] ? item.sizes[0].weight : ''}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="info-price" v-show="checkInbasket(item)">
                                        {{item.sizes[0] ? item.sizes[0].price.toFixed(1) : ''}} BYN
                                    </div>
                                    <div v-show="!checkInbasket(item)" class="dish-conter-mobile">
                                        <v-icon class="info-price px-3" @click="decrement(item)">
                                            remove
                                        </v-icon>
                                        <div class="dish-counter-mob">
                                            <!-- {{item.selectSize ? item.selectSize.count : '0'}}-->
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
                <v-bottom-sheet :light='true' overlay-opacity='0.5' v-model="showDish" scrollable persistent no-click-animation z-index='999'>
                    <v-card>
                        <v-card-text class="pa-0">
                            <div class="close-block">
                                <v-btn icon color="white" @click="showDish = false">
                                    <v-icon color="black">close</v-icon>
                                </v-btn>
                            </div>
                            <div class="selected-dish-top">
                                <img :src="'https://img.eatmealby.com/resize/dish/400/'+selectedDish.image" :alt="selectedDish.name" class="dish-img-mobile-selected" />
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
import MapBtn from '@/components/map/map-btn'
import orderForm from '@/components/order-form'
import cardDish from '@/components/restaurant/cardDish'
import restuarantInfo from '@/components/restaurant/restuarantInfo'
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

        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data
        store.dispatch('zone/setZone', zoneListData)
        let currentZoneNew = zoneListData.find((zones) => {
            if (zones.alias == params.region) {
                return zones
            }
        })

        if (currentZoneNew == undefined) {
            currentZoneNew = zoneListData[0]
        }

        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: currentZoneNew.id
        })

        let categoriesListData = categoriesList.data

        store.dispatch('user/allCategory', categoriesListData)

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
            showorderForm: false,
            showRestInfo: false,
            showRestName: false,
        }
    },
    methods: {
        computedDeliveryCost() {
            let deliveryMass = this.sortDeliverFee
            let price = parseInt(this.getTotalPrice)
            let finded = deliveryMass.find((cost) => {
                if (cost.min <= price && price <= cost.max) {
                    return cost
                }
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
            console.log('SAVE BASKET');
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
            });
            this.showOptionsmenu = false
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
            this.showorderForm = !this.showorderForm
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
            this.$router.push(`/${this.getSelectedZone.alias}`)
        },
        closeOptionMenu() {
            this.showOptionsmenu = false
        },
        decrement(dish) {
            this.showDish = false
            this.$store.dispatch('basket/decrementDishCounter', dish);
        },
        increment(dish) {
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
        categoryNameIntersect(entries, observer) {
			let visibleCategory =entries[0].target.id.split('_')
            this.tab = visibleCategory[1]
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
            this.dropBasket()
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
.v-input--selection-controls__input .v-icon {
    background-color: rgba(211, 211, 211, 0.4) !important;
    border-radius: 50% !important;
}

.v-application p {
    margin-bottom: 0 !important;
}

@media screen and (max-width: 992px) {
    .catalog-tabs {
        padding: 0 !important;
    }

    .catalog-tabs .v-slide-group__wrapper {
        margin-left: -42px !important;
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
</style><style scoped>
.tab-item {
    transition: none;
    font-size: 14px !important;
    text-transform: initial;
}

.tab-item.tab-item--active {
    color: #000;
    box-shadow: inset 0 -4px 0 #00a646;
}

.restaurant-rating .restaurant-rating__icon {
    margin-right: 6px;
    font-size: 18px;
}

.delivery-options {
    padding: 19px 0 11px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    flex-wrap: wrap;
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
    padding: 0 60px;
    background-color: #fff;
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
    cursor: pointer;
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
    top: 60px;
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
    font-weight: 400;
    line-height: 19px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.dish-info {
    height: 23px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.info-price {
    color: #000 !important;
    font-size: 17px;
    font-weight: 400;
    letter-spacing: -0.5px;
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
    margin: 0 auto 5px;
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
    padding: 10px 20px;
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
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    z-index: 5;
    background: #ffffff;
    display: flex;
    padding: 8px 8px 0;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: calc(100% - 8px);
    overflow: hidden;
    max-width: 100%;
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
    font-size: 16px;
}

.info-left {
    display: flex;
    flex-direction: row;
}

.moped-block {
    width: 28px;
    height: 42px;
    position: relative;
    padding-left: 5px;
    margin-right: 10px;
    background-color: #00a646;
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
    width: 320px;
    height: max-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
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
    display: grid;
    grid-template-columns: calc(100% - 340px) 320px;
    grid-column-gap: 20px;
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
