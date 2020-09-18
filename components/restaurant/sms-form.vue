<template>
<v-card class="sms-modal">
    <img class="sms-modal__logo" src="@/assets/logo.svg" alt="Logo">
    <v-card-title class="sms-modal__title">
        Для оформления заказа пожалуйста, укажите свой телефон
    </v-card-title>
    <v-icon class="sms-modal__close" @click="closeForm()" v-show="currentRouteName !== 'cart'">
        close
    </v-icon>
    <v-text-field class="sms-modal__field" label="Ваш номер телефона" outlined v-model="phone" v-mask="mask" :disabled="smsSuccess" @keydown.enter="auth()"></v-text-field>
    <div class="sms-modal__link" v-show="smsSuccess" @click="changePhoneNumber()">
        Изменить номер телефона
    </div>
    <div v-show="smsSuccess">
        <v-text-field class="sms-modal__field" label="Код из смс" outlined v-model="code" :error-messages='this.badCode == true ? this.errorMsg : null'  @keydown.enter="sendSms()"></v-text-field>
        <div class="sms-modal__link" v-show="smsSuccess" @click="sendSmsAgain()">
            Отправить смс повторно
        </div>
    </div>
    <v-btn ref='getCode' class="sms-modal__submit" id="send-sms-modal-btn" block color="primary" :disabled="phone.length < 17" :loading="loadingSendSms" @click="sendSms()" v-show="!smsSuccess">
        Получить код
    </v-btn>
    <v-btn class="sms-modal__submit" block color="primary" :disabled="code.length < 5" @click="auth()" :loading="checkCode" v-show="smsSuccess">
        Дальше
    </v-btn>
</v-card>
</template>

<script>
import ApiService from "~/common/api.service";
import SmsMixin from "./mixins/sms";
import {
    mapGetters
} from "vuex";
export default {
    mixins: [SmsMixin]
};
</script>

<style>
.sms-modal #send-sms-modal-btn.sms-modal__send-sms.v-btn--disabled {
    background-color: #4ca647 !important;
}

.sms-modal__field .v-input__slot {
    margin-bottom: 0;
}

.sms-modal__field .v-text-field__details {
    min-height: initial !important;
    margin-top: 4px !important;
    padding: 0 4px !important;
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

    &__field {}

    &__submit {
        text-transform: initial;
        font-size: 16px !important;
        font-weight: 600;
        height: 50px !important;
    }

    &__link {
        font-size: 13px;
        text-decoration: underline;
        cursor: pointer;
        margin-bottom: 30px;
        margin-left: 4px;
        width: fit-content;
        color: #646464;
    }

    @media screen and (max-width: 992px) {
        min-width: initial;
        max-width: initial;
        box-shadow: none;

        &__logo {
            display: none;
        }
    }
}
</style>
