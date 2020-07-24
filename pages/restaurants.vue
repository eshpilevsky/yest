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
                                <div>{{restInfo.rating}}</div>
                            </v-chip>
                            <div class="info-delivery white--text">
                                Доставка еды • Санкт-Петербург
                            </div>
                            <h1 class="restuarant-name white--text pb-3">
                                {{restInfo.name}}
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
                                                        {{restInfo.name}}
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
                    <v-tabs v-model="tab" class="catalog-tabs">
                        <v-tab v-for="category in restCategory" :key="category.id" @click="scroll(`category${category.id}`)">
                            {{category.name}}
                        </v-tab>
                    </v-tabs>
                    <v-divider />
                </div>
                <div class="catalog-list">
                    <div v-for="category in restCategory" :key="category.id">
                        <h2 v-intersect="categoryNameIntersect" :id='`category${category.id}`' class="category-title">
                            {{category.name}}
                        </h2>
                        <div class="dishs-list">
                            <div v-for="(item, index) in 4" :key="`dishCard${index}`" class="dishs-list-item">
                                <cardDish :name='dish.name' :description='dish.description' :price='dish.price' :img='dish.img' :weight='dish.weight' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div cols-2 xl8 class="right">
                <div class="right-map">
                    <div class="mapimg"></div>
                    <map-btn class="right-map-btn" ref="mapBtn" />
                </div>
            </div>
        </div>
    </div>
    <div class="mobile-mode">
        <div class="mobile-mode_header">
            <v-icon>arrow_back</v-icon>
            <v-icon>search</v-icon>
        </div>
        <div class="mobile-rest-info">
            <div class="rest-info-top">
                <h1 class="info-top-title">
                    {{restInfo.name}}
                </h1>
                <v-icon>info</v-icon>
            </div>
            <div class="rest-info-center">
                <v-chip @click="showRatingSheet = !showRatingSheet" :color="showRatingSheet == true ? 'primary': null">
                    <v-icon>star</v-icon>
                    {{restInfo.rating}}
                </v-chip>
                <!-- add to next line v-if="this.getCurrentCoords.length > 0"-->
                <v-chip v-if="this.getCurrentCoords.length > 0">
                    {{restInfo.deliveryTime.min}} - {{restInfo.deliveryTime.max}} мин
                </v-chip>
                <!-- add to next line v-if="this.getCurrentCoords.length > 0"-->
                <v-chip @click="showDeliveryOption = !showDeliveryOption" :color="showDeliveryOption == true ? 'primary': null">
                    Доставка {{restInfo.deliveryPrice.min}} - {{restInfo.deliveryPrice.max}} Р
                </v-chip>
                <v-bottom-sheet v-model="showRatingSheet">
                    <v-sheet>
                        <div class="sheet-top">
                            <h2 class="sheet-top-title">Рейтинг</h2>
                            <v-icon>close</v-icon>
                        </div>
                        <div class="rating-info-bottom">
                            {{restInfo.rating}}
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
                            <div>1 руб</div>
                            <div>на заказ от 10 руб</div>
                        </div>
                    </v-sheet>
                </v-bottom-sheet>
            </div>
            <div class="rest-info-bottom">
                <v-tabs v-model="tab" class="catalog-tabs">
                    <v-tab v-for="category in restCategory" :key="category.id" @click="scroll(`category${category.id}`)">
                        <v-chip>
                            {{category.name}}
                        </v-chip>
                    </v-tab>
                </v-tabs>
            </div>
            <div class="mobile-catalog">
                <div v-for="category in restCategory" :key="category.id">
                    <h2 v-intersect="categoryNameIntersect" :id='`category${category.id}`' class="category-title">
                        {{category.name}}
                    </h2>
                    <div class="dishs-list-mobile">
                        <div v-for="(item, index) in 6" :key="`dishCard${index}`" class="dishs-list-mobile-item" @click="showSelectedDish(dish)">
                            <!-- <cardDish :name='dish.name' :description='dish.description' :price='dish.price' :img='dish.img' :weight='dish.weight' /> -->
                            <v-card class="dish-card">
                                <div class="card-dish-top">
                                    <v-img :src="dish.img" lazy-src='https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg' :alt="dish.name" class="dish-img-mobile" />
                                </div>
                                <div class="card-dish-bottom">
                                    <h3 class="dish-name">
                                        {{dish.name}}
                                    </h3>
                                    <div class="dish-info">
                                        <div class="info-price">
                                            {{dish.price}} руб
                                        </div>
                                        <div class="info-weight">
                                            {{dish.weight}} г
                                        </div>
                                    </div>
                                </div>
                            </v-card>
                        </div>
                    </div>
                    <v-bottom-sheet v-model="showDish">
                        <v-sheet>
							<div class="selected-dish-top">
								<v-img :src="selectedDish.img" lazy-src='https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg' :alt="selectedDish.name" class="dish-img-mobile" />
							</div>
							<div class="selected-dish-composition">
								{{selectedDish.composition}}
							</div>
							<div class="d-flex flex-row justify-space-between">
								<div class="dish-bottom-name">
									{{selectedDish.name}}
								</div>
								<div class="dish-bottom-price">
									{{selectedDish.price}} руб
								</div>
							</div>
							<div class="d-flex flex-row justify-space-between ">
								<div class="d-flex flex-row counter-component">
									<v-icon @click="dishCounter--">
										plus_one
									</v-icon>
									{{dishCounter}}
									<v-icon @click="dishCounter++">
										plus_one
									</v-icon>
								</div>
								<div class="add-btn">
									<v-btn @click="addToBasket()">Добавить</v-btn>
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

