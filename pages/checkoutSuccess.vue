<template>
<div class="pt-5">
    <h1>Ваш заказ №{{this.orderId}} успешно сформирован!</h1>
    <div>
        С вами свяжутся сотрудники контакт центра в ближайшее время для подтверждения заказа.
    </div>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import axios from 'axios'

export default {
    async asyncData({
        app,
        context,
        store,
        params,
        req,
    }) {
        console.log('START ASYNC DATA HOME PAGE');
		let getCurrentCoords = store.getters['map/getCurrentCoords']
		let baskett = store.getters['bakset/getOrderId']
        console.log('baskett', baskett)
        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data
        store.dispatch('zone/setZone', zoneListData)
        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: 1
        })
        let categoriesListData = categoriesList.data
		store.dispatch('user/allCategory', categoriesListData)

    },
    data() {
        return {
            orderId: 0
        }
    },
    computed: {
        ...mapGetters({
            getOrderId: 'basket/getOrderId',
        })
    },
    created() {
        this.orderId = this.getOrderId;
    },
}
</script>

<style lang="scss" scoped>

</style>
