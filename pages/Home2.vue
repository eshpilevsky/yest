<template>
<div style="padding-bottom: 0px">
    <setAdress :ymaps='ymaps' :class="{hide: showSetAdress == false}" />
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
        console.log('START ASYNC 222');
        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        let regionByUrl = app.router.currentRoute.params.region;
        const zoneListData = zoneList.data
        let currentZone = zoneListData.find((zones) => {
            if (zones.alias == regionByUrl) {
                return zones
            }
        })

            console.log("currentZone", currentZone)
        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: 1
        })

        let restaurantsList = await axios.post('https://yestapi.xyz/restaurants', {
            zone_id: 1,
            limit: 100,
            start: 0,
        })
        return {
            restaurantsList: restaurantsList.data.restaurants,
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
    async created() {
        await loadYmap({
            ...settings,
            debug: true
        });
        this.ymaps = ymaps
        console.error("created -> this.ymaps", this.ymaps)
    },
    mounted() {
        setTimeout(() => {
            this.redirectCategoryByUrl()
        }, 100);
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
