<template>
<div class="sms-form">
    <div :class="{active:current}" class="sms-form__first">
        <v-text-field class="sms-modal__field" label="Ваш номер телефона" outlined v-model="phone" v-mask="mask" ></v-text-field>
        <v-btn class="sms-modal__submit" block color="primary" @click="showCurrnet()">
            Получить код
        </v-btn>
    </div>
    <div :class="{active:!current}" class="sms-form__second">
        <v-text-field class="sms-modal__field" label="Код из смс" outlined v-model="code"></v-text-field>
        <v-btn class="sms-modal__submit" block color="primary"  @click="showCurrnet()">
            Готово
        </v-btn>
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

      &.active {
        transform: translateX(0);
      }
    }

    &__second {
      transform: translateX(100%);
      transition: 0.3s;

      &.active {
        transform: translateX(0);
      }
    }
  }
</style>
