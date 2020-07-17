<template>
<div style="padding-bottom: 0px">
    <setAdress :selectedCategoryInfo='selectedCategoryInfo' :class="{hide: showSetAdress == false}" />
    <specialOffers :getSpecialOffersData='getSpecialOffersData.data' v-show="getCurrentAddress.length > 0" />
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
            getSpecialOffersData: [],
        }
    },
    async asyncData({
        app,
        params,
        store
    }) {
        let currentRegion = app.router.currentRoute.params.region
        let currentAlias = app.router.currentRoute.params.alias
        // console.log("store", store)
        const selectedZone = store.getters['zone/getSelectedZone']
        const getUserCoordinate = store.getters['user/getUserCoordinate']
        const currentCoord = store.getters['map/getCurrentCoords']
        const selectedCategory = store.getters['user/getSelectedCategory']
        let paramsToRestuarants = {}

        if (currentCoord.length > 0) {
            paramsToRestuarants = {
                zone_id: parseInt(selectedZone.id),
                limit: 100,
                start: 0,
                latitude: currentCoord[0],
                longitude: currentCoord[1],
            }
        } else {
            paramsToRestuarants = {
                zone_id: parseInt(selectedZone.id),
                limit: 100,
                start: 0,
            }
        }

        let restaurantsList = await axios.post('https://yestapi.xyz/restaurants', paramsToRestuarants)
        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: selectedZone.id
        })

        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        let zoneListData = zoneList.data
        const categoryAll = [{
            name: 'Все',
            id: 0,
            alias: 'all'
        }]
        let categoriesListData = categoryAll.concat(categoriesList.data)

        // await zoneListData.find((zone) => {
        //     if (zone.alias != currentRegion) {
        //         // app.router.push('/404')
        //     }
        // })

        let selectedCategoryInfo = [];
        let selectedCategoryId = []
        if (currentAlias != undefined) {
            selectedCategoryId = categoriesListData.find((category) => {
                if (category.alias == currentAlias) {
                    return category
                }
            })

            selectedCategoryInfo = await axios.post('https://yestapi.xyz/categories/info', {
                zone_id: selectedZone.id,
                category_id: selectedCategoryId.id
            })
        };
            console.log("selectedCategoryInfo", selectedCategoryInfo)
            // setTimeout(() => {
            //     console.log("currentCoord", currentCoord)
            // }, 1000);

        return {
            restaurantsList: restaurantsList.data.status == '404' ? null : restaurantsList.data.restaurants,
            categoriesList: categoriesListData,
            zoneList: zoneList.data,
            selectedCategoryInfo: selectedCategoryInfo.data,
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
            getCurrentCoords: "map/getCurrentCoords",
        })
    },
    async created() {
        if (this.getCurrentCoords.length > 0) {
            this.getSpecialOffersData = await axios.post(`https://yestapi.xyz/restaurants/special-offers`, {
                zone_id: this.selectedZoneId.id,
                latitude: this.getCurrentCoords[0],
                longitude: this.getCurrentCoords[1]
            })
            console.log("mounted -> this.getSpecialOffersData", this.getSpecialOffersData)
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
