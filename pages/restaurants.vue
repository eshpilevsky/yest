<template>
<v-flex class="rest-cotainer">
    <div cols-10 xl8 :xs="12" class="left">
        <div class="left-top">
            <div class="top-wrapper">
                <div class="rating">
                    <v-chip color="primary">
                        <v-icon color="#FFFADF">star</v-icon>
                        <div>4.5</div>
                    </v-chip>
                    <div class="info-delivery white--text">
                        Доставка еды • Санкт-Петербург
                    </div>
                    <h1 class="restuarant-name white--text pb-3">
                        Slurp Ramen Bar
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
                            <v-btn color="primary" large>
                                <p class="info-btn-text">
                                    Информация о <br /> ресторане
                                </p>
                                <v-icon>info</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </div>
            <div class="catalog">
                <v-tabs class="catalog-tabs">
                    <v-tab href="#11">Популярные блюда</v-tab>
                    <v-tab href="#22">Добавки в блины</v-tab>
                    <v-tab href="#33">Блины сладкие</v-tab>
                    <v-tab href="#44">Блины сытные</v-tab>
                    <v-tab href="#55">Напитки</v-tab>
                </v-tabs>
                <v-divider />
            </div>
			<div class="catalog-list">
				<h2 id='11'>Популярные блюда</h2>
				<h2 id='22'>Добавки в блины</h2>
				<h2 id='33'>Блины сладкие</h2>
				<h2 id='44'>Блины сытные</h2>
				<h2 id='55'>Напитки</h2>
				<!-- <div class="">
					<div v-for="(item, index) in 10" :key="index" class="card">
						{{index}}
					</div>
				</div> -->
			</div>
        </div>
    </div>
    <div cols-2 xl8 class="right">
    </div>
</v-flex>
</template>

<script>
import ApiService from "../common/api.service";

import {
    mapGetters
} from "vuex";
export default {
    name: 'restaurants',
    data() {
        return {
            key: 'value'
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: "zone/getSelectedZone",
            getSelectedCategory: "user/getSelectedCategory",
            getUserCoordinate: "user/getUserCoordinate",
        }),
    }
}
</script>

<style>
.v-application p {
    margin-bottom: 0 !important;
}
</style><style scoped>


.card{
	height: 100px;
	width: 100px;
}

.catalog-list{
	height: 100%;
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
    height: 40vh;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.right {
    background-image: url("https://static-maps.yandex.ru/1.x/?l=map&ll=30.309158,59.963836&size=620,1572&scale=2&z=16&key=AP5KxFsBAAAAr4rWXAIApROgjMkXM-bOIOmMi2amb4pKEysAAAAAAAAAAADynFDWdJDGB1mMpov177fEMLqcCA==");
    height: 100vh;
    width: 100%;
    margin-left: 1rem;
}

.rest-cotainer {
    display: flex;
    flex-direction: row;
    padding-top: 3rem;
    margin: auto;
    max-width: 1420px;
}
</style>
