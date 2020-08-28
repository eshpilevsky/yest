<template>
<div class="sms-form">
    <div :class="{active:current}" class="sms-form__first">
        <p class="sms-form__title">Введите номер телефона </p>
        <div class="sms-form__container">
            <v-text-field class="sms-form__field" label="Ваш номер телефона" outlined v-model="phone" v-mask="mask" @keydown.enter="showCurrnet()"></v-text-field>
            <v-btn class="sms-form__submit" block color="primary" :disabled="phone.length <17" @click="showCurrnet()" >Далее</v-btn>
        </div>
        <p class="sms-form__terms">Нажимая кнопку «Далее», Вы принимаете условия
		 	<nuxt-link to='/' target="_blank" class="link"> пользовательского соглашения </nuxt-link>
		</p>
    </div>
    <div :class="{active:!current}" class="sms-form__second">
        <p class="sms-form__title">Подтверждение</p>
        <p class="sms-form__description">Код подтверждения был отправлен <br> на номер {{this.phone}}</p>
        <div class="sms-form__container">
            <v-text-field class="sms-form__field" label="Код из смс" outlined v-model="code"></v-text-field>
            <v-btn class="sms-form__submit" block color="primary" :disabled="code.length <4" @click="auth()" @keydown.enter="auth()">Готово</v-btn>
        </div>
		<div v-show="this.errorMsg.length > 0" class="sms-form__error">
			{{this.errorMsg}}
		</div>
		<div v-show="this.errorMsg.length == 0">
			<div class="sms-form__send-sms" v-show="timer > 0">Отправить код повторно <span class="time">0:{{this.timer}}</span></div>
			<v-btn @click="sendSms()" v-show="timer == 0">Отправить код повторно</v-btn>
		</div>
    </div>
</div>
</template>

<script>
  import ApiService from "~/common/api.service";
  import SmsMixin from "./mixins/sms";
  import {
    mapGetters
  } from "vuex";
export default {
	mixins:[SmsMixin],
}
</script>

<style scoped lang="scss">
  .sms-form {
    width: 100%;
    overflow: hidden;
    padding-top: 40px;
    display: flex;

    &__first {
      transform: translateX(-100%);
      transition: 0.3s;
      min-width: 100%;
      padding: 0 20px;

      &.active {
        transform: translateX(0);
      }
    }

    &__second {
      transform: translateX(100%);
      transition: 0.3s;
      min-width: 100%;
      padding: 0 20px;

      &.active {
        transform: translateX(-100%);
      }
    }

    &__title {
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 12px !important;
    }

    &__error {
      font-size: 16px;
      font-weight: 600;
      text-align: center;
	  color: red;
    }

    &__container {
      max-width: 360px;
      width: 100%;
      margin: 0 auto;
    }

    &__field {
      width: 100% !important;
      margin-top: 30px !important;
    }

    &__submit {
      border-radius: 0 0 16px 16px !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      height: 53px !important;
      text-transform: initial !important;
      margin-bottom: 10px !important;
    }

    &__terms {
      text-align: center;
      color: #b0b0b0;
      font-size: 12px;
      margin-top: 12px;
      line-height: 1.4;

      .link {
        color: #b0b0b0;
        text-decoration: underline;
      }
    }

    &__description {
      text-align: center;
      font-size: 14px;
      line-height: 1.4;
      margin: 12px auto 0;
    }

    &__send-sms {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #b0b0b0;

      &.active {
        color: #064d9a;

        .time {
          display: none;
        }
      }
    }
  }
</style>

<style>
  .sms-form__field .v-text-field__details,
  .sms-form__field .v-label{
    display: none !important;
  }

  .sms-form__field .v-input__slot {
    border: 1px solid #ddd !important;
    border-bottom: none !important;
    border-radius: 16px 16px 0 0 !important;
    margin-bottom: 0 !important;
    height: 53px !important;
    max-height: 53px !important;
    min-height: 53px !important !important;
  }
</style>
