<template>
<div class="multipage-container">
	multi page: {{this.routeName}}
</div>
</template>

<script>
import axios from 'axios'

export default {
    async asyncData({
        app,
        store,
        params,
        req
    }) {
		console.log('start asyncData of multipage');
        var orderList = await store.getters['basket/getSelectedDishs']
        var totalPrice = await store.getters['basket/getTotalPrice']
        var currentZone = await store.getters['zone/getSelectedZone']

        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data
        store.dispatch('zone/setZone', zoneListData)

        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: 1
        })
        let categoriesListData = categoriesList.data
		store.dispatch('user/allCategory', categoriesListData)
		console.log(params);
		console.log('end asyncData of multipage');

	},
	data() {
		return {
			routeName: ''
		}
	},
	mounted () {
		this.routeName = this.$route.path;
	},
}
</script>

<style scoped>
.multipage-container{
	padding-top: 5rem;
}
</style>
