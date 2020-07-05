<template>
<div class="manual-enter-address">
	<div class="search-address">
		<input class="address-input" v-model="searchString" placeholder="Укажите адрес доставки..." />
		<div class="black--text cancel" @click="onCancel">Отменить</div>
	</div>
</div>
</template>

<script>
import {
    mapActions,
    mapGetters,
    mapMutations
} from 'vuex'
import {
    loadYmap
} from 'vue-yandex-maps';
import {
    settings
} from '@/plugins/ymapPlugin'

export default {
    data: () => ({
        searchString: ''
    }),
    async mounted() {
        await loadYmap(settings);
        this.addSuggestView(ymaps)
    },
    methods: {
        ...mapMutations('map', {
            hideMap: 'HIDE_MAP',
            switchToMapMode: 'UNSET_INPUT_ADDRESS_MODE'
        }),
        ...mapGetters('map', {
            getCurrentCoords: 'getCurrentCoords',
            getCurrentAddress: 'getCurrentAddress'
        }),
        addSuggestView(ymaps) {
            var suggestView = new ymaps.SuggestView(this.$el.querySelector('input'))
            suggestView.events.add('select', (e) => {
                this.$emit('select', e)
            })
        },
        appendIconCallback(e) {
            this.searchString = ''
        },
        onCancel() {
			this.searchString = ''
            this.switchToMapMode()
        }
    }
}
</script>


<style lang="scss" >

input:focus{
    outline: none;
}

.address-input{
	font-size: 14px;
	padding: 10px;
	width: 100%;
	color: #000;
}
.manual-enter-address{
	height: calc(var(--vh, 1vh) * 100);
    width: 100vw;
    background-color: white;
    padding: 5px 0;
}

.theme--dark.v-input{
	display: flex;
    justify-content: center;
    align-items: baseline;
}

.cancel{
	font-size: 14px;
	margin: 5px;
	padding: 5px;
	border-left: 1px solid rgba(0, 0, 0, .1);
}

.theme--dark.v-input input, .theme--dark.v-input textarea,
.v-text-field__slot,
.v-label{
	color: black !important;
}
.theme--dark.v-text-field--solo > .v-input__control > .v-input__slot {
    background: none !important;
}

ymaps[class*=suggest-item_selected_yes] {
    background-color: #00A646;
}

.black {
    // color: black !important;
}

.search-address {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
    width: 100%;
    margin: auto;
	border-bottom: 1px solid rgba(0, 0, 0, .1);
}
</style>
