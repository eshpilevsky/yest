<template>
<v-btn class="set-you-address" :class="{active : this.getCurrentAddress.length > 0, ad50:isHeader}" height="40" width="245" color="primary" dense rounded depressed @click="showMap">
    <i class="material-icons near_me_icon">near_me</i>
    <span class="address">
        {{this.text}}
    </span>
</v-btn>
</template>

<script>
import {
    mapGetters,
    mapMutations
} from 'vuex'
export default {
	name: 'map-btn',
	props: {
		isHeader: Boolean,
	},
    data() {
        return {
			putAddress: 'Укажите адрес'
		}
    },
    methods: {
        ...mapMutations('map', {
            showMap: 'SHOW_MAP'
        }),
    },
    computed: {
        ...mapGetters({
            getCurrentAddress: 'map/getCurrentAddress'
        }),
        text() {
            const currentAddress = this.getCurrentAddress
            if (currentAddress === '') {
                return this.putAddress
            }
            return `${currentAddress}`
        }
    }
}
</script>

<style>

.ad50{
	top: 50%;
}

.set-you-address {
    position: relative !important;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    display: flex;
    text-transform: none !important;
    color: #fff !important;
    font-size: 14px !important;
    text-overflow: clip;
    overflow: hidden;
}

.set-you-address.active .near_me_icon {
  display: none;
}

.set-you-address.active .address {
  left: 4px;
}

.address{
  max-width: 220px;
  text-overflow: ellipsis;
  overflow: hidden;
  direction: rtl;
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  left: 20px;
}

.set-you-address .near_me_icon {
    margin-right: 6px;
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 30px;
    transform: translateY(-50%);
}
</style>
