<template>
<div>
    <div class="desktop-mode">
        <div class="rest-cotainer">
            <div xl8 class="left">
                <div class="left-top">
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
                                            Доставка Яндекс.Еды
                                        </div>
                                        <div class="description-price ">
                                            Доставка 29–99 ₽. Бесплатно при заказе от 1500 ₽
                                        </div>
                                    </div>
                                </v-col>
                                <v-col :md='3' class="white--text">
                                    <p>
                                        Заказ от
                                    </p>
                                    <p>
                                        1500 ₽
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
                                                    <span>
                                                        Каштановая аллея, 2
                                                    </span>
                                                    <span>
                                                        ПирогиЗдоровая едаДесертыЛанчиДетское меню₽
                                                    </span>
                                                    <p>
                                                        Исполнитель (продавец): ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ЛИАНА", 194354, Санкт-Петербург, ул Сикейроса, д 11, к 1 литер а, пом 15Н, ИНН 7802688786, рег.номер 1197847087173.
                                                        Режим работы ресторана: с 09:00 до 21:00
                                                    </p>
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
                        <v-tab v-for="(category) in restuarant.menu" :key="category.cat_id" @click="scroll(`category${category.cat_id}`)">
                            {{category.name}}
                        </v-tab>
                    </v-tabs>
                    <v-divider />
                </div>
                <div class="catalog-list">
                    <div v-for="category in restuarant.menu" :key="category.cat_id">
                        <div class="category-title">
                            <h2 v-intersect="categoryNameIntersect" :id='`category${category.cat_id		}`'>
                                {{category.name}}
                            </h2>
                            <span class="category-list-counter">
                                {{category.dishes.length}}
                            </span>
                        </div>
                        <div class="dishs-list">
                            <div v-for="(item, index) in category.dishes" :key="`dishCard${index}`" class="dishs-list-item" @click="addToBasket(item)">
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
                        <div v-if="this.getSelectedDishs.length > 0">
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
                <v-btn :disabled="this.getTotalPrice <= 0" color="primary">Оформить заказ</v-btn>
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
                            <!-- {{this.selectedDish.options}} -->
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
            <v-icon @click="this.$router.go(-1)">arrow_back</v-icon>
            <v-icon>search</v-icon>
        </div>
        <div class="mobile-rest-info">
            <div class="rest-info-top">
                <h1 class="info-top-title">
                    {{restuarant.name}}
                </h1>
                <v-icon>info</v-icon>
            </div>
            <div class="rest-info-center">
                <v-chip @click="showRatingSheet = !showRatingSheet" :color="showRatingSheet == true ? 'primary': null">
                    <v-icon>star</v-icon>
                    {{restuarant.rating ? restuarant.rating: 'Мало оценок'}}
                </v-chip>
                <!-- add to next line v-if="this.getCurrentCoords.length > 0"-->
                <!-- <v-chip>
                    {{restInfo.deliveryTime.min}} - {{restInfo.deliveryTime.max}} мин
                </v-chip> -->
                <!-- add to next line v-if="this.getCurrentCoords.length > 0"-->
                <v-chip @click="showDeliveryOption = !showDeliveryOption" :color="showDeliveryOption == true ? 'primary': null">
                    Доставка 10 - 20
                </v-chip>
                <v-bottom-sheet v-model="showRatingSheet">
                    <v-sheet>
                        <div class="sheet-top">
                            <h2 class="sheet-top-title">Рейтинг</h2>
                            <v-icon>close</v-icon>
                        </div>
                        <div class="rating-info-bottom">
                            {{restuarant.rating}}
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
                            <div>1 BYN</div>
                            <div>на заказ от 10 BYN</div>
                        </div>
                    </v-sheet>
                </v-bottom-sheet>
            </div>
            <div class="rest-info-bottom">
                <v-tabs v-model="tab" class="catalog-tabs">
                    <v-tab v-for="category in restuarant.menu" :key="category.id" @click="scroll(`category${category.id}`)">
                        <v-chip>
                            {{category.name}}
                        </v-chip>
                    </v-tab>
                </v-tabs>
            </div>
            <div class="mobile-catalog">
                <div v-for="category in restuarant.menu" :key="category.id">
                    <h2 v-intersect="categoryNameIntersect" :id='`category${category.id}`' class="category-title">
                        {{category.name}}
                    </h2>
                    <div class="dishs-list-mobile">
                        <div v-for="(item, index) in category.dishes" :key="`dishCard${index}`" class="dishs-list-mobile-item" @click="showSelectedDish(item)">
                            <v-card class="dish-card">
                                <div class="card-dish-top">
                                    <v-img :src="'https://img.eatmealby.com/resize/dish/400/'+item.image" lazy-src='https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg' :alt="item.name" class="dish-img-mobile" />
                                </div>
                                <div class="card-dish-bottom">
                                    <h3 class="dish-name">
                                        {{item.name}}
                                    </h3>
                                    <div class="dish-info">
                                        <div class="info-price">
                                            <!-- {{item.sizes[0].price}} BYN -->
                                        </div>
                                        <div class="info-weight">
                                            <!-- {{item.sizes[0].weight}} г -->
                                        </div>
                                    </div>
                                </div>
                            </v-card>
                        </div>
                    </div>
                    <v-bottom-sheet v-model="showDish">
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
                            <div class="d-flex flex-row justify-space-between m-5">
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
                                    <v-btn color="primary" @click="addToBasket()">Добавить</v-btn>
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
            console.log('getSelectedDishs -> newValue', newValue)
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
    },
    methods: {
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
            document.getElementById(id).scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
            this.tab = id
        },
        categoryNameIntersect(entries, observer) {
            console.log('categoryNameIntersect -> entries', entries[0].target.innerText)
            // let target = entries[0].target
            // if (entries[0].isIntersecting) {
            // 	this.tab = entries[0].target.id
            // 	console.log(this.tab);
            // } 
        }
    },
}
</script>

<style>
.v-application p {
    margin-bottom: 0 !important;
}
</style><style scoped>

.dish-bottom-name{
	flex: 0 1 auto;
    color: #000000;
    line-height: 1.25;
    margin-right: auto;
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
    padding-top: 80%;
    margin: auto;
    text-align: center;
}

.right-my-order {
    height: 84vh;
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
    width: 75%;
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
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.rest-info-center {
    padding: 0 16px;
}

.card-dish-bottom {
    display: flex;
    flex-direction: column;
}

.dish-name {
    padding: 12px;
}

.dish-info {
    width: 100%;
    height: 34px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.info-price {
    color: #3F3F3F;
    font-size: 14px;
    white-space: nowrap;
}

.info-weight {
    color: #e0e0e0;
    font-size: 12px;
}

.dish-card {
    border-radius: 10px !important;
    width: 90%;
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
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    padding: 0 16px;
}

.mobile-mode_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
	padding: 15px 15px 0 15px;
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
    font-weight: bold;
    font-size: 24px;
    margin-left: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 12px;
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
    width: 47%;
    margin: 10px;
}

.dishs-list-mobile {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
}

.dishs-list-mobile-item {
    margin: 10px;
    max-width: 166px;
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
    border: solid 1px #eeeeee;
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
    background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))), url("https://eda.yandex/images/1387779/4f8c9613c25d940949b9e45825d4f1ca-1100x825.jpeg");
    background-position: center;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.right {
    width: 100%;
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
}

@media screen and (max-width: 450px) {

    .desktop-mode {
        display: none;
    }

    .mobile-mode {
        display: flex;
        flex-direction: column;
		margin-top: -3rem;
    }
}
</style>
