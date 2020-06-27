<template>
  <v-container class="text-center" fill-height style="height: calc(100vh - 210px);">
    <v-row align="center">
      <v-col>
        <h1 class="display-2 secondary--text">
          Упс, 404
        </h1>
        <p>Страница не найдна</p>
        <v-btn :to="`/${getSelectedZone.alias}`" color="primary" outlined>
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

</style>
