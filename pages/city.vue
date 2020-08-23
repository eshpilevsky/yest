<template>
<div style="padding-bottom: 0px">
    <setAdress :currentZone='currentZone' :currentCategory='this.currentCategory' :categoryInfoData='categoryInfoData' :class="{hide: showSetAdress == false}" />
    <specialOffers :offers="specilaOffers" v-show="showSpecialOffer" />
    <categories v-show="categoriesList.length > 1" :categoriesList='categoriesList' :currentCategory='this.currentCategory' />
    <restuarantsList :restaurantsList='restaurantsList' :currentCategory='this.currentCategory' />
</div>
</template>

<script>
import setAdress from '~/components/setAdress'
import categories from '~/components/categories.vue'
import specialOffers from '~/components/specialOffers.vue'
import restuarantsList from '~/components/restuarants-list.vue'
import ApiService from "~/common/api.service";
import axios from 'axios'
import * as Cookie from 'js-cookie'

import {
    mapGetters
} from 'vuex'

export default {
    name: 'city',
    components: {
        categories,
        specialOffers,
        restuarantsList,
        setAdress
    },
    data() {
        return {
            showSetAdress: true,
            rest: [],
            categoryInfoData: null,
            currentZone: null,
        }
    },
    async asyncData({
        app,
        context,
        store,
        params,
		req,
		redirect,
    }) {
		console.log('START ASYNC DATA');
				
        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data
        store.dispatch('zone/setZone', zoneListData)
        var currentZone = zoneListData.find((zones) => {
            return zones.alias == params.region
        })

		if (currentZone !== undefined) {
			store.dispatch('zone/setSelectedZone', currentZone)
		} else {
			redirect('/')
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

        if (currentCategory !== undefined) {
            categoryInfo = await axios.post('https://yestapi.xyz/categories/info', {
                zone_id: currentZone.id,
                category_id: currentCategory.id
            })

            if (categoryInfo.status != 404) {
                categoryInfoData = categoryInfo.data
                if (categoryInfoData.background == '') {
                    categoryInfoData.background = 'https://yastatic.net/s3/eda-front/prod-www/assets/default-d3a889e26c9ac9089ce5b007da1ac51b.png'
                }
                app.categoryInfoData = categoryInfoData
            } else {
                categoryInfoData = {
                    header: 'Быстрая доставка',
                    city: currentZone.name,
                    background: 'https://yastatic.net/s3/eda-front/prod-www/assets/default-d3a889e26c9ac9089ce5b007da1ac51b.png',
                }
            }
            store.dispatch('user/selectCategory', currentCategory)
        } else {
			if (params.alias) {
				redirect(`/${currentZone.alias}`)
			} else {
				categoryInfoData = {
				    header: 'Быстрая доставка',
				    city: currentZone.name
				}
				currentCategory = categoryAll[0]
				store.dispatch('user/selectCategory', currentCategory)

			}
        }

        let latitude
        let longitude
        if (process.server) {
            if (req.headers.cookie) {
                latitude = getCookie('latitude', req.headers.cookie)
                longitude = getCookie('longitude', req.headers.cookie)
                function getCookie(cookieName, stringCookie) {
                    let strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie)[0]
                    return unescape(strCookie ? strCookie.toString().replace(/^[^=]+./, '') : '')
                }
            }
        }

        var sortByCoord = {}
        if (process.server) {
            if (req.headers.cookie) {
                sortByCoord = {
                    zone_id: parseInt(currentZone.id),
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    start: 0,
                    limit: 100
                }
            }
        } else {
            sortByCoord = {
                zone_id: currentZone.id,
                limit: 100,
                start: 0,
            }
        }

        let restaurantsList;
        let checkCatId = currentCategory ? currentCategory.id : 0
        let restaurantsListData

        if (checkCatId == 0) {
            restaurantsList = await axios.post('https://yestapi.xyz/restaurants', sortByCoord)
            restaurantsListData = restaurantsList.data.restaurants
        } else {
            restaurantsList = await axios.post(`https://yestapi.xyz/restaurants/category/${currentCategory.id}`, sortByCoord)
            restaurantsListData = restaurantsList.data.restaurants
        }

        var filtByTime;
        if (restaurantsList.data.status == 404) {
            restaurantsListData = [404]
        } else {
            // filtByTime = await computedOpenTime()
        }

        function computedOpenTime() {
            const openRestorants = [];
            const closeRestorants = [];
            const currentDay = new Date().getDay();
            const currentTime = new Date().getTime();
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

        let specialOffer;
        let specialOfferData;
		let showSpecialOffer;
		if (process.server) {
			if (req.headers.cookie) {
				specialOffer = await axios.post('https://yestapi.xyz/restaurants/special-offers', {
					zone_id: parseInt(currentZone.id),
					latitude: parseFloat(latitude),
					longitude: parseFloat(longitude),
				})
				specialOfferData = specialOffer.data
				if (specialOfferData.length == 0) {
					showSpecialOffer = false
				} else {
					showSpecialOffer = true
				}
			}
		}

        console.log('END ASYNC DATA');
        return {
            restaurantsList: restaurantsListData,
            categoriesList: categoryAll.concat(categoriesListData),
            currentCategory: currentCategory,
            categoryInfoData: categoryInfoData,
            currentZone: currentZone,
            specilaOffers: specialOfferData,
            showSpecialOffer: showSpecialOffer,
        }
    },
    watch: {
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
            getSelectedZone: 'zone/getSelectedZone',
            getZoneList: 'zone/getZoneList',
            getCategoryList: 'user/getCategoryList',
            getUserCoordinate: 'user/getUserCoordinate',
            getCurrentAddress: "map/getCurrentAddress",
        })
    },
    created() {
        this.$store.dispatch('zone/setSelectedZone', this.currentZone)
        this.$store.dispatch('user/selectCategory', this.currentCategory)
    },
    mounted() {
        window.scrollTo(0, 0);
        setTimeout(() => {
            if (window.innerWidth < 992) {
                document.getElementById('bgImg').setAttribute('style', 'background: #fff;')
            } else {
                if (this.categoryInfoData.background.hasOwnProperty('background')) {
                    document.getElementById('bgImg').setAttribute('style', 'background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))), url("' + this.categoryInfoData.background + '");')
                }
            }
        }, 200);
        let lastScrollTop = 0
        if (window.innerWidth < 992) {
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
