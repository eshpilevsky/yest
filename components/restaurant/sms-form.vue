<template>
<v-card class="sms-modal">
    <img class="sms-modal__logo" src="@/assets/logo.svg" alt="Logo">
    <v-card-title class="sms-modal__title">
        Пожалуйста, укажите <br> свой телефон
    </v-card-title>
    <v-icon class="sms-modal__close" @click="closeForm()" v-show="currentRouteName !== 'cart'">
        close
    </v-icon>
    <v-text-field class="sms-modal__field" label="Ваш номер телефона" outlined v-model="phone" v-mask="mask" :disabled="smsSuccess"></v-text-field>
    <div v-show="smsSuccess" @click="changePhoneNumber()">
        Изменить номер телефона
    </div>
    <div v-show="smsSuccess">
        <v-text-field class="sms-modal__field" label="Код из смс" outlined v-model="code" :error-messages='this.badCode == true ? this.errorMsg : null'></v-text-field>
        <div v-show="smsSuccess" @click="sendSmsAgain()">
            Отправить смс повторно
        </div>
    </div>
    <v-btn class="sms-modal__submit" id="send-sms-modal-btn" block color="primary" :disabled="phone.length < 17" :loading="loadingSendSms" @click="sendSms()" v-show="!smsSuccess">
        Получить код
    </v-btn>
    <v-btn class="sms-modal__submit" block color="primary" :disabled="code.length < 5" @click="auth()" :loading="checkCode" v-show="smsSuccess">
        Дальше
    </v-btn>
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
            phone: ' ',
            mask: ['+375', '(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, ],
            code: ' ',
            loadingSendSms: false,
            smsSuccess: false,
            checkCode: false,
            badCode: false,
            currentRouteName: null,
            errorMsg: '',
        }
    },
    methods: {
		changePhoneNumber(){
            console.log('changePhoneNumber -> changePhoneNumber')
			this.smsSuccess = false
		},
		sendSmsAgain(){
            console.log('sendSmsAgain -> sendSmsAgain')
			this.sendSms()
		},
        closeForm() {
            this.$emit('closeForm')
        },
        sendSms() {
            this.loadingSendSms = true
            ApiService.post('/user/send_sms', {
                phone: parseInt(this.phone.replace(/[^\d]/g, '')),
            }).then((response) => {
                this.loadingSendSms = false
                this.smsSuccess = true
                if (response.data.status == 'err') {
                    this.badCode = true
                    this.errorMsg = response.data.errors[0]
                }
            }).catch((error) => {
                console.error(error)
            })
        },
        auth() {
            this.checkCode = true
            ApiService.post('/user/auth', {
                phone: parseInt(this.phone.replace(/[^\d]/g, '')),
                code: parseInt(this.code),
            }).then((response) => {
                if (response.data.status == 'err') {
                    this.badCode = true
                    this.checkCode = false
                    this.errorMsg = response.data.error[0]
                } else {
                    this.goToCheckout()
                }
            }).catch((error) => {
                console.error(error)
            })
        },
        goToCheckout() {
            this.$store.dispatch('user/setUserPhoneNumber', parseInt(this.phone.replace(/[^\d]/g, '')));
            if (this.currentRouteName !== 'cart') {
                this.$router.push('/checkout')
                console.error('push to checkout');
            } else {
                console.error('need close');
                this.$emit('closeFormShowOrderForm')
            }
        },
    },
    watch: {
        phone(newValue, oldValue) {
            return newValue
        }
	},
	computed: {
		...mapGetters({
            getUserPhoneNumber: "user/getUserPhoneNumber",
        }),
	},
    mounted() {
		this.currentRouteName = this.$route.name
            console.log('mounted -> this.getUserPhoneNumber', this.getUserPhoneNumber)
		if (this.getUserPhoneNumber) {
			this.$router.push('/checkout')
		}
    },
}
</script>

<style>
.sms-modal #send-sms-modal-btn.sms-modal__send-sms.v-btn--disabled {
    background-color: #4ca647 !important;
}
</style><style lang="scss" scoped>
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
        position: absolute !important;
        top: 10px;
        right: 10px;
    }

    &__field {
        margin-bottom: 10px !important;
    }

    &__submit {
        text-transform: initial;
        font-size: 16px !important;
        font-weight: 600;
        height: 50px !important;
    }
}
</style>
