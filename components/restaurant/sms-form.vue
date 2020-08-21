<template>
<v-card class="sms-modal">
    <img class="sms-modal__logo" src="../../assets/logo.svg" alt="Logo">
    <v-card-title class="sms-modal__title">
        Пожалуйста, укажите <br> свой телефон
    </v-card-title>
    <v-icon class="sms-modal__close" @click="closeForm()" v-show="currentRouteName !== 'cart'">
        close
    </v-icon>
    <v-text-field class="sms-modal__field" label="Ваш номер телефона" outlined v-model="phone" v-mask="mask" :disabled="!smsSuccess"></v-text-field>
    <div v-show="!smsSuccess">
        <v-text-field label="Код из смс" outlined v-model="code"></v-text-field>
    </div>
    <v-btn class="sms-modal__send-sms" id="send-sms-modal-btn" block color="primary" :disabled="phone.length < 17" :loading="loadingSendSms" @click="sendSms()" v-show="smsSuccess">
        Получить код
    </v-btn>
    <v-btn block color="primary" :disabled="code.length < 3" @click="goToCheckout()" v-show="!smsSuccess">
        Дальше
    </v-btn>
</v-card>
</template>

<script>
export default {
    data() {
        return {
            phone: ' ',
            mask: ['+375', '(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, ],
            code: "1111",
            loadingSendSms: false,
			smsSuccess: true,
			currentRouteName: null,
        }
    },
    methods: {
		closeForm() {
			this.$emit('closeForm')
		},
        sendSms() {
            this.loadingSendSms = true
            setTimeout(() => {
                this.smsSuccess = false
                this.loadingSendSms = false
            }, 3000);
        },
        goToCheckout() {
			this.$store.dispatch('user/setUserPhoneNumber', this.phone);
			if (this.currentRouteName !== 'cart') {
				this.$router.push('/checkout')
				console.error('push to checkout');
			} else {
				console.error('need close');
				this.$emit('closeFormShowOrderForm')
			}
        },
	},
	mounted () {
		this.currentRouteName = this.$route.name
	},

}
</script>

<style>
  .sms-modal #send-sms-modal-btn.sms-modal__send-sms.v-btn--disabled {
    background-color: #4ca647 !important;
  }
</style>

<style scoped lang="scss">
  .sms-modal {
    padding: 20px;
    position: relative;
    max-width: 440px;
    min-width: 440px;
    width: 100%;

    &__logo {
      max-width: 120px;
      display: block;
      margin: 0 auto 20px;
    }

    &__title {
      padding: 0;
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: 600;
      justify-content: center;
      text-align: center;
      line-height: 24px;
    }

    &__close {
      position: absolute;
      top: 10px;
      right: 10px;
    }

    &__field {
      margin-bottom: 10px;
    }

    &__send-sms {
      text-transform: initial;
      font-size: 16px;
      font-weight: 600;
      height: 50px !important;
    }
  }
</style>
