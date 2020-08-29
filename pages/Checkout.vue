<template>
<div>
    <div class='desktop-cart'>
        <div class="desktop-cart__content">
            <v-card class="desktop-cart__wrapper">
                <orderForm @closeCheckout='closeOrderForm()' />
            </v-card>
        </div>
        <div class="desktop-cart__sidebar">
            <basket :orderList="this.getSelectedDishs" :delivery="this.getLatetestRestInfoWithOrder" />
        </div>
    </div>
    <div class="mobile-cart">
        <div class="cart" v-show="showBasket">
            <div class="mobile-mode_header">
                <v-icon class="mobile-mode_header-btn" @click="goBack()">arrow_back</v-icon>
                <v-icon class="mobile-mode_header-btn" @click="showDropBasketForm()" v-show="getSelectedDishs.length > 0">delete_forever</v-icon>
                <v-overlay :dark='false' v-model="dropBasketForm">
                    <v-card class="clear-cart-modal">
                        <v-card-title class="clear-cart-modal__title">
                            Очистить корзину?
                        </v-card-title>
                        <v-card-actions class="clear-cart-modal__actions d-flex justify-center">
                            <v-btn class="clear-cart-modal__ok-btn" color="primary" @click="dropBasket()">
                                Ок
                            </v-btn>
                            <v-btn class="clear-cart-modal__cancel-btn" @click="showDropBasketForm()">
                                Отмена
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-overlay>
            </div>
            <div class="main-mobile-cart" v-show="getSelectedDishs.length > 0">
                <h1 class="main-mobile-cart__title">Заказ</h1>
                <div class="order-list">
                    <client-only>
                        <div v-for="order in getSelectedDishs" :key="`${order.id}`" class="list-item">
                            <div class='item-left'>
                                <v-img cover :src="'https://img.eatmealby.com/resize/dish/400/'+order.image" lazy-src='https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg' :alt="order.name" class="order-img"></v-img>
                            </div>
                            <div class="dish-info">
                                <div class="d-flex flex-row justify-space-between main-mobile-cart__name">
                                    {{order.name}}
                                    <div class="main-mobile-cart__product-price">
                                        {{order.selectSize.price}} BYN
                                    </div>
                                </div>
                                <div class="d-flex flex-row align-center">
                                    <v-btn icon @click="decrement(order)" class="rounded-xl main-mobile-cart__count-btn">
                                        <v-icon>remove</v-icon>
                                    </v-btn>
                                    <div class="main-mobile-cart__order-qty">
                                        {{order.selectSize.count}}
                                    </div>
                                    <v-btn icon @click="increment(order)" class="rounded-xl main-mobile-cart__count-btn">
                                        <v-icon>add</v-icon>
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </client-only>
                </div>
                <div class="order-deliv-block" v-if="getSelectedDishs.length > 0">
                    <span>Доставка yest.by</span>
                    <span >{{this.deliveryCost}} BYN</span>
                </div>
                <div class="order-knifes">
                    <div class="d-flex flex-row">
                        <img class="order-knifes__icon" src="@/assets/orderKnifesIcon.svg" alt="knifes">
                        <div class="d-flex flex-row align-center" v-if="addKnifes">
                            <v-btn icon class="rounded-xl main-mobile-cart__count-btn" @click="removeCutlery()">
                                <v-icon>remove</v-icon>
                            </v-btn>
                            <div class="main-mobile-cart__order-qty">
                                {{cutleryCounter}}
                            </div>
                            <v-btn icon class="rounded-xl main-mobile-cart__count-btn" @click="addCutlery()">
                                <v-icon>add</v-icon>
                            </v-btn>
                        </div>
                        <div v-else>
                            Приборы и салфетки
                        </div>
                    </div>
                    <v-switch class="order-knifes__switch" v-model="addKnifes" inset></v-switch>
                </div>
                <h1 class="order-delivery-info__title">Доставка</h1>
                <div class="order-delivery-info">
                    <img class="order-delivery-info__icon" src="@/assets/deliverPersonIcon.svg" alt="delivery">
                    <span class="order-delivery-info__text">Доставка yest.by</span>
                </div>
                <div class="confirm-order" v-show="getSelectedDishs.length > 0">
                    <div class="total-info-block">
                        <span class="total-price">
                            {{this.totalPrice}} BYN
                        </span>
                        <span class="total-time">
							<client-only>
							{{this.deliveryMin}} - {{this.deliveryMax}} мин
							</client-only>
                        </span>
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
        <div class="mobile-cart__form" v-show="showOrderForm">
            <orderForm @closeCheckout='closeOrderForm()' />
        </div>

        <v-bottom-sheet v-model="showAuthForm" :eager=true :fullscreen=true>
            <v-sheet class="text-center authFormSheet">
                <div class="mini-header">
                    <v-icon class="mobile-mode_header-btn " @click="goBack()">arrow_back</v-icon>
                    <div class="logo-block">
                        <img src="@/assets/logo.svg" alt="logo" class="mini-header_logo">
                    </div>
                </div>
                <mobileSmsForm @closeFormShowOrderForm='closeFormShowOrderForm()' />
            </v-sheet>
        </v-bottom-sheet>
    </div>
