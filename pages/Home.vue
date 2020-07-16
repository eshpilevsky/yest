<template>
<div style="padding-bottom: 0px">
    <setAdress :class="{hide: showSetAdress == false}" />
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
        }
    },
    async asyncData({
        app,
        params,
        store
    }) {
        console.log('Data -> store', store)
        const selectedZone = store.getters['zone/getSelectedZone']
		const currentCoord = store.getters['map/getCurrentCoords']
		
        
        var paramsToRestuarants = {}
        if (currentCoord.length > 0) {
            paramsToRestuarants = {
                zone_id: parseInt(selectedZone.id),
                limit: 100,
                start: 0,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            }
        } else {
            paramsToRestuarants = {
                zone_id: parseInt(selectedZone.id),
                limit: 100,
                start: 0,
            }
        }

        let restaurantsList = await axios.post('https://yestapi.xyz/restaurants', paramsToRestuarants)
        console.log('restaurantsList', restaurantsList)
        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: selectedZone.id
        })
        // let zoneList = await axios.post('https://yestapi.xyz/get-zones')

        return {
            restaurantsList: restaurantsList.data.status =='404' ? null : restaurantsList.data.restaurants,
            categoriesList: categoriesList.data,
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
    mounted() {
        // setTimeout(() => {
        //     this.redirectCategoryByUrl()
        // }, 100);
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
    methods: {
        redirectCategoryByUrl() {
            const findZone = this.getZoneList.find((zone) => {
                if (zone.alias === this.$route.params.region) {
                    return zone.id
                }
            })

            const findCategory = this.getCategoryList.find((category) => {
                if (category.alias === this.$route.params.alias) {
                    return category
                }
            })

            if (findZone !== undefined) {
                this.$store.dispatch('zone/setSelectedZone', findZone.id)
            }
            if (findCategory !== undefined) {
                this.$store.dispatch('user/selectCategory', findCategory)
            } else {
                this.$store.dispatch('user/selectCategory', {
                    id: 0,
                    alias: 'all',
                    name: 'Все'
                })
            }
        }
    }
    // metaInfo: {
    // 	title: 'Быстрая Доставка еды из кафе и ресторанов Минска, Беларусь - Главная Минск, Беларусь - Menu.by',
    // 	meta: [{ // set meta
    // 		name: 'keyWords',
    // 		content: 'My Example App'
    // 	}]
    // }
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
