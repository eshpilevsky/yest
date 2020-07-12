<template>
<div class="containe">
    <h2 class="restorane-title" id="restTitle">Рестораны</h2>
    <v-flex cols-12 wrap class="restorane-list" v-if="loadingRest === false">
        <v-flex cols-12 md4 sm6 xs12 v-for="(item, index) in this.computedOpenTime" :key="index" class="restorane-list-item" @click="goToRes(item)">
            <div class="list-item-block">
                <img contain :lazy-src="notFindImg" :src="item.cover" class="restorane-logo" :class="{closeRestorane:item.is_open == false }" />
                <div class="block-bottom">
                    <div class="delivery-time-desktop" v-show="checkAddress">
                        <div class="time-title">
                            {{item.time.min}}-{{item.time.max}}
                        </div>
                        <div class="time-min">
                            мин
                        </div>
                    </div>
                    <div class="card-title">
                        <div class="restorane-list-item-name">{{ item.name }}</div>
                        <v-chip class="item-bottom-right-mob" color="primary" v-if="item.rating !== 0">
                            <v-icon color="#FFFADF">star</v-icon>
                            <div class="rating">{{ item.rating }}</div>
                        </v-chip>
                    </div>
                    <div class="list-item-bottom" :class="{noLocation: !checkAddress}">
                        <div class="bottom-left">
                            <v-chip class="item-bottom-right" color="primary" v-if="item.rating !== 0">
                                <v-icon color="#FFFADF">star</v-icon>
                                <div class="rating">{{ item.rating }}</div>
                            </v-chip>
                            <div class="bottom-tags-list" :class="{noLocationTag: !checkAddress}">
                                <span class="tags-list-item">{{ compudtedTags(item.tags) }}</span>
                            </div>
                        </div>
                        <div class="delivery-time-mobile" v-if="checkAddress">
                            {{item.time.min}} - {{item.time.max}} мин •&nbsp;
                        </div>
                    </div>
                </div>
            </div>
        </v-flex>
    </v-flex>
    <v-flex cols-12 wrap v-else class="loading">
        <v-skeleton-loader v-for="item in 9" :key="item" type="card" class="loading-item"></v-skeleton-loader>
    </v-flex>
    <div v-if="notFound == true" class="notFound">
        <div class="notfoundTitle">Нас тут ещё нет :(</div>
        <div class="notFoundDescription pa-4">Но мы подключаем десятки новых мест каждую неделю. Может быит, и здесь окажемся! Если оставите свою почту, сразу вам сообщим. Обещаем не спамить.</div>
        <div class="d-flex justify-center align-center pb-4">
            <v-btn color="primary" class="informMe-btn">Сообщить мне</v-btn>
        </div>
    </div>
    <div class="show-btn-block">
        <v-btn color="primary" class="showMore-btn" @click="showMore" v-show="itemCounter > limit">Показать ещё</v-btn>
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
            rubel: require("../assets/rubel.png"),
            notFindImg: require("../assets/logo.png"),
            swiperOptions: {
                slidesPerView: 3,
                spaceBetween: 30,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                }
            }
        };
    },
    methods: {
        compudtedTags(tags) {
            // let result = ''
            const resMass = [];
            tags.forEach((element, index) => {
                if (index < 3) {
                    resMass.push(element.name);
                }
            });
            const result = resMass.join(" • ");
            return result;
        },
        filterByCategory(restList) {
            if (this.getSelectedCategory.id == 0) {
                this.itemCounter = restList.length
                return restList.slice(0, this.limit)
            } else {
                const selcatmass = [];
                this.selcatmass = selcatmass;
                restList.forEach((item, i, arr) => {
                    item.tags.find((tag, i, arr) => {
                        if (tag.id === this.getSelectedCategory.id) {
                            selcatmass.push(item);
                        }
                    });
                });
                this.itemCounter = selcatmass.length
                return selcatmass.slice(0, this.limit);
            }
        },
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
            ApiService.post("/restaurants", this.params)
                .then(response => {
                    const resp = response.data;
                    const rest = resp.restaurants;
                    if (resp.status === 200) {
                        this.restaurants = [];
                        this.restaurants = rest;
                        this.loadingRest = false;
                    } else if (resp.status === 404) {
                        this.restaurants.length = 0;
                        this.loadingRest = false;
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
        goToRes(info) {
            let name = info.name
            let result = name.replace(' ', '')
            this.$router.push(`/restaurant/${result}`)
        },
        showMore() {
            this.limit += 24;
            this.getRestaurants(
                this.getUserCoordinate.length == 0 ? 0 : this.getUserCoordinate[0],
                this.getUserCoordinate.length == 0 ? 0 : this.getUserCoordinate[1],
            );
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: "zone/getSelectedZone",
            getSelectedCategory: "user/getSelectedCategory",
            getUserCoordinate: "map/getCurrentCoords",
            getCurrentAddress: "map/getCurrentAddress",
            getCurrentCoords: "map/getCurrentCoords"
        }),
        checkAddress() {
            return this.getCurrentAddress.length > 0 ? true : false
        },
        swiper() {
            return this.$refs.mySwiper.$swiper;
        },
        computedOpenTime() {
            let cu = this.filterByCategory(this.restaurants)
            const openRestorants = [];
            const closeRestorants = [];
            const currentDay = new Date().getDay();
            const currentTime = new Date().getTime();
            cu.forEach((item, i, arr) => {
                const op = item.operation_time;
                const buffer = [];
                op.forEach((optime, index, operationTimeArr) => {
                    if (optime.day === currentDay) {
                        buffer.push(optime);
                    }
                });

                const closeTime = buffer[0].close_time;
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
            });
            this.loadingRest = false;
            return openRestorants.concat(closeRestorants).slice(0, this.limit);
        }
    },
    watch: {
        getSelectedCategory(newValue) {
            this.limit = 24;
        },
        getUserCoordinate(newValue) {
            this.getRestaurants(newValue[0], newValue[1]);
        },
    },
    mounted() {
        this.getRestaurants(
            this.getUserCoordinate.length == 0 ? 0 : this.getUserCoordinate[0],
            this.getUserCoordinate.length == 0 ? 0 : this.getUserCoordinate[1],
        );
    }
};
</script>

<style scoped>
.block-bottom {
    width: 100%;
}

.card-title {
    width: 100%;
    display: flex;
    flex-direction: row;
}

.bottom-left {
    display: flex;
    flex-direction: row;
}

.delivery-time-mobile {
    display: none;
}

.time-min {
    color: #b0b0b0;
    font-size: 14px;
    line-height: 10px;
}

.time-title {
    font-weight: bold;
}

.delivery-time-desktop {
    right: -65%;
    padding: 10px 17px;
    position: relative;
    font-size: 16px;
    margin-top: -19px;
    text-align: center;
    background: #fff;
    border-radius: 23px 23px 0 0;
    height: 0;
    max-width: 80px;
    top: 0px;
}

.delivery-time-desktop:before,
.delivery-time-desktop:after {
    top: 13px;
    width: 7px;
    height: 7px;
    display: block;
    content: "";
    position: absolute;
    background-size: 100%;
    background-position: center;
}

.delivery-time-desktop:after {
    right: -6px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB2aWV3Qm94PSIwIDAgNyA3IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yLjUwNCA0LjgyMUMxLjQ3MyAzLjg1NC42MzggMi4yNDcgMCAwdjdoN2MtMS45NjUtLjQ4NS0zLjQ2NC0xLjIxMi00LjQ5Ni0yLjE3OXoiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==);
}

