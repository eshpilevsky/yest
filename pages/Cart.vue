<template>
<div>
    <div class="cart" v-show="!showForm">
        <div class="mobile-mode_header">
            <v-icon @click="goBack()">arrow_back</v-icon>
            <v-icon @click="dropBasketForm = true" v-show="getSelectedDishs.length > 0">delete_forever</v-icon>
            <v-overlay :dark='false' v-model="dropBasketForm">
                <v-card>
                    <v-card-title>
                        Очистить корзину?
                    </v-card-title>
                    <v-card-actions>
                        <v-btn color="primary" @click="this.dropBasket()">
                            Ок
                        </v-btn>
                        <v-btn @click="dropBasketForm = false">
                            Отмена
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-overlay>
        </div>
        <div class="px-2" v-show="getSelectedDishs.length > 0">
            <h1>Заказ </h1>
            <div class="order-list">
                <client-only>
                    <div v-for="order in getSelectedDishs" :key="`${order.id}`" class="list-item">
                        <div class='item-left'>
                            <v-img cover :src="'https://img.eatmealby.com/resize/dish/400/'+order.image" lazy-src='https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg' :alt="order.name" class="order-img"></v-img>
                        </div>
                        <div class="dish-info">
                            <div class="d-flex flex-row align-center justify-space-between ">
                                <span class="dish-info-text">
                                    {{order.name}}
                                </span>
                                <span class="dish-info-text">
                                    {{order.selectSize.price}} BYN
                                </span>
                            </div>
                            <div class="d-flex flex-row align-center">
                                <v-btn icon @click="decrement(order.id)" class="rounded-xl">
                                    <v-icon>remove</v-icon>
                                </v-btn>
                                <div>
                                    {{order.count}}
                                </div>
                                <v-btn icon @click="increment(order.id)" class="rounded-xl">
                                    <v-icon>add</v-icon>
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </client-only>
            </div>
            <div class="confirm-order" v-show="getSelectedDishs.length > 0">
                <div class="total-info-block">
                    <p class="total-price">
                        {{this.totalPrice}} BYN
                    </p>
                </div>
                <div class="next-btn-block">
                    <v-btn block color="primary" @click="goToForm()">Далее</v-btn>
                </div>
            </div>
        </div>
        <div v-show="getSelectedDishs.length == 0" class="empty">
            <div class="empty-basket-img"></div>
            <div class="empty-basket-title">
                Корзина пуста
            </div>
            <div class="empty-basket-subtitle">
                Перейдите к списку мест, чтобы оформить заказ заново
            </div>
        </div>
    </div>
    <div class="form" v-show="showForm">
		<orderCard @closeCheckout='closeOrderForm()'/>
    </div>
</div>
</template>

<script>
import {
    mapGetters
} from "vuex";
import orderCard from '@/components/orderCard'

export default {
	components: {
		orderCard,
	},
    async asyncData({
        app,
        store,
    }) {
        var lastRest = await store.getters['basket/getLatetestRestInfoWithOrder']
        var orderList = await store.getters['basket/getSelectedDishs']
        var totalPrice = await store.getters['basket/getTotalPrice']

        app.lastRest = lastRest
        app.orderList = orderList
        app.totalPrice = totalPrice
        console.log('orderList', orderList)

    },
    data() {
        return {
            lastRest: {},
            orderList: [],
            totalPrice: 0,
            selectedDishCounter: 1,
            dropBasketForm: false,
            showForm: false,
        }
    },
    watch: {
        getTotalPrice(newValue, ) {
            return newValue
        }
    },
    computed: {
        ...mapGetters({
            getSelectedDishs: "basket/getSelectedDishs",
            getTotalPrice: "basket/getTotalPrice",
            getLatetestRestInfoWithOrder: "basket/getLatetestRestInfoWithOrder",
        }),
    },
    methods: {
		closeOrderForm(){
			this.showForm = false
		},
        goToForm() {
            this.showForm = true
        },
        goBack() {
            this.$router.go(-1)
        },
        showDropBasketForm() {
            this.dropBasketForm = true
        },
        dropBasket() {
            this.$store.dispatch('basket/dropBasket');
            this.dropBasketForm = false
        },
        decrementSelectedDish() {
            if (this.selectedDishCounter > 1) {
                this.selectedDishCounter--
            }
        },
        incrementSelectedDish() {
            this.selectedDishCounter++
        },
        decrement(id) {
            this.$store.dispatch('basket/decrementDishCounter', id);
        },
        increment(id) {
            this.$store.dispatch('basket/incrementDishCounter', id);
        },
    },
    created() {
        this.orderList = this.getSelectedDishs
        this.totalPrice = this.getTotalPrice
        console.log('created -> this.getSelectedDishs', this.getSelectedDishs)
    }
}
</script>

