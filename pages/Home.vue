<template>
<div style="padding-bottom: 0px">
    <setAdress :selectedCategoryInfoData='selectedCategoryInfoData' :region='region' :currentCategory='currentCategory' :ymaps='ymaps' :class="{hide: showSetAdress == false}" />
    <specialOffers v-show="getCurrentAddress.length > 0" />
    <categories :categoriesList='categoriesList' />
    <mobileSearch v-show="showSearch" />
    <restorans :restaurantsList='restaurantsList' />
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

    watchQuery: true,
    async asyncData({
        app,
        context,
        store
    }) {
        console.log('START ASYNC');
        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        let regionByUrl = app.router.currentRoute.params.region;
        let aliasByUrl = app.router.currentRoute.params.alias;
        const getCoords = store.getters['map/getCurrentCoords']
        const zoneListData = zoneList.data
        let currentZone = zoneListData.find((zones) => {
            if (zones.alias == regionByUrl) {
                return zones
            }
        })
        let categoriesList;
        let categoriesListData;
        let currentCategory;
        let restParams = {}
        let restaurantsList;
        let restList;
        let result;
        let selectedCategoryInfo;
        let selectedCategoryInfoData;
        if (currentZone != undefined) {

            categoriesList = await axios.post('https://yestapi.xyz/categories', {
                zone_id: currentZone.id
            })
            categoriesListData = categoriesList.data
            currentCategory = categoriesListData.find((category) => {
                if (category.alias == aliasByUrl) {
                    return category
                }
            })
            if (currentCategory == undefined) {
                currentCategory = categoriesListData[0]
            }

            if (getCoords.length > 0) {
                restParams = {
                    zone_id: currentZone.id,
                    limit: 100,
                    start: 0,
                    latitude: parseFloat(getCoords[0]),
                    longitude: parseFloat(getCoords[1]),
                }
            } else {
                restParams = {
                    zone_id: currentZone.id,
                    limit: 100,
                    start: 0,
                }
            }
            restaurantsList = await axios.post('https://yestapi.xyz/restaurants', restParams)
            restList = restaurantsList.data.restaurants
            result = []
            if (currentCategory.id == 0) {
                result = restList
            } else {
                const selcatmass = [];
                restList.forEach((item, i, arr) => {
                    item.tags.find((tag, i, arr) => {
                        if (tag.id == currentCategory.id) {
                            result.push(item);
                        }
                    });
                });
            }
            console.error(result);
            selectedCategoryInfo = await axios.post('https://yestapi.xyz/categories/info', {
                zone_id: currentZone.id,
                category_id: currentCategory.id
            })
            selectedCategoryInfoData = selectedCategoryInfo.data
        }

        return {
            restaurantsList: result,
            categoriesList: categoriesList ? categoriesList.data : null,
            selectedCategoryInfoData: selectedCategoryInfoData,
            region: currentZone,
            currentCategory:currentCategory,
            // zoneList: zoneList.data
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
        if (this.$router.currentRoute.params.region = undefined) {
            this.$router.push('/minsk')
        }
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
