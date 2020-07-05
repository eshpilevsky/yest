<template>
<div class="manual-enter-address">
	<div class="address-input">
		<v-text-field v-model="searchString" solo label="Укажите адрес доставки..." clearable dense >
			<template v-slot:append-outer>
				<div class="black--text cancel" @click="onCancel">Отменить</div>
			</template>
		</v-text-field>
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
            this.switchToMapMode()
        }
    }
}
</script>


<style lang="scss" >

.manual-enter-address{
	height: calc(var(--vh, 1vh) * 100);
    width: 100vw;
    background-color: white;
    padding: 5px;
}

.theme--dark.v-input{
	display: flex;
    justify-content: center;
    align-items: baseline;
}

.cancel{
	padding-right: 10px;
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

.address-input {
    width: 100%;
    margin: auto;
}
</style>
