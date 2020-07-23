<template>
<div style="padding-bottom: 0px">
    <setAdress :currentZone='currentZone' :currentCategory='currentCategory' :categoryInfoData='categoryInfoData' :ymaps='ymaps' :class="{hide: showSetAdress == false}" />
    <specialOffers v-show="getCurrentAddress.length > 0" />
    <categories :categoriesList='categoriesList' />
    <mobileSearch v-show="showSearch" />
    <restorans :restaurantsList='restaurantsList' :currentCategory='currentCategory' />
</div>
</template>

<script>
import setAdress from '~/components/setAdress'
import categories from '~/components/categories.vue'
import specialOffers from '~/components/specialOffers.vue'
import restorans from '~/components/restorans.vue'
import mobileSearch from '~/components/mobileSearch.vue'
import ApiService from "~/common/api.service";
import axios from 'axios'
import {
    settings
} from '@/plugins/ymapPlugin'
import {
    loadYmap
} from 'vue-yandex-maps'
import {
    mapGetters
} from 'vuex'

export default {
    name: 'Home',
    components: {
        categories,
        specialOffers,
        restorans,
        mobileSearch,
        setAdress
    },
    data() {
        return {
            showSearch: false,
            showSetAdress: true,
            showSpecialOffer: false,
            rest: [],
            ymaps: null,
        }
    },
    async asyncData({
        app,
        context,
        store,
        params
    }) {
        console.log('START ASYNC DATA');
        let getCurrentCoords = store.getters['map/getCurrentCoords']
        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data
        let currentZone = zoneListData.find((zones) => {
            if (zones.alias == params.region) {
                return zones
            }
        })
        if (currentZone == undefined) {
            currentZone = zoneListData[0]
        }

        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: currentZone.id
		})
		
        let categoriesListData = categoriesList.data


	    store.dispatch('user/allCategory', categoriesListData)
        let categoryAll = [{
            name: 'Все',
            id: 0,
            alias: 'all'
        }]
        let currentCategory = categoriesListData.find((category) => {
            if (category.alias == params.alias) {
                return category
            }
        })
        if (currentCategory === undefined) {
            currentCategory = categoriesListData[0]
        }

        let categoryInfo = await axios.post('https://yestapi.xyz/categories/info', {
            zone_id: currentZone.id,
            category_id: currentCategory.id
        })

        let categoryInfoData;
        if (categoryInfo.status != 404) {
            categoryInfoData = categoryInfo.data
        } else {
            categoryInfoData = {
                head: 'Быстрая и бесплатная доставка',
                city: currentZone.name
            }
        }

        var sortByCoord = {}
        if (getCurrentCoords.length > 0) {
            sortByCoord = {
                zone_id: parseInt(currentZone.id),
                latitude: parseFloat(getCurrentCoords[0]),
                longitude: parseFloat(getCurrentCoords[1]),
                start: 0,
                limit: 100
            }
        } else {
            sortByCoord = {
                zone_id: currentZone.id,
                limit: 100,
                start: 0,
            }
        }
        let restaurantsList = await axios.post('https://yestapi.xyz/restaurants', sortByCoord)
        let restaurantsListData = restaurantsList.data.restaurants

        function filterByTag(restList) {
            if (currentCategory.id == 0) {
                return restList
            } else {
                let selcatmass = [];
                restList.forEach((item, i, arr) => {
                    item.tags.find((tag, i, arr) => {
                        if (tag.id === currentCategory.id) {
                            selcatmass.push(item);
                        }
                    });
                });
                return selcatmass;
            }
        }
        var filtredRest = await filterByTag(restaurantsListData)

        function computedOpenTime() {
            const openRestorants = [];
            const closeRestorants = [];
            const currentDay = new Date().getDay();
            const currentTime = new Date().getTime();
            filtredRest.forEach((item, i, arr) => {
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
            return openRestorants.concat(closeRestorants);
        }
        var filtByTime = await computedOpenTime()
        return {
            restaurantsList: filtByTime,
            categoriesList: categoryAll.concat(categoriesList.data),
            currentCategory: currentCategory,
            categoryInfoData: categoryInfoData,
            currentZone: currentZone,
        }
    },
    watch: {
        showSearch(newValue, oldValue) {
            return newValue
        },
        getCurrentAddress(newValue, oldValue) {
            if (window.innerWidth < 450) {
                if (newValue.length > 0) {
                    this.showSetAdress = false
                } else {
                    this.showSetAdress = true
                }
            }
        },
    },
    computed: {
        ...mapGetters({
            selectedZoneId: 'zone/getSelectedZone',
            getZoneList: 'zone/getZoneList',
            getCategoryList: 'user/getCategoryList',
            getCurrentAddress: "map/getCurrentAddress",
        })
    },
    async created() {
        await loadYmap({
            ...settings,
            debug: true
        });
        this.ymaps = ymaps
    },
    mounted() {
        let lastScrollTop = 0
        if (window.innerWidth < 450) {
            window.addEventListener('scroll', () => {
                const st = window.pageYOffset || document.documentElement.scrollTop
                if (st > lastScrollTop) {
                    // downscroll code
                    this.showSearch = false
                } else if (st > 400) {
                    this.showSearch = true
                } else {
                    this.showSearch = false
                }
                lastScrollTop = st <= 0 ? 0 : st
            })

            if (this.getCurrentAddress.length > 0) {
                this.showSetAdress = false
            } else {
                this.showSetAdress = true
            }
        }
    },
}
</script>

<style>
.home-container {
    position: relative;
    z-index: 1;
}

.hide {
    display: flex !important;
}

@media screen and (max-width: 450px) {

    .hide {
        display: none !important;
    }
}
</style>
