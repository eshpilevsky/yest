<template>
  <div>
    <div class="desktop-form">
      <div class="desktop-form__wrapper">
        <div class="customer-info">
          <p class="customer-info__title">Ваш телефон:</p>
          <p class="customer-info__number">+{{this.getUserPhoneNumber}}</p>
        </div>
        <div class="form-fields">
          <v-card-title class="form-title">
            Адрес доставки
          </v-card-title>
          <div class="form-fields__container">
            <p class="form-fields__label">Адрес</p>
            <v-text-field class="form-input" v-model="delivery.address" placeholder="" required outlined :append-icon="this.getCurrentAddress !== '' ? 'enhanced_encryption' : ''"></v-text-field>
          </div>
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
          <h3 class="form-title">Способ оплаты</h3>
          <v-radio-group class="form-fields__radio-group" v-model="payment_method" :mandatory="false">
            <v-radio class="form-fields__radio-field" label="Наличными" :value=0></v-radio>
            <v-radio class="form-fields__radio-field" label="Банковской картой на сайте" :value=1></v-radio>
          </v-radio-group>
          <!-- <div class="form-fields__container form-promo">
              <v-text-field class="form-input" type="srting" v-model="promocode" placeholder="Промокод (если есть)" outlined></v-text-field>
              <v-btn class="form-promo__button" height='32' dense color="primary" :disabled='promocode.length < 3'>Применить</v-btn>
          </div> -->
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
              <p class="form-options__text">{{this.getTotalPriceWithDelivery}} <span class="fs16">BYN</span></p>
            </div>
          </div>
          <div class="form-additional">
            <span class="form-additional__title">Количество приборов</span>
            <div class="form-add">
              <div class="form-add__btn" @click="removeCutlery()">
                <v-icon>
                  remove
                </v-icon>
              </div>
              <span class="form-add__count">
                            {{cutleryCounter}}
                        </span>
              <div class="form-add__btn" @click="addCutlery()">
                <v-icon>
                  add
                </v-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-btn class="form-fields__submit" block color="primary" @click="sendOrder()" :loadingSendOrder="loadingSendOrder">
        {{this.payment_method == 0 ? 'Оформить заказ' : 'Перейти к оплате'}}
      </v-btn>
    </div>
    <div class="mobile-form">
      <div class="mobile-form-header">
        <v-icon class="mobile-form-header__icon" @click="closeCheckout()" color="#000">arrow_back</v-icon>
        <span class="mobile-form-header__title">Оформление заказа</span>
      </div>
      <v-card class="confirm-order-modal">
        <v-card-title class="mobile-form-title">Адрес доставки</v-card-title>
        <form>
          <div class="mobile-input">
            <span class="mobile-input__label fs12">Адрес доставки</span>
            <v-text-field class="mobile-input__field" v-model="delivery.address" placeholder="" required></v-text-field>
          </div>
          <div class="mobile-from__box">
            <div class="mobile-input">
              <span class="mobile-input__label">Кв./Офис</span>
              <v-text-field class="mobile-input__field" type="srting" v-model="delivery.room" placeholder="" required></v-text-field>
            </div>
            <div class="mobile-input">
              <span class="mobile-input__label">Домофон</span>
              <v-text-field class="mobile-input__field" type="srting" v-model="delivery.intercom" placeholder="" required></v-text-field>
            </div>
            <div class="mobile-input">
              <span class="mobile-input__label">Подъезд</span>
              <v-text-field class="mobile-input__field" type="srting" v-model="delivery.enterence" placeholder="" required></v-text-field>
            </div>
            <div class="mobile-input">
              <span class="mobile-input__label">Этаж</span>
              <v-text-field class="mobile-input__field" type="srting" v-model="delivery.flor" placeholder="" required></v-text-field>
            </div>
          </div>
          <div class="mobile-input">
            <span class="mobile-input__label">Комментарий к заказу</span>
            <v-text-field class="mobile-input__field" v-model="comment" name="comment" placeholder=""></v-text-field>
            <!--                  <v-textarea rows="1" class="mobile-input__field" name="comment" dense max-height="50px" v-model="comment" clearable></v-textarea>-->
          </div>
          <v-card-subtitle class="mobile-payment-title">
            Выберете способ оплаты
          </v-card-subtitle>
          <div>
            <v-radio-group v-model="payment_method" :mandatory="false">
              <v-radio label="Наличными" :value=0></v-radio>
              <v-radio label="Банковской картой на сайте" :value=1></v-radio>
            </v-radio-group>
          </div>
          <div class="mobile-form__shipping">
            <p class="mobile-form__shipping-title">Доставка</p>
            <p class="mobile-form__shipping-time">
              {{`${time.min} - ${this.time.max}`}} мин
            </p>
          </div>
          <v-card-actions class="mobile-form__actions">
            <v-btn class="mobile-form__submit" block color="primary" @click="sendOrder()" :disabled="delivery.address.length == 0" :loading="loadingSendOrder">
              {{payment_method == 0 ? 'Оформить заказ' : 'Перейти к оплате'}}
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
        loadingSendOrder: false,
        mask: ['+375', '(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, ],
        time: {},
        cutleryCounter: 0,
      }
    },
    methods: {
      removeCutlery() {
        if (this.cutleryCounter > 1 || this.cutleryCounter !== 0) {
          this.cutleryCounter--
        }
      },
      addCutlery() {
        this.cutleryCounter++
      },
      closeCheckout() {
        this.$emit('closeCheckout')
      },
      sendOrder() {
        this.loadingSendOrder = true
        let dishId;
        let dishOption = [];
        this.getSelectedDishs.forEach((dish) => {
          dishId = dish.selectSize.id
          if (dish.hasOwnProperty('selectOption')) {
            dish.selectOption.forEach((option) => {
              if (option.selected.length > 1) {
                option.selected.forEach((opt) => {
                  if (opt.id !== undefined) {
                    dishOption.push({
                      id: opt.id
                    })
                  }
                })
              } else {
                if (option.selected.id !== undefined) {
                  dishOption.push({
                    id: option.selected.id
                  })
                }
              }
            })
          }

          let result;
          if (dishOption == []) {
            result = {
              id: dishId,
              count: dish.selectSize.count,
            }
          } else {
            result = {
              id: dishId,
              options: dishOption,
              count: dish.selectSize.count,
            }
          }
          this.order.push(result)
        })
        console.log(this.order);
        ApiService.post('/create/order', {
          phone: this.getUserPhoneNumber,
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

          ym(67033669,'reachGoal','newOrder')

          if (response.data.hasOwnProperty('checkout')) {
            window.location = response.data.checkout.redirect_url
          } else {
            this.$store.dispatch('basket/setOrderId', response.data.order_id);
            this.$router.push('/checkout/success')
          }
          this.$store.dispatch('basket/dropBasket');
          this.loadingSendOrder = false

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
        getTotalPriceWithDelivery: "basket/getTotalPriceWithDelivery",
        getTotalPrice: "basket/getTotalPrice",
        getCurrentAddress: "map/getCurrentAddress",
        getUserPhoneNumber: "user/getUserPhoneNumber",
      }),
    },
    mounted() {
      if (this.getLatetestRestInfoWithOrder !== null) {
        this.time = this.getLatetestRestInfoWithOrder.delivery.time
      } else {
        this.time = {
          max: 0,
          min: 0
        }
      }
      if (this.getCurrentAddress.length > 0) {
        this.delivery.address = this.getCurrentAddress
      }
    },
  }
