<template>
<div class="restuarants-container">
    <h2 class="restorane-title" id="restTitle">Рестораны</h2>
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
                        <img class="card-options__delivery" src="../assets/deliveryIcon.svg"/>
                        <span class="card-options__rating">
                          <v-icon class="rating-icon" color="#FFFADF">star</v-icon>
                          <span>{{ item.rating }}</span>
                        </span>
                      <span class="card-options__currency">
                        <img class="currency-icon" src="../assets/purseIcon.svg"/>
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
        <v-btn color="primary" class="showMore-btn" @click="showMore()" v-show="this.totalCount > limit" :loading="loadingShowMore">Показать ещё</v-btn>
    </div>
</div>
</template>

<script>
import ApiService from "../common/api.service";

import {
    mapGetters
} from "vuex";

export default {
    name: "Restorane",
    props: {
        restaurantsList: Array,
        currentCategory: Object,
    },
    data() {
        return {
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
            getSelectedZone: "zone/getSelectedZone",
            getSelectedCategory: "user/getSelectedCategory",
            getCurrentAddress: "map/getCurrentAddress",
            getCurrentCoords: "map/getCurrentCoords"
        }),
        checkAddress() {
            return this.getCurrentAddress.length > 0 ? true : false
        },
        swiper() {
            return this.$refs.mySwiper.$swiper;
        },
    },
    watch: {
        getSelectedCategory(newValue, oldValue) {
            this.getRestaurants(this.getCurrentCoords.length > 0 ? this.getCurrentCoords[0] : 0, this.getCurrentCoords.length > 0 ? this.getCurrentCoords[1] : 0)
        },
        getSelectedZone(newValue, oldValue) {
            this.getRestaurants(this.getCurrentCoords.length > 0 ? this.getCurrentCoords[0] : 0, this.getCurrentCoords.length > 0 ? this.getCurrentCoords[1] : 0)
		},
		loadingShowMore(newValue){
			return newValue
		}
    },
    methods: {
        getRestaurants(latitude, longitude) {
            this.notFound = false;
            if (latitude !== 0 && longitude !== 0) {
                this.params = {};
                this.params = {
                    zone_id: parseInt(this.getSelectedZone.id),
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    start: 0,
                    limit: 100
                };
            } else {
                this.params = {};
                this.params = {
                    zone_id: this.getSelectedZone.id,
                    start: 0,
                    limit: 100
                };
			}
			if (this.getSelectedCategory.id == 0) {
				this.urlStr = `/restaurants`
			} else {
				this.urlStr = `/restaurants/category/${this.getSelectedCategory.id}`
			}
            ApiService.post(this.urlStr, this.params)
                .then(response => {
                    const resp = response.data;
                    const rest = resp.restaurants;
                    if (resp.status === 200) {
                        this.restaurants = [];
						// this.restaurants = rest;
						this.totalCount = rest.length
                        this.restaurants = this.computedOpenTime(rest).slice(0, this.limit)
                        console.log('getRestaurants -> this.restaurants', this.restaurants[0])
                        this.notFound = false;
                    } else if (resp.status === 404) {
                        this.restaurants = [];
                        this.notFound = true;
                    }
                })
                .catch(error => {
                    console.error(error);
                });
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
            this.$router.push(`/${this.getSelectedZone.alias}/restaurant/${info.restaurant_id}-${modifName.toLowerCase()}`)
        },
        async showMore() {
			this.loadingShowMore = true
            console.log('showMore -> this.loadingShowMore', this.loadingShowMore)
            this.limit += 24;
            await this.getRestaurants(this.getCurrentCoords.length > 0 ? this.getCurrentCoords[0] : 0, this.getCurrentCoords.length > 0 ? this.getCurrentCoords[1] : 0)
			this.loadingShowMore = false
        },
        computedOpenTime(res) {
            const openRestorants = [];
            const closeRestorants = [];
            const currentDay = new Date().getDay();
            const currentTime = new Date().getTime();
            res.forEach((item, i, arr) => {
                const op = item.operation_time;
                const buffer = [];
                if (item.operation_time.length > 6) {
                    op.forEach((optime, index, operationTimeArr) => {
                        if (optime.day === currentDay) {
                            buffer.push(optime);
                        }
                    });
                    let closeTime = buffer[0].close_time
                    const openTime =
                        buffer.length > 1 ? buffer[1].open_time : buffer[0].open_time;

                    const closeTimeHour = closeTime.slice(0, 2);
                    const closeTimeMin = closeTime.slice(3, 5);
                    const closeTimeSec = closeTime.slice(6, 8);
                    const closeTimeTimestamp = new Date();
                    closeTimeTimestamp.setHours(closeTimeHour);
                    closeTimeTimestamp.setMinutes(closeTimeMin);
                    closeTimeTimestamp.setSeconds(closeTimeSec);

                    const openTimeHour = openTime.slice(0, 2);
                    const openTimeMin = openTime.slice(3, 5);
                    const openTimeSec = openTime.slice(6, 8);
                    const openTimeTimestamp = new Date();

                    openTimeTimestamp.setHours(openTimeHour);
                    openTimeTimestamp.setMinutes(openTimeMin);
                    openTimeTimestamp.setSeconds(openTimeSec);

                    item.today_close_time = closeTimeTimestamp.getTime();
					// console.log(`#${i} - ${arr.length}, ${item.name} -closeTime- ${closeTime}`);
                    item.today_open_time = openTimeTimestamp.getTime();

                    if (buffer.length !== 1) {
                        item.today_close_time += 86400000;
                    }

                    if (currentTime < item.today_close_time) {
                        openRestorants.push(item);
                        item.is_open = true;
                    } else {
                        closeRestorants.push(item);
                        item.is_open = false;
                    }
                }
            });
            return openRestorants.concat(closeRestorants);
        }
    },
    created() {
		if(this.restaurantsList !== 404){
			this.totalCount = this.restaurantsList.length
			this.restaurants = this.restaurantsList.slice(0, this.limit)
		} else {
			this.restaurants = [];
            this.notFound = true;
		}
    }
};
</script>

<style scoped>
.card-options {
    display: flex;
    align-items: center;
}

.card-options__delivery {
    margin-right: 5px;
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
}

.showMore-btn {
    margin: 0 90px !important;
    width: 85% !important;
    margin-bottom: 20px !important;
    color: #000 !important;
    font-weight: bold !important;
    text-transform: none !important;
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
    min-height: 222px;
    max-height: 222px;
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
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid rgba(245, 245, 245, 0.6);
}

@media screen and (max-width: 1000px) {
    .list-item-block {
        min-height: 280px;
        margin: 10px 20px;
    }
}

@media screen and (max-width: 992px) {
    .restorane-list {
      padding: 0;
    }

    .restorane-title {
      padding: 20px 20px 0px 20px;
    }

    .showMore-btn {
      width: 94% !important;
      margin-top: 20px !important;
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
        margin: 20px 27px;
    }

    .restorane-title {
        padding: 10px 30px;
        padding-bottom: 0;
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
