<template>
<div class="chose-city">
    <div class="d-flex flex-column">
        <h1>Доставка еды</h1>
        <div class="chose-city__item" @click="goTo(zone.alias)" v-for="zone in zones" :key="zone.alias">
            {{zone.name}}
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'home',
    async asyncData({
        app,
        context,
        store,
        params,
        req,
    }) {
        console.log('START ASYNC DATA HOME PAGE');
        let getCurrentCoords = store.getters['map/getCurrentCoords']
        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data
        store.dispatch('zone/setZone', zoneListData)
        store.dispatch('zone/setSelectedZone', zoneListData[0])
        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: 1
        })
        let categoriesListData = categoriesList.data
        store.dispatch('user/allCategory', categoriesListData)

        return {
            zones: zoneListData
        }

    },
    methods: {
        goTo(url) {
            this.$store.dispatch('map/dropLocation');
            this.$router.push(`/${url}`)
        }
    },
    head() {
        return {
            title: 'Доставка еды – yest.by',
            meta: [{
                hid: 'description',
                name: 'description',
                content: 'Быстрая доставка еды по Беларуси из ресторанов и кафе. 🚚 Доставляем пиццу, суши, бургеры, WOK, шаурму. 🍰 Блюда итальянской, японской, европейской и других кухонь мира. 📞 Звоните!'
            }, ]
        }
    },
    mounted() {
        window.scrollTo(0, 0);
    },
}
</script>

<style lang="scss" scoped>
.chose-city {
    padding: 72px 20px 40px;

    &__item {
		cursor: pointer;
		color: #00a646;
    }

    @media screen and (max-width: 992px) {
        padding: 40px 20px;
    }

    &__item {
        margin-bottom: 4px;
        font-size: 18px;
    }
}
</style>
