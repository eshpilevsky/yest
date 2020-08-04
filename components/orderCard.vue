<template>
<v-card width="20vw" class="pa-3" color="#f5f5f5">
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
            <v-text-field type="number" v-model="phone" placeholder="+375" required></v-text-field>
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
            <v-text-field type="number" v-model="delivery.flatNum" placeholder="Номер квартиры" required></v-text-field>
        </div>
        <v-card-subtitle color="#000">
            Выберете способ оплаты
        </v-card-subtitle>
        <div>
            <v-radio-group v-model="payment_method" :mandatory="false">
                <v-radio label="Наличными" value=1></v-radio>
                <v-radio label="Банковской картой на сайте" value=0></v-radio>
            </v-radio-group>
        </div>
        <v-card-subtitle color="#000">
            Комментарий
        </v-card-subtitle>
        <div class="pa-3">
            <v-textarea name="comment" dense max-height="50px" v-model="comment" clearable></v-textarea>
        </div>
        <v-card-actions>
            <v-btn block color="primary" @click="sendOrder()" :disabled="phone.length<=11">Заказать</v-btn>
            <v-btn block color="primary" @click="fillForm()">fill form for test</v-btn>
        </v-card-actions>
    </form>
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
            phone: Number,
            delivery: {
                address: '',
                room: '',
                flatNum: '',
                enterence: '',
                intercom: '',
                flor: '',
            },
            payment_method: 1,
            promocode: '',
            comment: '',
            order: [],
        }
    },
    methods: {
        fillForm() {
            this.phone = 375290000000
            this.delivery.address = 'Тестовая'
            this.delivery.room = "Офис"
            this.delivery.flatNum = '0'
            this.delivery.enterence = '0'
            this.delivery.intercom = '0'
            this.delivery.flor = '1'
            this.comment = 'Коммент'
            this.payment_method = 0
        },
        closeCheckout() {
            this.$emit('closeCheckout')
        },
        sendOrder() {
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

            ApiService.post('/create/order', {
                phone: this.phone,
                delivery: {
                    address: this.delivery.address,
                    room: this.delivery.room,
                    flatNum: this.delivery.flatNum,
                    enterence: this.delivery.enterence,
                    intercom: this.delivery.intercom,
                    flor: this.delivery.flor,
				},
				used_bonuses: 0,
                payment_method: this.payment_method,
                promocode: this.promocode,
                order: this.order,
            }).then((response) => {
                console.log('sendOrder -> response', response)

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
