<template>
<div>
    <div class="desktop-form d-flex flex-column">
        <div class="form-fields">
            <div>
                <v-text-field v-model="delivery.address" placeholder="Адрес" required outlined></v-text-field>
            </div>
            <div class="d-flex flex-row">
                <v-text-field type="srting" v-model="delivery.enterence" placeholder="Подъезд" required outlined></v-text-field>
                <v-text-field type="srting" v-model="delivery.flor" placeholder="Этаж" required outlined></v-text-field>
                <v-text-field type="srting" v-model="delivery.intercom" placeholder="Код домофона" required outlined></v-text-field>
                <v-text-field type="srting" v-model="delivery.room" placeholder="Номер квартиры" required outlined></v-text-field>
            </div>
            <div>
                <v-radio-group v-model="payment_method" :mandatory="false">
                    <v-radio label="Наличными" :value=0></v-radio>
                    <v-radio label="Банковской картой на сайте" :value=1></v-radio>
                </v-radio-group>
            </div>
            <v-text-field type="srting" v-model="promocode" placeholder="Промокод (если есть)" outlined></v-text-field>

        </div>
        <div class="form-actions">
            <v-divider />
			<div class="pa-3 d-flex flex-row">
				<div class="moped-block">
					<div class="moped"></div>
					<div class="treangule"></div>
				</div>
				<div class="d-flex flex-column px-3">
					<p>Время доставки</p>
					<p>30 - 40 мин</p>
				</div>
				<div class="d-flex flex-column px-3">
					<p>Итого</p>
					<p>10 BYN</p>
				</div>

			</div>
            <v-card-actions>
                <v-btn block color="primary" @click="sendOrder()" :disabled="phone.length<=11" :loading="loading">Перейти к оплате </v-btn>
            </v-card-actions>
        </div>

    </div>
    <div class="mobile-form">
        <v-card class="confirm-order-modal pa-3" color="#f5f5f5">
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
                    <v-text-field v-model="phone" v-mask="mask" required></v-text-field>
                </div>
                <div>
                    <v-text-field v-model="delivery.address" placeholder="Адрес" required></v-text-field>
                </div>
                <div class="d-flex flex-row">
                    <v-text-field type="srting" v-model="delivery.enterence" placeholder="Подъезд" required></v-text-field>
                    <v-text-field type="srting" v-model="delivery.flor" placeholder="Этаж" required></v-text-field>
                </div>
                <div class="d-flex flex-row">
                    <v-text-field type="srting" v-model="delivery.intercom" placeholder="Код домофона" required></v-text-field>
                    <v-text-field type="srting" v-model="delivery.room" placeholder="Номер квартиры" required></v-text-field>
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
                    <v-btn block color="primary" @click="sendOrder()" :disabled="phone.length<=11" :loading="loading">Заказать</v-btn>
                </v-card-actions>
            </form>
        </v-card>
    </div>
</div>
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
                enterence: '',
                intercom: '',
                flor: '',
            },
            payment_method: 0,
            promocode: '',
            comment: '',
            order: [],
            billingUrl: '',
            loading: false,
            mask: ['+375', '(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, ],
        }
    },
    methods: {
        closeCheckout() {
            this.$emit('closeCheckout')
        },
        sendOrder() {
            this.loading = true
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
            this.phone = parseInt(this.phone, 10)

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
                }
                this.$store.dispatch('basket/dropBasket');
                this.$router.push('/order/onliner_payment/success')
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


.moped-block {
    width: 28px;
    height: 42px;
    position: relative;
    padding-left: 5px;
    margin-right: 10px;
    background-color: #00a646;
}

.treangule {
    top: 6px;
    right: -15px;
    width: 30px;
    height: 30px;
    position: absolute;
    transform: scaleX(0.4) rotate(45deg);
    background-color: #00a646;
    border-top-right-radius: 4px;
}

.moped {
    background-color: #00a646;
    border-radius: 3px;
    width: 24px;
    height: 24px;
    padding: 9px 0;
    z-index: 1;
    position: relative;
    box-sizing: content-box;
    background-size: 100%;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMjB2MjBIMHoiLz48ZyBzdHJva2U9IiMwMDAiPjxwYXRoIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik04Ljg1NyA5LjE0M2MwIC43Ni0xLjE0MyAxLjQ1NS0xLjE0MyAyLjU0NyAwIC42Mi40OTkuODEgMS4xNDMuODFIMTBjMS4xMjYgMCA2LjA4LTQuNTQyIDUuMTQyLTYuOTkiLz48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNi4xODkgMTMuNDFhMS43MTQgMS43MTQgMCAxIDEtMy4xODkuODc1YzAtLjE4Mi4xMzItLjYxNy4zMzMtLjc5OCIvPjxwYXRoIGQ9Ik0xMy4wMTUgNC4wMDVjMi43NzQuMDM1IDQuODI1IDcuNDg5IDQuODI1IDkuMDgxIDAgLjI5Ni0uMTg4LjU3NC0uNTYzLjgzNS0uNjcyLS42MTQtLjg3My0uNTA5LTEuMTYyLS41MDltLTMuMS42OTRjLS4yODIuNDYyLTIuODI1LjM5My0zLjI1Mi4zOTRNOC42ODYgOS42MDVMNC40NSA5LjQ4N2EuNzM2LjczNiAwIDAgMS0uNzM3LS43MzZ2LS4xOTRjMC0uNDI1LjM5LTEuMTA2LjgxNC0xLjA4bDMuOTY5LjU1MWMuMzg4LjAyNS40NzcuMzguNDc3Ljc3IDAgLjQwNy4xMTkuODA3LS4yODguODA3eiIvPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTMuNTI1IDEyLjcyOWMtLjA5MS4wNS0uMjEyLjE0NC0uMzYuMjgyLS4xNi4xNjItLjI0OC4yNTQtLjI2My4yNzZhMS42OCAxLjY4IDAgMCAwLS4zMy45OTkgMS43MTQgMS43MTQgMCAxIDAgMy40MjggMCIvPjxwYXRoIGQ9Ik00LjI4NiA5LjE0M0M0LjI4NiAxMC4yODYgMiAxMC43OSAyIDEyLjc5OGMwIDAgLjQyOC4yOTIuOTQ2LjUybTMuMDY2Ljk3N2MuNTM4LjEyNSAxLjA2Ny4yMDUgMS41NDIuMjA1aDMuMjA1TTEzLjA0MyA0SDExIi8+PC9nPjwvZz48L3N2Zz4=);
    background-repeat: no-repeat;
    background-position: center;
}


.desktop-form {
    display: flex;
    margin-top: 3rem;
}

.mobile-form {
    display: none;
}

@media screen and (max-width: 992px) {
    .desktop-form {
        display: none;
    }

    .mobile-form {
        display: flex;
    }

    .confirm-order-modal {
        max-height: calc(100vh - 100px);
        overflow: auto;
    }

    .card-title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        color: black;
    }
}
</style>
