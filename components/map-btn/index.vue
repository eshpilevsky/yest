<template>
  <v-btn class="black--text set-you-adress" height="40" color="primary" dense rounded depressed @click="showMap">
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

<style>
  .set-you-adress {

    position: relative;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
    width: 80%;
    display: flex;
    text-transform: none !important;
    color: #fff !important;
    padding: 0px 50px !important;
    font-size: 14px !important;
    text-overflow: clip;
    overflow: hidden;
    box-shadow: 0 4px 12px 0 rgba(0, 166, 70, 0.3), 0 2px 4px 0 rgba(0, 166, 70, 0.3)!important;
  }
</style>
