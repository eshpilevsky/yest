<template>
<div class="container">
    <div v-html="this.pageData.html_content">
    </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
    async asyncData({
        app,
        store,
        req,
		redirect,
		router,
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
        let getPage = await axios.post('https://yestapi.xyz/get-data-page', {
            url: `/terms-of-use`
		})
        console.log('getPage', getPage.data)

		if (getPage.data.status == 404) {
			redirect('/404')
		}

        return {
            pageData: getPage.data
        }
    },
    head() {
        return {
            title: this.pageData.seo_title,
            meta: [{
                    hid: 'description',
                    name: 'description',
                    content: this.pageData.seo_description
                },
                {
                    hid: 'keywords',
                    name: 'keywords',
                    content: this.pageData.seo_keywords
                },
            ]
        }
    },
}
</script>

<style scoped>
.multipage-container {
    padding-top: 5rem;
}
</style>
