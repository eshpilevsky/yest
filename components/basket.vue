<template>
<client-only>
<div class="right-my-order">
    <div class="my-order-top">
        <div class="order-title">
            <p>
                Мой заказ
            </p>
            <v-icon v-show="this.orderList.length > 0 && this.$route.name == 'restik'" @click="dropBasket()">
                delete_forever
            </v-icon>
        </div>
        <div v-if="this.orderList.length > 0 && this.getLatetestRestInfoWithOrder.params.resName == this.$router.currentRoute.params.resName" class="my-order-dishes-desktop">
            <div v-for="order in this.orderList" :key="order.selectSize.id" class="order-item">
                <div class="d-flex flex-column order-item__title">
                    <div class="d-flex flex-column order-item-info">
                        <div class="item-name">
                            <span>{{order.name}}</span>
                            <span class="order-item-subbtitle">
                                {{order.selectSize.weight}}
                            </span>
                        </div>
                    </div>
                    <div class="order-item-subbtitle">
                        {{order.selectSize.name}}
                    </div>
                </div>
                <div class="d-flex flex-column my-counter">
                    <div class="counter-plus" @click="increment(order)">
                        <v-icon>
                            add
                        </v-icon>
                    </div>
                    <div class="counter-count">
                        {{order.selectSize.count}}
                    </div>
                    <div class="counter-minus" @click="decrement(order)">
                        <v-icon>
                            {{order.selectSize.count == 1 ? 'close' : 'remove'}}
                        </v-icon>
                    </div>
                </div>
                <div class="pl-4 order-item__price">
                    {{order.selectSize.price }} <span class="fs10">BYN</span>
                </div>
            </div>
        </div>
        <div v-else class="my-order">
            <span class="my-order-text">
                Выберите блюда и добавьте их к заказу
            </span>
        </div>
    </div>
    <div class="delivery-options" v-show="this.getTotalPrice > 0">
        <v-divider />
        <div class="my-order-top__total d-flex flex-row justify-space-between align-center py-2">
            <span class="delivery-title">
                Доставка
            </span>
            <span class="delivery-count">
				{{deliveryCost}} BYN
            </span>
        </div>
        <p class="more-delivery delivery-info-text">
			{{this.deliveryString}}
        </p>
    </div>
    <div class="my-order-bottom">
        <div class="total-price">
            <p class="total-title">Итого</p>
            <p v-if="this.orderList.length > 0 && this.getLatetestRestInfoWithOrder.params.resName == this.$router.currentRoute.params.resName" class="price">{{this.getTotalPrice}} BYN</p>
            <p v-else class="price">0.0 BYN</p>
        </div>
    </div>
</div>
</client-only>
</template>

<script>
import {
    mapGetters
} from "vuex";
export default {
	data() {
		return {
			deliveryString: null,
			deliveryCost: null,
		}
	},
    props: {
        orderList: Array,
        delivery: Object,
    },
    methods: {
        computedFreeDeliveryCost() {
            let deliveryMass = this.sortDeliverFee
            let price = parseFloat(this.getTotalPrice)
            let finded = deliveryMass.findIndex((cost) => {
                return cost.min <= price && price <= cost.max
            })
            if (finded !== undefined) {
                if (deliveryMass[deliveryMass.length - 1].min < price) {
                    return ``
                } else {
					let computedNextSum = deliveryMass[finded + 1].min - price
					if (deliveryMass[finded+1].delivery ? deliveryMass[finded+1].delivery : deliveryMass[finded+1].deliveryFee !== 0) {
						return `Закажите ещё на ${computedNextSum.toFixed(1)} BYN для доставки за ${deliveryMass[finded+1].delivery ? deliveryMass[finded+1].delivery : deliveryMass[finded+1].deliveryFee} BYN`
					} else {
						return `Закажите ещё на ${computedNextSum.toFixed(1)} BYN для бесплатной доставки`
					}
                }
            } else {
                return ``
            }
        },
        computedDeliveryCost() {
            let deliveryMass = this.sortDeliverFee
            let price = parseInt(this.getTotalPrice)
            let finded = deliveryMass.find((cost) => {
                if (cost.min <= price && price <= cost.max) {
                    return cost
                }
            })
            if (finded !== undefined) {
				if (finded.hasOwnProperty('delivery')) {
					return finded.delivery
				} else {
					return finded.deliveryFee
				}
            } else {
                return deliveryMass[deliveryMass.length - 1].deliveryFee
            }

        },
        dropBasket() {
            this.$store.dispatch('basket/dropBasket');
        },
        decrement(dish) {
            this.showDish = false
            this.$store.dispatch('basket/decrementDishCounter', dish);
        },
        increment(dish) {
            this.showDish = false
            this.$store.dispatch('basket/incrementDishCounter', dish);
        },
    },
    watch: {
        getSelectedDishs(newValue) {
            this.orderList = newValue
            return newValue
		},
		getTotalPrice(newValue) {
			this.deliveryString = this.computedFreeDeliveryCost();
			this.deliveryCost = this.computedDeliveryCost();
		},
		getSelectedZone(newValue) {
            this.dropBasket()
		},
		orderList(newValue){
			return newValue
		}
    },
    computed: {
        ...mapGetters({
            getSelectedZone: "zone/getSelectedZone",
            getSelectedCategory: "user/getSelectedCategory",
            getCurrentCoords: "map/getCurrentCoords",
            getUserLocation: "user/getUserLocation",
            getSelectedDishs: "basket/getSelectedDishs",
            getTotalPrice: "basket/getTotalPrice",
            getLatetestRestInfoWithOrder: "basket/getLatetestRestInfoWithOrder",
        }),
        sortDeliverFee() {
            let listt = this.delivery.fee
            // console.log('sortDeliverFee -> listt', listt)
            // let sorted = listt.sort((a, b) => {
            //     return a.delivery ? a.delivery > b.deliveryFee : a.deliveryFee > b.deliveryFee
            // })
			// return sorted
			return listt
        },
	},
	mounted () {
		this.deliveryString = this.computedFreeDeliveryCost();
		this.deliveryCost = this.computedDeliveryCost();
	},

}
</script>