.delivery-time-desktop:before {
    left: -6px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB2aWV3Qm94PSIwIDAgNyA3IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00LjQ5NiA0LjgyMUM1LjUyNyAzLjg1NCA2LjM2MiAyLjI0NyA3IDB2N0gwYzEuOTY1LS40ODUgMy40NjQtMS4yMTIgNC40OTYtMi4xNzl6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=);
}

.list-item-block {
    /* height: 100%; */
    /* width: 100%; */
    max-height: 310px;
    min-height: 310px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: auto;
    margin: 20px 20px 0px 20px;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 0px 4px 40px rgb(230, 230, 230);
}

.informMe-btn {
    color: #000 !important;
    font-weight: 500;
    text-transform: none;
}

.notFoundDescription {
    color: rgba(0, 0, 0, 0.5);
    font-size: 16px;
    max-width: 450px;
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

.bottom-tags-list {
    display: flex;
    flex-wrap: wrap;
    max-width: 300px;
}

.tags-list-item {
    font-weight: normal;
    font-size: 14px;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 210px;
}

.rating {
    color: #000 !important;
    margin-left: 5px;
}

.item-bottom-right-mob {
    display: none;
}

.item-bottom-right {
    display: flex;
    flex-direction: row;
    justify-self: center;
    align-self: center;
    max-width: 75px !important;
    margin-right: 10px !important;
}

.list-item-bottom {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
    padding-left: 10px;
    font-weight: bold;
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
    width: 87% !important;
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
    text-align: start;
    padding: 10px;
    min-height: 40px;
    text-align: left;
}

.restorane-list-item:hover {
    transition: 0.5s;
    transform: scale(1.05);
}

.restorane-list-item:not(:hover) {
    transition: 0.5s;
}

.restorane-list-item {
    /* margin: 20px 20px 0px 0px; */
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
    padding: 20px 70px;
    padding-bottom: 0;
}

.specialOfferSwiper {
    cursor: pointer;
}

.containe {
    width: 100%;
    max-width: 1420px;
    margin: auto;
    margin-bottom: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-top: 8px solid rgba(245, 245, 245, 0.6);
}

@media screen and (max-width: 1000px) {
    .list-item-block {
        min-height: 280px;
        max-height: 280px;
    }

    .restorane-logo {
        min-height: 150px;
    }
}

@media screen and (max-width: 768px) {
    .restorane-list {
        padding: 0px;
    }

    .restorane-title {
        padding: 20px 20px 0px 20px;
    }

    .showMore-btn {
        width: 94% !important;
        margin-top: 20px !important;
    }
}

@media screen and (max-width: 450px) {

    .restorane-list-item:hover {
        transition: none;
    }

    .restorane-list-item:not(:hover) {
        transition: none;
    }

    .block-bottom {
        height: 85px;
    }

    .item-bottom-right {
        display: none;
    }

    .card-title {
        width: 100%;
        height: 40px;
    }

    .noLocationTag {
        max-width: 100% !important;
    }

    .noLocation {
        justify-content: flex-end !important;
    }

    .delivery-time-desktop {
        display: none;
    }

    .delivery-time-mobile {
        display: flex;
        white-space: nowrap;
    }

    .item-bottom-right-mob {
        display: flex;
        position: relative;
        right: 1rem;
        bottom: 3rem;
    }

    .list-item-bottom {
        flex-direction: row-reverse;
        justify-content: flex-end;
        height: 30px;
    }

    .tags-list-item {
        max-width: 210px;
    }

    .bottom-tags-list {
        max-width: 70%;
    }

    .restorane-list-item-name {
        min-height: 50px;
        padding-bottom: 0px;
    }

    .containe {
        margin-bottom: 0;
    }

    .showMore-btn {
        margin: 20px 27px;
    }

    .restorane-title {
        padding: 10px 30px;
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
