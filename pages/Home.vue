<template>
<div class="mt-10">
    <div class="d-flex flex-column">
        <nuxt-link :to='`/${zone.alias}`' v-for="zone in zones" :key="zone.alias">
            {{zone.name}}
        </nuxt-link>
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

        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: 1
        })
        let categoriesListData = categoriesList.data
        store.dispatch('user/allCategory', categoriesListData)

        return {
            zones: zoneListData
        }

    },
}
</script>

<style  scoped>

</style>