import {
    mapGetters
} from "vuex";
export default {
    name: 'restaurants',
    components: {
        MapBtn,
        cardDish,
    },
    data() {
        return {
            restInfo: {
                name: 'Slurp Ramen Bar',
                rating: 4.9,
                deliveryTime: {
                    min: 20,
                    max: 50,
                },
                deliveryPrice: {
                    min: 0,
                    max: 15,
                }
            },
            dish: {
                name: 'Салат Цезарь с цыпленком',
                description: 'Капуста пекинская, томаты черри, филе куриное, сыр пармезан, сухарики пшеничные, соль, перец, паприка красная, соус',
                price: 15,
                img: "https://eda.yandex/images/1387779/a3e887932dd0fb6d0f716d34c6b6afd7-450x300.jpeg",
                weight: 230,
                composition: 'Куриная грудка, соленые огурцы, помидоры, зеленый горошек, майонез, яйцо, куриная грудка, листья салата'
            },
            restCategory: [{
                    name: 'Популярные блюда',
                    id: 1,
                },
                {
                    name: 'Добавки в блины',
                    id: 2,
                },
                {
                    name: 'Блины сладкие',
                    id: 3,
                },
                {
                    name: 'Блины сытные',
                    id: 4,
                },
                {
                    name: 'Напитки',
                    id: 5,
                },
            ],
            tab: null,
            showRatingSheet: false,
            showDeliveryOption: false,
            selectedDish: {},
            showDish: false,
            dishCounter: 1,
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: "zone/getSelectedZone",
            getSelectedCategory: "user/getSelectedCategory",
            getCurrentCoords: "map/getCurrentCoords",
            getUserLocation: "user/getUserLocation"
        }),
	},
	watch: {
		dishCounter(newValue) {
			return newValue
		}
	},
    methods: {
		addToBasket(){
            this.showDish = false
		},
        showSelectedDish(dish) {
            console.log('showSelectedDish -> dish', dish)
			this.selectedDish = dish
			setTimeout(() => {
				this.showDish = true
			}, 100);
        },
        scroll(id) {
            this.tab = id
            document.getElementById(id).scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });

        },
        categoryNameIntersect(entries, observer) {
            console.log('categoryNameIntersect -> entries', entries)
            // let target = entries[0].target
            // console.log('categoryNameIntersect -> target', target)
            // this.tab = target.id
            // if (entries[0].isIntersecting) {
            //     this.tab = "tab-3"
            // } else {
            //     this.tab = "tab-1"
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


.counter-component{
	border: solid 1px #f5f5f5;
    display: flex;
    padding: 13px 20px;
    align-items: center;
    margin-right: 5px;
    justify-content: center;
    background-color: #ffffff;
}
.selected-dish-composition{
	padding: 16px;
    font-size: 14px;
    background: #fafafa;
    line-height: 22px;
}

.rest-info-bottom {
    position: sticky;
    top: 65px;
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

.right-map {
    position: sticky;
    top: 100px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 1rem;
}

.category-title {
    font-weight: bold;
    font-size: 24px;
    margin-left: 10px;
    line-height: 1.1666666666666667;
    margin-bottom: 30px;
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
}

.dishs-list-mobile-item {
    width: 44%;
    margin: 10px;
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
    width: 100vw;
    max-width: 55vw;
    /* height: 40vh; */
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
    }
}
</style>
