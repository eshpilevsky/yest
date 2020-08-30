<template>
  <v-container class="text-center notFound" fill-height style="height: calc(100vh - 210px);">
    <v-row align="center">
      <v-col>
        <h1 class="notFound__title display-2 primary--text">
          Упс, 404
        </h1>
        <p class="notFound__descr">Страница не найдна</p>
        <v-btn class="notFound__btn" to="/" color="primary" outlined>
          Вернуться на главную
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'NotFound',
    computed: {
      ...mapGetters({
        getSelectedZone: 'zone/getSelectedZone'
      })
    }
  }
</script>

<style lang="scss" scoped>
  .notFound {
    padding-top: 0 !important;

    &__title {
      margin-bottom: 10px;
    }

    &__descr {
      margin-bottom: 14px !important;
    }

    &__btn {
      font-size: 16px !important;
      letter-spacing: 0.1px;
      text-transform: initial !important;
    }
  }
</style>
