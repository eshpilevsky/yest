<template>
<v-btn class="black--text set-you-adress" height="40" width="245" color="primary" dense rounded depressed @click="showMap">
    <i class="material-icons near_me_icon">near_me</i>
	<span class="adress">
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

.adress{
	max-width: 200px;
	text-overflow: clip;
    overflow: hidden;
}

.set-you-adress {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    display: flex;
    text-transform: none !important;
    color: #fff !important;
    padding: 0px 50px !important;
    font-size: 14px !important;
    text-overflow: clip;
    overflow: hidden;
    box-shadow: 0 4px 12px 0 rgba(0, 166, 70, 0.3), 0 2px 4px 0 rgba(0, 166, 70, 0.3) !important;
}
</style>
