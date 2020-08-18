<template>
<div>
    <div class="desktop-form">
        <div class="desktop-form__wrapper">
          <div class="form-fields">
            <v-card-title class="form-title">
              Адрес доставки
            </v-card-title>
            <v-text-field class="form-input" v-model="delivery.address" placeholder="" required outlined :disabled="this.getCurrentAddress !== ''"></v-text-field>
            <div class="form-fields__grid-wrapper">
              <div class="form-fields__container">
                <p class="form-fields__label">Кв./офис</p>
                <v-text-field class="form-input" type="srting" v-model="delivery.room" placeholder="" required outlined></v-text-field>
              </div>
              <div class="form-fields__container">
                <p class="form-fields__label">Домофон</p>
                <v-text-field class="form-input" type="srting" v-model="delivery.intercom" placeholder="" required outlined></v-text-field>
              </div>
              <div class="form-fields__container">
                <p class="form-fields__label">Этаж</p>
                <v-text-field class="form-input" type="srting" v-model="delivery.flor" placeholder="" required outlined></v-text-field>
              </div>
              <div class="form-fields__container">
                <p class="form-fields__label">Подъезд</p>
                <v-text-field class="form-input" type="srting" v-model="delivery.enterence" placeholder="" required outlined></v-text-field>
              </div>
            </div>
            <div class="form-fields__container">
              <p class="form-fields__label">Комментарий к заказу</p>
              <v-textarea class="form-textarea" name="comment" dense max-height="50px" v-model="comment" clearable></v-textarea>
            </div>
            <h3 class="form-title">Оплата</h3>
            <v-radio-group class="form-fields__radio-group" v-model="payment_method" :mandatory="false">
              <v-radio label="Наличными" :value=0></v-radio>
              <v-radio label="Банковской картой на сайте" :value=1></v-radio>
            </v-radio-group>
            <div class="form-fields__container form-promo">
              <v-text-field class="form-input" type="srting" v-model="promocode" placeholder="Промокод (если есть)" outlined></v-text-field>
              <!-- <button class="form-promo__button" >Применить</button> -->
              <v-btn class="form-promo__button" height='32' dense color="primary" :disabled='promocode.length < 3'>Применить</v-btn>
            </div>
          </div>
          <div class="form-actions">
            <div class="form-actions__wrapper d-flex flex-row">
              <div class="moped-block">
                <div class="moped"></div>
                <div class="treangule"></div>
              </div>
              <div class="form-options d-flex flex-column">
                <p class="form-options__text form-options__description">Время доставки</p>
                <p class="form-options__text">{{`${time.min} - ${this.time.max} мин`}}</p>
              </div>
              <div class="form-options d-flex flex-column">
                <p class="form-options__text form-options__description">Итого</p>
                <p class="form-options__text">{{this.getTotalPrice}} BYN</p>
              </div>
            </div>
            <div class="form-additional">
              <span class="form-additional__title">Количество приборов</span>
              <div class="form-add">
                <div class="form-add__btn">
                  <v-icon>
                    add
                  </v-icon>
                </div>
                <span class="form-add__count">
                  1
                </span>
                <div class="form-add__btn">
                  <v-icon>
                    remove
                  </v-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <v-btn class="form-fields__submit" block color="primary" @click="sendOrder()" :loading="loading">Перейти к
            оплате
        </v-btn>
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
                    <v-btn block color="primary" @click="sendOrder()" :disabled="phone.length<=11" :loading="loading">Заказать
                    </v-btn>
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
            time: {}
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
            getLatetestRestInfoWithOrder: "basket/getLatetestRestInfoWithOrder",
            getTotalPrice: "basket/getTotalPrice",
            getCurrentAddress: "map/getCurrentAddress",
        }),
    },
    mounted() {
        this.time = this.getLatetestRestInfoWithOrder.delivery.time
        if (this.getCurrentAddress.length > 0) {
            this.delivery.address = this.getCurrentAddress
        }
    },
}
</script>

<style>
.desktop-form .v-radio .v-label {
    font-weight: 600 !important;
}

.form-input .v-input__slot {
    background-color: #fff !important;
    align-items: stretch;
    min-height: 32px !important;
    height: 32px !important;
    box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.2);
}

.form-input .v-input__control {
    max-height: 40px !important;
    height: 40px !important;
}

.form-textarea {
    margin-top: 0;
}

.form-textarea .v-input__slot {
    background: #fff;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
    box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.form-textarea .v-input__slot:before {
    display: none;
    content: none;
}

.form-textarea.v-input--is-focused .v-input__slot {
    border: 2px solid #4ca647 !important;
}

.form-textarea .v-input__slot:after {
    display: none;
}

.form-textarea textarea {
    padding: 0 10px;
    height: 80px;
}

.form-textarea .v-input__append-inner {
    display: none;
}

.form-promo .v-input__slot {
    border-radius: 4px 0 0 4px;
}
</style>

<style scoped>
.desktop-form__wrapper {
  padding-top: 40px;
  border-radius: 4px;
  background-color: #f2f2f2;
  margin-bottom: 10px;
}

.form-fields {
    display: flex;
    flex-direction: column;
    max-width: 470px;
    padding: 0 40px;
}

.form-fields__grid-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 10px;
    max-height: 65px;
    height: 65px;
}

.form-fields__container {
    width: 100%;
}

.form-fields__label {
    font-size: 14px;
    color: #b0b0b0;
    margin-bottom: 0;
}

.form-input {
    background-color: transparent;
    margin-bottom: 4px;
    max-height: 40px;
    height: 40px;
}

.form-title {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0.1px;
    padding: 0;
}

.form-fields__radio-group {
  margin-top: 0;
}

.form-fields__submit {
  text-transform: initial;
  font-weight: 600;
  font-size: 16px;
  box-shadow: none;
}

.form-promo {
    display: flex;
    align-items: flex-start;
    margin-bottom: 23px;
}

.form-promo__button {
    flex: 0 0 auto;
    width: auto;
    font-size: 14px;
    font-weight: 600;
    min-height: auto;
    border-radius: 0 4px 4px 0;
    /* border: 1px solid #4ca647;
    background-color: #4ca647; */
    color: #fff;
    height: 32px;
    border-left: none;
    padding: 4px 10px;
    outline: none;
    margin-left: -1px;
    z-index: 1;
}

.form-options {
  margin-right: 50px;
}

.form-options__text {
  margin-bottom: 0;
  font-size: 25px;
  line-height: 1em;
}

.form-options__description {
  color: #b0b0b0;
  font-size: 14px;
  padding-bottom: 7px;
  line-height: 1em;
}

.form-actions {
  border-top: 1px solid #e5e5e5;
  display: grid;
  grid-template-columns: 2fr 1fr;
}

.form-actions__wrapper {
  padding: 20px 40px;
  align-items: center;
  border-right: 1px solid #e5e5e5;
}

.form-additional {
  display: flex;
  align-items: center;
  padding: 20px 40px 20px 30px;
  justify-content: space-between;
}

.form-additional__title {
  font-size: 14px;
  align-items: 1em;
}

.form-add {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 10px;
}

.form-add__count {
  padding: 4px 12px;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  background-color: #fff;
  box-shadow: inset 0 1px 3px 0 rgba(0,0,0,.2);
}

.form-add__btn {
  padding: 4px 6px;
  cursor: pointer;
}

.mobile-form {
    display: none;
}

.moped-block {
    width: 28px;
    height: 42px;
    position: relative;
    padding-left: 5px;
    margin-right: 30px;
    background-color: #00a646;
    border-radius: 4px;
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