</script>

<style>
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

  .form-input .v-input__append-inner {
    margin-top: 4px !important;
    margin-right: -8px !important;
  }

  .form-textarea {
    margin-top: 0 !important;
    margin-bottom: 6px !important;
  }

  .form-textarea .v-text-field__details {
    display: none !important;
  }

  .form-textarea .v-text-field__slot {
    width: 100%;
    min-width: 100%;
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

  .form-textarea.v-input--is-focused {
    margin-bottom: 4px !important;
  }

  .form-textarea.v-input--is-focused .v-input__slot {
    border: 2px solid #4ca647 !important;
  }

  .form-textarea .v-input__slot:after {
    display: none;
  }

  .form-textarea textarea {
    padding: 0 10px !important;
    height: 80px;
  }

  .form-textarea .v-input__append-inner {
    display: none;
  }

  .form-promo .v-input__slot {
    border-radius: 4px 0 0 4px;
  }

  .fs16 {
    font-size: 16px;
  }
</style><style scoped>
  .desktop-form__wrapper {
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
    margin-bottom: 8px;
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
    margin-bottom: 16px;
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
    text-transform: initial !important;
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
    padding: 16px 40px;
    align-items: center;
    border-right: 1px solid #e5e5e5;
  }

  .form-additional {
    display: flex;
    align-items: center;
    padding: 16px 40px 16px 30px;
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
    box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, .2);
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

  .customer-info {
    padding: 10px 40px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ddd;
  }

  .customer-info__title {
    font-size: 14px;
    font-weight: 600;
  }

  .customer-info__number {
    font-size: 14px;
  }

  @media screen and (max-width: 992px) {
    .desktop-form {
      display: none;
    }

    .mobile-form {
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }

    .mobile-form-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 66px;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 20;
      border-bottom: 1px solid #e5e5e5;
    }

    .mobile-form-header__icon {
      position: absolute !important;
      top: 20px;
      left: 16px;
    }

    .mobile-form-header__title {
      font-weight: 600;
      font-size: 16px;
    }

    .mobile-form-title {
      padding: 10px 0;
      font-weight: 600;
      font-size: 20px;
    }

    .mobile-from__box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 10px;
    }

    .mobile-input .mobile-input__label {
      font-size: 13px;
      color: #8b8b8b;
      line-height: 1em;
      margin-bottom: -4px;
      display: block;
    }

    .mobile-input .mobile-input__label.fs12 {
      font-size: 12px;
    }

    .mobile-input .mobile-input__field {
      margin-top: 0;
      padding-top: 0;
      margin-bottom: 10px;
    }

    .mobile-payment-title {
      padding: 0;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 600;
      color: #000 !important;
    }

    .mobile-form__shipping {
      border-bottom: 1px solid #ddd;
      padding: 20px 0 10px;
      margin-bottom: 30px;
    }

    .mobile-form__shipping-title {
      font-size: 13px;
      color: #8b8b8b;
      line-height: 1em;
      margin-bottom: 4px;
      display: block;
    }

    .mobile-form__shipping-time {
      font-size: 16px;
    }

    .mobile-form__actions {
      padding: 0;
      margin-bottom: 20px;
    }

    .mobile-form__submit {
      height: 50px !important;
      font-size: 13px !important;
      text-transform: initial;
      background-color: green;
      position: relative;
      border-radius: 10px;
    }

    .mobile-form__submit-total {
      position: absolute;
      top: -3px;
      right: 4px;
      border-radius: 4px;
      padding: 4px;
      background-color: rgba(100, 100, 100, 0.1);
      font-size: 12px;
    }

    .confirm-order-modal {
      width: 100%;
      margin-top: 10px;
      background-color: #fff;
      padding: 16px;
      box-shadow: none;
    }
  }
</style>
