<template>
<v-card>
    <v-card-title class="d-flex flex-row">
        Пожалуйста укажите свой телефон
        <v-icon @click="closeForm()" v-show="currentRouteName !== 'cart'">
            close
        </v-icon>
    </v-card-title>
    <div>
        <v-text-field label="Ваш номер телефона" outlined v-model="phone" v-mask="mask" :disabled="!smsSuccess"></v-text-field>
    </div>
    <div v-show="!smsSuccess">
        <v-text-field label="Код из смс" outlined v-model="code"></v-text-field>
    </div>
    <v-btn block color="primary" :disabled="phone.length < 17" :loading="loadingSendSms" @click="sendSms()" v-show="smsSuccess">
        Отправить смс
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

<style scoped>

</style>