</div>
</template>

<script>
import {
    mapGetters
} from "vuex";
import orderForm from '@/components/order-form'
import basket from '@/components/basket'
import smsForm from '@/components/restaurant/sms-form'
import mobileSmsForm from '@/components/restaurant/mobile-sms-form'
import axios from 'axios'

export default {
    components: {
        orderForm,
        basket,
        smsForm,
        mobileSmsForm,
    },
    async asyncData({
        app,
        store,
        params,
        req
    }) {
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

		if (process.client) {
			var lastRest = await store.getters['basket/getLatetestRestInfoWithOrder']
            console.log('lastRest', lastRest)
		}
        return {
            lastRest: lastRest,
        }

    },
    data() {
        return {
            orderList: [],
            totalPrice: 0,
            selectedDishCounter: 1,
            dropBasketForm: false,
            showOrderForm: false,
            addKnifes: true,
            cutleryCounter: 1,
            showAuthForm: false,
            showBasket: true,
            sheet: false,
            time: 0,
            LatetestRestInfoWithOrder: {},
            deliveryCost: 0,
            deliveryMin: 0,
            deliveryMax: 0,
        }
    },
    methods: {
        computedDeliveryCost(mass) {
            // let deliveryMass = this.sortDeliverFee(mass)
			// let deliveryMass = mass
			console.log(mass);
			let price = parseInt(this.getTotalPrice)
            console.log('computedDeliveryCost -> price', price)
				let finded = mass.find((cost) => {
					return cost.min < price && price < cost.max
				})
				if (finded !== undefined) {
					if (finded.hasOwnProperty('delivery')) {
						return finded.delivery
					} else {
						return finded.deliveryFee
					}
				} else {
					return mass[mass.length - 1].deliveryFee
				}
        },
        closeFormShowOrderForm() {
            this.showAuthForm = false
            this.showBasket = false
            this.showOrderForm = true
            console.log('closeFormShowOrderForm -> this.showOrderForm', this.showOrderForm)
        },
        closeSmsForm() {
            this.showAuthForm = false
            this.showOrderForm = true
        },
        removeCutlery() {
            if (this.cutleryCounter !== 1) {
                this.cutleryCounter--
            } else {
                this.addKnifes = false
            }
        },
        addCutlery() {
            this.cutleryCounter++
        },
        closeOrderForm() {
            this.showOrderForm = false
        },
        goToForm() {
            console.error('show auth forms');
            this.showAuthForm = true
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
        decrement(dish) {
            this.$store.dispatch('basket/decrementDishCounter', dish);
        },
        increment(dish) {
            this.$store.dispatch('basket/incrementDishCounter', dish);
        },
    },
    watch: {
        getTotalPrice(newValue) {
			this.totalPrice = newValue
			this.deliveryCost = this.computedDeliveryCost(this.getLatetestRestInfoWithOrder.delivery.fee);
            return newValue
        },
        cutleryCounter(newValue) {
            return newValue
        },
        deliveryCost(newValue) {
            return newValue
        },
    },
    computed: {
        ...mapGetters({
            getSelectedDishs: "basket/getSelectedDishs",
            getTotalPrice: "basket/getTotalPrice",
            getLatetestRestInfoWithOrder: "basket/getLatetestRestInfoWithOrder",
        }),
    },
    created() {
        this.totalPrice = this.getTotalPrice
        this.test = this.getLatetestRestInfoWithOrder
    },
    async beforeMount() {
        window.scrollTo(0, 0);
        if (process.client) {
			this.LatetestRestInfoWithOrder = this.getLatetestRestInfoWithOrder;
			this.deliveryMin = this.getLatetestRestInfoWithOrder.delivery.time.min
			this.deliveryMax = this.getLatetestRestInfoWithOrder.delivery.time.max
        }
    },
}
</script>

<style scoped>
.logo-block {
    margin: auto;
    width: 100%;
}

.mini-header_logo {
    width: 125px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.mini-header {
    display: flex;
    flex-direction: row;
    position: relative;
    border-bottom: 1px solid #ddd;
}

.authFormSheet {
    height: 100vh;
}

.desktop-cart {
    display: grid;
    grid-template-columns: calc(100% - 320px) 310px;
    grid-column-gap: 10px;
    max-width: 1500px;
    width: 100%;
    margin: 40px auto 10px;
}

.desktop-cart .right-my-order {
    height: 100%;
}

.desktop-cart__content {}

.desktop-cart__wrapper {
    border-radius: 4px !important;
    box-shadow: none !important;
}

.mobile-cart {
    display: none;
}

@media screen and (max-width: 992px) {
    .desktop-cart {
        display: none;
    }

    .mobile-cart {
        display: flex;
        padding-top: 18px;
    }

    .mobile-cart__form {
        width: 100%;
    }

    .main-mobile-cart {
        padding-top: 30px;
        padding-bottom: 84px;
    }

    .clear-cart-modal {
        max-width: 420px;
        min-width: 280px;
        padding: 20px;
    }

    .clear-cart-modal__title {
        font-size: 16px;
        line-height: 22px;
        font-weight: bold;
        padding: 0;
    }

    .clear-cart-modal__actions {
        padding: 0;
        flex: 1 0 auto;
        margin-top: 24px;
        flex-direction: row;
        justify-content: initial !important;
    }

    .clear-cart-modal__ok-btn {
        margin-right: 8px;
        border-radius: 16px;
        flex: 1 0 0;
        height: 56px !important;
        font-size: 16px;
        letter-spacing: 0.1px;
    }

    .clear-cart-modal__cancel-btn {
        margin-left: 8px !important;
        background: #fff !important;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .1);
        height: 56px !important;
        border-radius: 16px;
        flex: 1 0 0;
        font-size: 16px;
        text-transform: capitalize;
        letter-spacing: 0.1px;
    }

    .main-mobile-cart__title {
        margin: 10px 0 14px 16px;
        font-size: 32px;
        font-weight: 600;
    }

    .main-mobile-cart__name {
        align-items: flex-start !important;
        font-size: 16px;
        line-height: 19px;
        margin-bottom: 8px;
    }

    .main-mobile-cart__product-price {
        margin-left: 10px;
        flex: 0 0 auto;
    }

    .main-mobile-cart__count-btn {
        width: 48px !important;
        height: 48px !important;
        display: flex;
        align-items: center;
        border-radius: 16px;
        justify-content: center;
        background-color: #F1F0ED;
    }

    .main-mobile-cart__order-qty {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 12px;
        font-size: 20px;
    }

    .order-img {
        width: 104px;
        height: 104px;
        overflow: hidden;
        border-radius: 24px;
    }

    .empty-basket-subtitle {
        color: #b0b0b0;
        font-size: 12px;
        text-align: center;
        margin-top: 12px;
        line-height: 1.67;
    }

    .empty-basket-title {
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
        margin-top: 80px;
    }

    .total-info-block {
        display: flex;
        flex-direction: column;
        align-items: flex-start !important;
        justify-content: center !important;
        flex: 0 0 auto;
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
        line-height: 1em;
        margin-bottom: 4px;
    }

    .total-time {
        font-size: 13px;
        font-weight: 600;
        line-height: 1em;
    }

    .next-btn-block {
        width: 100%;
        margin-left: 16px;
    }

    .next-btn-block button {
        border-radius: 16px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        letter-spacing: 0.1px;
        text-transform: capitalize;
        padding: 0 11px !important;
        height: 56px !important;
    }

    .cart {
        margin-top: -3rem;
        width: 100%;
    }

    .confirm-order {
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        background: #ffffff;
        box-shadow: 0 -4px 20px rgba(117, 115, 111, 0.2);
        height: 84px;
        display: flex;
        padding: 8px 16px 20px;
        z-index: 1;
    }

    .dish-info {
        margin-left: 16px;
        width: 100%;
    }

    .dish-info-text {
        font-size: 16px;
        line-height: 19px;
    }

    .mobile-mode_header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        z-index: 100;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .item-left {
        width: 30%;
        max-width: 104px;
        max-height: 104px;
    }

    .order-deliv-block {
        padding: 14px 18px 15px;
        border-bottom: 1px solid #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 17px;
    }

    .order-knifes {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        flex-direction: row;
        width: 100vw;
        justify-content: space-between;
    }

    .order-knifes .order-knifes__icon {
        margin-right: 10px;
    }

    .order-delivery-info {
        display: flex;
        align-items: center;
        padding: 0 20px 10px;
    }

    .order-delivery-info__title {
        padding: 20px 20px 0;
        font-size: 26px;
        margin-bottom: 10px;
    }

    .order-delivery-info__icon {
        margin-right: 10px;
    }

    .order-delivery-info__text {
        font-size: 16px;
    }

    .list-item {
        width: 100%;
        display: flex;
        padding: 15px 16px 15px 16px;
        font-size: 14px;
        border-bottom: 1px solid #f5f5f5;
        justify-content: flex-start;
        background-color: white;
    }

    .empty-basket-img {
        height: 100%;
        width: 100%;
        min-width: 153px;
        min-height: 153px;
        background-position: center;
        margin-bottom: 10px;
        background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDMiIGhlaWdodD0iMTU0IiB2aWV3Qm94PSIwIDAgMTQzIDE1NCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjRUVFIiBkPSJNMTEuNzY0IDI5aDEwOC45NTRhMiAyIDAgMCAxIDEuOTkgMS44MDFMMTM1IDE1NEgyLjYyNGEyIDIgMCAwIDEtMS45MjgtMi41M2wzLjc5Ni0xMy44MDdhMiAyIDAgMCAwIC4wNjktLjQzMkw5Ljc2NyAzMC45MDJBMiAyIDAgMCAxIDExLjc2NCAyOXoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTYuMjk0IDI2aDEwOS4wNGEyIDIgMCAwIDEgMS45ODggMS43NzlsMTIuMDU0IDEwOC4yNzZhMiAyIDAgMCAwIC4wMjguMTc1bDMuMTEgMTUuMzczYTIgMiAwIDAgMS0xLjk2IDIuMzk3SDE4LjMzNGEyIDIgMCAwIDEtMS45OC0xLjcxMmwtMi4zMzItMTUuOTk4YTIgMiAwIDAgMS0uMDItLjI5NGwuMjkzLTEwOC4wMDFhMiAyIDAgMCAxIDItMS45OTV6Ii8+PGcgZmlsbD0iIzAwMCIgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDE0Ny4wNjkgLTcyLjAxOCkiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIvPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNyA2LjUpIi8+PC9nPjxnIGZpbGw9IiMwMDAiIHRyYW5zZm9ybT0icm90YXRlKC00NSAxMjAuNTY5IC04LjA0MikiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIvPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNyA2LjUpIi8+PC9nPjxwYXRoIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNjUuNDQ0IDEwOGgyMy4xMTIiLz48cGF0aCBzdHJva2U9IiNCMEIwQjAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNDggMjV2LTIuODcxYzAtOS43NTYgNy4wNjktMTcuODkgMTYuNDUxLTE5LjczNkEyMC45NjQgMjAuOTY0IDAgMCAxIDY4LjUgMmM4LjE3NCAwIDE1LjIzMSA0LjY5OCAxOC41MjMgMTEuNDk0QTE5Ljc1IDE5Ljc1IDAgMCAxIDg5IDIyLjEzVjI1Ii8+PHBhdGggc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTU1IDQyVjIxLjVDNTUgMTAuMTc4IDY0LjE3OCAxIDc1LjUgMVM5NiAxMC4xNzggOTYgMjEuNVY0MiIvPjwvZz48L3N2Zz4=");
    }

    .mobile-mode_header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        z-index: 5;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .mobile-mode_header-btn {
        margin: 20px;
    }
}
</style><style>
.order-knifes__switch {
    margin-right: -16px !important;
}

.order-knifes__switch .v-input--switch__track {
    height: 32px !important;
    width: 54px !important;
    border-radius: 16px !important;
}

.order-knifes__switch .v-input--switch__thumb {
    top: calc(50% - 11px) !important;
    height: 26px !important;
    width: 26px !important;
}

.order-knifes__switch .v-input--selection-controls__ripple {
    display: none !important;
}
</style>
