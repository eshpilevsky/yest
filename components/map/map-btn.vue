<template>
<v-btn class="set-you-address" height="40" width="245" color="primary" dense rounded depressed @click="showMap">
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

.address{
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    direction: rtl;
    text-align: left;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    left: 26px;
}

.set-you-address {
    position: relative !important;
    top: 50%;
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

.set-you-address .near_me_icon {
    margin-right: 6px;
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
}
</style>
