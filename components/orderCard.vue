<template>
<v-card class="pa-3" color="#f5f5f5">
    <v-card-title class="card-title">
        Ваш заказ
        <v-icon @click="closeCheckout()" color="#000">
            close
        </v-icon>
    </v-card-title>
    <v-card-subtitle color="#000">
        Телефон для связи
    </v-card-subtitle>
    <form>
        <div>
            <v-text-field type="number" counter v-model="phone" placeholder="+375" required></v-text-field>
        </div>
        <div>
            <v-text-field v-model="delivery.address" placeholder="Адресс" required></v-text-field>
        </div>
        <div class="d-flex flex-row">
            <v-text-field type="number" v-model="delivery.enterence" placeholder="Подъезд" required></v-text-field>
            <v-text-field type="number" v-model="delivery.flor" placeholder="Этаж" required></v-text-field>
        </div>
        <div class="d-flex flex-row">
            <v-text-field type="number" v-model="delivery.intercom" placeholder="Код домофона" required></v-text-field>
            <v-text-field type="number" v-model="delivery.room" placeholder="Номер квартиры" required></v-text-field>
        </div>
        <v-card-subtitle color="#000">
            Выберете способ оплаты
        </v-card-subtitle>
        <div>
            <v-radio-group v-model="payment_method" :mandatory="false">
                <v-radio label="Наличными" :value=0></v-radio>
                <v-radio label="Банковской картой на сайте" :value=1></v-radio>
            </v-radio-group>
        </div>
        <v-card-subtitle color="#000">
            Комментарий
        </v-card-subtitle>
        <div class="pa-3">
            <v-textarea name="comment" dense max-height="50px" v-model="comment" clearable></v-textarea>
        </div>
        <v-card-actions>
            <v-btn block color="primary" @click="sendOrder()" :disabled="phone.length<=11" :loading="loading" >Заказать</v-btn>
        </v-card-actions>
    </form>
    <v-overlay :dark="false" v-model="showWaitConfirmOrder">
        <v-card>
            <v-card-title class="d-flex justify-space-between">
                Ваш заказ сформирован
                <v-icon @click="closeConfirmOrder()">
                    close
                </v-icon>
            </v-card-title>
            <v-card-text>
                Скоро с Вами cвяжется оператор для подтверждения заказа
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
                <v-btn @click="closeConfirmOrder()" color="primary" outlined>
                    Закрыть
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-overlay>
</v-card>
</template>

<script>
import ApiService from "~/common/api.service";

import {
    mapGetters
} from "vuex";
export default {
    data() {
        return {
            phone: 375,
            delivery: {
                address: '',
                room: '',
                enterence: '',
                intercom: '',
                flor: '',
            },
            payment_method: 1,
            promocode: '',
            comment: '',
            order: [],
            billingUrl: '',
            showWaitConfirmOrder: false,
            loading: false,
        }
    },
    methods: {
        closeConfirmOrder() {
            this.showWaitConfirmOrder = false
        },
        closeCheckout() {
            this.$emit('closeCheckout')
        },
        sendOrder() {
			this.loading = true
            console.log(this.getSelectedDishs);
            let dishId;
            let dishOption = [];
            this.getSelectedDishs.forEach((dish) => {
                dishId = dish.selectSize.id
                if (dish.hasOwnProperty('selectOption')) {
                    dish.selectOption.forEach((option) => {
                        dishOption.push(option.id)
                    })
                }
                let result;
                if (dish.options.length == 0) {
                    result = {
                        id: dishId,
                        count: dish.count,
                    }
                } else {
                    let result = {
                        id: dishId,
                        options: dishOption,
                        count: dish.count,
                    }
                }
                this.order.push(result)
			})
			this.phone = parseInt(this.phone,10)

            ApiService.post('/create/order', {
                phone: this.phone,
                delivery: {
                    address: this.delivery.address,
                    room: this.delivery.room,
                    enterence: this.delivery.enterence,
                    intercom: this.delivery.intercom,
                    flor: this.delivery.flor,
                },
                used_bonuses: 0,
                payment_method: this.payment_method,
                promocode: this.promocode,
                comment: this.comment,
                order: this.order,
            }).then((response) => {
				console.log('sendOrder -> response', response.data)
                if (response.data.hasOwnProperty('checkout')) {
					window.location = response.data.checkout.redirect_url
                } else {
					this.showWaitConfirmOrder = true
                }
				this.loading = false
            }).catch((error) => {
                console.error(error)
            })
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: "zone/getSelectedZone",
            getSelectedDishs: "basket/getSelectedDishs",
            getTotalPrice: "basket/getTotalPrice",
            getCurrentAddress: "map/getCurrentAddress",
        }),
    },
    mounted() {
        if (this.getCurrentAddress.length > 0) {
            this.delivery.address = this.getCurrentAddress
        }
    },
}
</script>

<style scoped>
.card-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    color: black;
}
</style>
