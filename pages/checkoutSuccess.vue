<template>
<div class="success-order">
    <h1 class="success-order__title">Ваш заказ №{{this.orderId}} успешно сформирован!</h1>
    <div class="success-order__descr">
        С вами свяжутся сотрудники контакт центра в ближайшее время для подтверждения заказа.
    </div>

    <nuxt-link class="success-order__link" :to="`/${this.getSelectedZone.alias}`">На главную</nuxt-link>
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
        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data
        store.dispatch('zone/setZone', zoneListData)
        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: 1
        })
		let categoriesListData = categoriesList.data
		store.dispatch('user/allCategory', categoriesListData)

		let order_id;
        // if (req.headers.cookie) {
        // console.log('req.headers.cookie', req.headers.cookie)
        //     order_id = getCookie('order_id', req.headers.cookie)
        //     console.log('order_id', order_id)
        //     function getCookie(cookieName, stringCookie) {
        //         let strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie)[0]
        //         return unescape(strCookie ? strCookie.toString().replace(/^[^=]+./, '') : '')
		// 	}
		// 	if (order_id == undefined) {
		// 		order_id = 0
		// 	}
		// } else {
		// 	order_id = 0
		// }
		// return{
		// 	order_id: order_id
		// }

    },
    data() {
        return {
            orderId: 0
        }
    },
    computed: {
        ...mapGetters({
            getOrderId: 'basket/getOrderId',
            getSelectedZone: 'zone/getSelectedZone',
        })
    },
    created() {
        console.error(this.getSelectedZone);
        console.log('created -> this.getOrderId', this.getOrderId)
        this.orderId = this.getOrderId;
	},
	mounted () {
		window.scrollTo(0, 0);
	},
}
</script>

<style lang="scss" scoped>
.success-order {
    padding: 80px 20px 60px;

    @media screen and (max-width: 992px) {
        padding: 60px 20px;
    }

    &__title {
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
        margin-bottom: 20px;
    }

    &__descr {
        text-align: center;
        font-size: 16px;
        line-height: 20px;
        margin-bottom: 40px;

        @media screen and (max-width: 992px) {
            margin-bottom: 20px;
        }
    }

    &__link {
        display: block;
        text-align: center;
        margin: 0 auto;
        max-width: 200px;
        color: #fff;
        font-weight: bold;
        text-transform: none;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        padding: 0 20px;
        background-color: #4ca647;
        text-decoration: none;
        border-radius: 3px;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    }
}
</style>