<style scoped>
.order-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
}

.order-title p {
    font-size: 20px;
    font-weight: bold;
    margin-right: auto;
}

.options-list {
    background: #fafafa;
    padding: 6px 20px 0;
    max-height: calc(100vh - 220px);
    overflow-y: auto;
    margin: 0 -20px;
}

.select-option-card {
    color: #000 !important;
    padding: 14px 20px 20px;
    max-width: 660px;
    border-radius: 10px !important;
    max-height: calc(100vh - 80px);
    overflow: hidden;
}

.multi-title {
    color: #b0b0b0;
    font-size: 12px;
    padding-top: 8px;
    text-transform: uppercase;
}

.close-select-option {
    cursor: pointer;
    margin-top: 2px;
}

.select-option-title {
    font-size: 24px;
    font-weight: bold;
    line-height: 36px;
}


.counter-plus,
.counter-minus {
    display: none;
    cursor: pointer;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 35px;
    background-color: #fff !important;
    z-index: 1;
}

.order-item__title {
    flex: 1 1 60%;
}

.order-item__price {
    flex: 0 1 20%;
    font-size: 14px;
    text-align: right;
    padding-left: 10px !important;
}

.order-item-info {
    flex: 1 1 60%;
    line-height: 1em;
}

.order-item-subbtitle {
    color: #b0b0b0;
    font-size: 12px;
    white-space: nowrap;
}

.order-item {
    padding: 10px 20px;
    font-size: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
}

.price {
    font-size: 25px;
}

.total-title {
    color: #b0b0b0;
    font-size: 14px;
}

.total-price {
    border-top: 1px solid rgba(0, 0, 0, .05);
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-items: center;
    padding: 10px 0;
}

.my-order-text {
    color: #b0b0b0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    /*padding-top: 80%;*/
    margin: auto;
    text-align: center;
}
.my-counter {
    min-width: 35px;
    height: 35px;
    min-height: 35px;
    display: flex;
    align-items: center;
    position: relative;
    flex: 0 1 10%;
    margin-top: -6px;
}

.my-counter .counter-count {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b0b0b0;
    font-weight: 300;
    font-size: 14px;
    min-width: 35px;
    min-height: 35px;
    line-height: 35px;
    height: 35px;
}

.my-counter .counter-plus {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    border-bottom: none !important;
}

.my-counter .counter-minus {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border-top: none !important;
}

.my-counter:hover .counter-count,
.my-counter:hover .counter-plus,
.my-counter:hover .counter-minus {
    display: flex;
    border: .5px solid rgb(176, 176, 176);
    cursor: pointer;
    background-color: #fff !important;
}
.order-item__title {
    flex: 1 1 60%;
}

.order-item__price {
    flex: 0 1 20%;
    font-size: 14px;
    text-align: right;
    padding-left: 10px !important;
}

.order-item-info {
    flex: 1 1 60%;
    line-height: 1em;
}

.order-item-subbtitle {
    color: #b0b0b0;
    font-size: 12px;
    white-space: nowrap;
}

.order-item {
    padding: 10px 20px;
    font-size: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
}

.price {
    font-size: 25px;
}

.total-title {
    color: #b0b0b0;
    font-size: 14px;
}

.total-price {
    border-top: 1px solid rgba(0, 0, 0, .05);
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-items: center;
    padding: 10px 0;
}

.my-order-text {
    color: #b0b0b0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    /*padding-top: 80%;*/
    margin: auto;
    text-align: center;
}


.my-order-top {
    display: flex;
    flex-direction: column;
    overflow: auto;
    max-height: calc(100% - 160px);
}

.my-order-top__total {
    padding: 8px 20px 0 !important;
}


.right-my-order .my-order {
    flex: auto;
}

.right-my-order {
    height: calc(100vh - 154px);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #f2f2f2;
    border-radius: 5px;
    margin-bottom: 10px;
}
</style>
