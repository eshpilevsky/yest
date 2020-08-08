<template>
<div style="padding-bottom: 0px">
    <setAdress :currentZone='currentZone' :currentCategory='currentCategory' :categoryInfoData='categoryInfoData' :ymaps='ymaps' :class="{hide: showSetAdress == false}" />
    <specialOffers v-show="getCurrentAddress.length > 0" />
    <categories :categoriesList='categoriesList' :currentCategory='currentCategory' />
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
            categoryInfoData: null,
            currentZone: null,
        }
    },
    async asyncData({
        app,
        context,
        store,
        params,
    }) {
        console.log('START ASYNC DATA');
        let getCurrentCoords = store.getters['map/getCurrentCoords']
        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data
        store.dispatch('zone/setZone', zoneListData)
        let currentZone = zoneListData.find((zones) => {
            if (zones.alias == params.region) {
                return zones
            }
        })

        if (currentZone == undefined) {
            currentZone = zoneListData[0]
        }
        app.currentZone = currentZone

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

        let categoryInfo;
        let categoryInfoData;
        if (currentCategory === undefined) {
            currentCategory = categoryAll[0]
            categoryInfoData = {
                header: 'Быстрая доставка',
                city: currentZone.name
            }
        } else {
            categoryInfo = await axios.post('https://yestapi.xyz/categories/info', {
                zone_id: currentZone.id,
                category_id: currentCategory.id
            })

            if (categoryInfo.status != 404) {
                categoryInfoData = categoryInfo.data
                app.categoryInfoData = categoryInfoData
            } else {
                categoryInfoData = {
                    header: 'Быстрая доставка',
                    city: currentZone.name
                }
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
        let restaurantsList;
        if (currentCategory.id == 0) {
            restaurantsList = await axios.post('https://yestapi.xyz/restaurants', sortByCoord)
        } else {
            restaurantsList = await axios.post(`https://yestapi.xyz/restaurants/category/${currentCategory.id}`, sortByCoord)
        }
        let restaurantsListData = restaurantsList.data.restaurants

        var filtByTime;
        if (restaurantsList.data.status == 404) {
            filtByTime = 404
        } else {
            filtByTime = await computedOpenTime()
        }

        function computedOpenTime() {
            const openRestorants = [];
            const closeRestorants = [];
            const currentDay = new Date().getDay();
            const currentTime = new Date().getTime();
            console.log('computedOpenTime -> restaurantsListData', restaurantsListData[0])
            restaurantsListData.forEach((item, i, arr) => {
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
        await this.$store.dispatch('zone/setSelectedZone', this.currentZone.id)
    },
    mounted() {
        // setTimeout(() => {
        //   if (window.innerWidth < 992) {
        //     // document.getElementById('bgImg').setAttribute('style', 'background: #fff;')
        //   }else{
        //     // document.getElementById('bgImg').setAttribute('style', 'background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))), url("' + this.categoryInfoData.background + '");')
        //   }
        //   }, 200);
        let lastScrollTop = 0
        if (window.innerWidth < 992) {
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
html {
    overflow-x: hidden !important;
}

.home-container {
    position: relative;
    z-index: 1;
}

.hide {
    display: flex !important;
}

@media screen and (max-width: 992px) {

    .hide {
        display: none !important;
    }
}
</style>