<style scoped>

.order-img{
	border-radius: 3px;
}

.form{
	margin-top: -3rem;
}

.empty-basket-subtitle {
    flex: 0 0 100%;
    color: #b0b0b0;
    font-size: 12px;
    text-align: center;
    margin-top: 12px;
    line-height: 1.67;
}

.empty-basket-title {
    flex: 0 0 100%;
    font-size: 20px;
    text-align: center;
    margin-top: 36px;
    font-weight: bold;
}

.empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 50%;
}

.total-info-block {
    margin: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 8px;
}

.delivery-time {
    font-size: 13px;
    margin-top: 3px;
    white-space: nowrap;
    font-weight: 500;
}

.total-price {
    font-size: 24px;
    font-weight: 500;
    white-space: nowrap;
}

.next-btn-block {
    width: 90%;
    margin: 20px;
    margin-left: 10px !important;
}

.cart {
    margin-top: -3rem;
}

.confirm-order div {
    text-align: center;
}

.confirm-order {
    position: fixed;
    bottom: 0;
    background: #ffffff;
    box-shadow: 0px -4px 20px rgba(117, 115, 111, 0.2);
    height: 88px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
}

.dish-info-text {
    font-size: 16px;
    line-height: 19px;
}

.dish-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
}

.item-left {
    width: 30%;
    max-width: 104px;
    max-height: 104px;
}

.list-item {
    display: flex;
    flex-direction: row;
	padding-bottom: 10px;
}

.empty-basket-img {
    height: 100%;
    width: 100%;
    min-width: 153px;
    min-height: 153px;
    background-position: center;
    margin-bottom: 20px;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDMiIGhlaWdodD0iMTU0IiB2aWV3Qm94PSIwIDAgMTQzIDE1NCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjRUVFIiBkPSJNMTEuNzY0IDI5aDEwOC45NTRhMiAyIDAgMCAxIDEuOTkgMS44MDFMMTM1IDE1NEgyLjYyNGEyIDIgMCAwIDEtMS45MjgtMi41M2wzLjc5Ni0xMy44MDdhMiAyIDAgMCAwIC4wNjktLjQzMkw5Ljc2NyAzMC45MDJBMiAyIDAgMCAxIDExLjc2NCAyOXoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTYuMjk0IDI2aDEwOS4wNGEyIDIgMCAwIDEgMS45ODggMS43NzlsMTIuMDU0IDEwOC4yNzZhMiAyIDAgMCAwIC4wMjguMTc1bDMuMTEgMTUuMzczYTIgMiAwIDAgMS0xLjk2IDIuMzk3SDE4LjMzNGEyIDIgMCAwIDEtMS45OC0xLjcxMmwtMi4zMzItMTUuOTk4YTIgMiAwIDAgMS0uMDItLjI5NGwuMjkzLTEwOC4wMDFhMiAyIDAgMCAxIDItMS45OTV6Ii8+PGcgZmlsbD0iIzAwMCIgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDE0Ny4wNjkgLTcyLjAxOCkiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIvPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNyA2LjUpIi8+PC9nPjxnIGZpbGw9IiMwMDAiIHRyYW5zZm9ybT0icm90YXRlKC00NSAxMjAuNTY5IC04LjA0MikiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIvPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNyA2LjUpIi8+PC9nPjxwYXRoIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNjUuNDQ0IDEwOGgyMy4xMTIiLz48cGF0aCBzdHJva2U9IiNCMEIwQjAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNDggMjV2LTIuODcxYzAtOS43NTYgNy4wNjktMTcuODkgMTYuNDUxLTE5LjczNkEyMC45NjQgMjAuOTY0IDAgMCAxIDY4LjUgMmM4LjE3NCAwIDE1LjIzMSA0LjY5OCAxOC41MjMgMTEuNDk0QTE5Ljc1IDE5Ljc1IDAgMCAxIDg5IDIyLjEzVjI1Ii8+PHBhdGggc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTU1IDQyVjIxLjVDNTUgMTAuMTc4IDY0LjE3OCAxIDc1LjUgMVM5NiAxMC4xNzggOTYgMjEuNVY0MiIvPjwvZz48L3N2Zz4=");
}

.mobile-mode_header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    z-index: 5;
    background: #ffffff;
    padding-top: 8px;
    display: flex;
    padding: 0 8px;
    align-items: center;
    justify-content: space-between;
}
</style>
