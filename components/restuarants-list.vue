<template>
<v-card class="restuarants-container">
    <h2 class="restorane-title" id="restTitle" v-show='!notFound'>Рестораны</h2>
    <v-flex cols-12 wrap class="restorane-list">
        <v-flex cols-12 md4 sm6 xs12 v-for="(item, index) in this.restaurants" :key="index" class="restorane-list-item" @click="goToRes(item)">
            <div class="list-item-block">
                <img contain :lazy-src="notFindImg" :src="item.cover" class="restorane-logo" :class="{closeRestorane:item.is_open == false }" />
                <div class="block-bottom">
                    <div class="card-time" v-show="checkAddress">
                        <p class="card-time__quantity">{{item.time.min}} &mdash; {{item.time.max}}</p>
                        <p class="card-time__unit">мин</p>
                    </div>
                    <div class="card-title">
                        <div class="restorane-list-item-name" :class="{hidetime: checkAddress}">{{ item.name }}</div>
                        <v-chip class="item-bottom-right-mob" color="primary" v-show="item.rating !== 0">
                            <v-icon color="#FFFADF">star</v-icon>
                            <div class="rating">{{ item.rating }}</div>
                        </v-chip>
                    </div>
                    <div class="card-options">
                        <img class="card-options__delivery" src="@/assets/deliveryIcon.svg" />
                        <span class="card-options__rating">
                            <v-icon class="rating-icon" color="#FFFADF">star</v-icon>
                            <span>{{ item.rating }}</span>
                        </span>
                        <span class="card-options__currency">
                            <img class="currency-icon" src="@/assets/purseIcon.svg" />
                            BYN
                        </span>
                    </div>
                </div>
            </div>
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
        <v-btn color="primary" class="showMore-btn" @click="showMore()" v-show="this.counterRest > limit" :loading="loadingShowMore">Показать ещё</v-btn>
    </div>
    <v-overlay :value="restOverlay" z-index="100" :absolute="absolute" :color="wiw < 992 ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.5)'" :opacity="wiw < 992 ? 1 : 0.5">
        <v-progress-circular indeterminate size="24" v-show="wiw < 992" color="black"></v-progress-circular>
    </v-overlay>
</v-card>
</template>

<script>
import ApiService from "../common/api.service";
import axios from 'axios'

import {
    mapGetters
} from "vuex";
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
            restOverlay: true,
            absolute: true,
            serachAdress: "",
            restaurants: [],
            selcatmass: [],
            mergeMassive: [],
            loadingRest: true,
            notFound: false,
            limit: 24,
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
            return newValue
        },
        getCurrentAddress(newValue) {
			console.log('getCurrentAddress -> newValue', newValue)
			this.getRestWithCoords()

        }
    },
    methods: {
        async getRestWithCoords() {
			let queryString;
			if (this.currentCategory.id !== 0) {
				queryString = `https://yestapi.xyz/restaurants`
			} else {
				queryString = `https://yestapi.xyz/restaurants/category/${this.currentCategory.id}`
			}

			let latitude = Cookie.get('latitude')
			let longitude = Cookie.get('longitude')
            let restaurantsList = await axios.post(queryString, {
                zone_id: parseInt(this.currentZone.id),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                start: 0,
                limit: 100
            })
            let restaurantsListData = restaurantsList.data.restaurants
            this.restaurants = restaurantsListData.slice(0, this.limit)

        },
        calcTime(mass) {
            const today = new Date().getDay();
            const openTime = mass[today - 1].open_time;
            const closeTime = mass[today].close_time;
            return `${openTime.slice(0, 5)} - ${closeTime.slice(0, 5)}`;
        },
        translite(str) {
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
        goToRes(info) {
            let name = this.translite(info.name)
            let modifName = name.replace(' ', '-')
            this.$router.push(`/${this.currentZone.alias}/restaurant/${info.restaurant_id}-${modifName.toLowerCase()}`)
        },
        showMore() {
            this.loadingShowMore = true
            this.limit += 24;
            this.restaurants = this.restaurantsList.slice(0, this.limit)
            this.loadingShowMore = false
        }
    },
    created() {
		console.log('created -> this.restaurantsList', this.restaurantsList[0])
        if (this.restaurantsList[0] !== '404') {
            this.restOverlay = true
            setTimeout(() => {
                this.counterRest = this.restaurantsList.length
                this.restaurants = this.restaurantsList
                setTimeout(() => {
                    this.restaurants = this.restaurantsList.slice(0, this.limit)
                }, 100);
                this.restOverlay = false
            }, 250);
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
    box-shadow: 0 4px 40px rgb(230, 230, 230);
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
    border-top: 4px solid rgba(245, 245, 245, 0.6) !important;
    box-shadow: none !important;
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
