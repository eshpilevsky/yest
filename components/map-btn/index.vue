<template>
  <v-btn class="black--text" color="primary" dense rounded depressed @click="showMap">
    <i class="material-icons near_me_icon">near_me</i>{{this.text}}
  </v-btn>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  const putAddress = 'Укажите адрес'
  export default {
    name: 'map-btn',
    data () {
      return {
      }
    },
    methods: {
      ...mapMutations('map', {showMap: 'SHOW_MAP'}),
    },
    computed: {
      ...mapGetters('map', { getCurrentAddress: 'getCurrentAddress' }),
      text() {
        const currentAddress = this.getCurrentAddress
        if (currentAddress === '') {
          return putAddress
        }
        console.log('wwwwww', currentAddress)
        return `...${currentAddress.substr(-20, 21)}`
      }
    }
  }
</script>
