<template>
<div class="manual-enter-address">
    <div class="search-address">
        <input class="address-input" v-model="searchString" placeholder="Укажите адрес доставки..." />
        <div class="black--text cancel" @click="onCancel">Отменить</div>
    </div>
    <div class="palces-list" v-show="!loading">
        <div class="places-item" v-for="(item, index) in places" :key="`place${index}`" @click="selectPlace(item)">
            <div class="item-title">
                {{item.displayName}}
            </div>
            <div class="item-description">
                {{item.value}}
            </div>
            <v-divider />
        </div>
    </div>
    <div v-show="loading" class="suggets-loading">
        <v-progress-circular indeterminate size="40" color="grey"></v-progress-circular>
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
        searchString: '',
        ymaps: null,
        loading: false,
        places: []
    }),
    async mounted() {
        await loadYmap({
            ...settings,
            debug: true
		});
    },
    watch: {
        searchString(newValue, oldValue) {
            this.suggestPlaces(newValue)
        },
        places(newValue) {
            return newValue
        }
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
        selectPlace(item) {
            this.$emit('selectedPlace', item)
            this.switchToMapMode()
        },
        suggestPlaces(str) {
            this.loading = true
            const component = this
            ymaps.suggest(str, {
				results: 6,
				boundedBy:[[51.753588, 23.148098], [55.591263, 31.491889]]
            }).then((items) => {
                component.places = items
                component.loading = false
            });
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

<style scoped>
.suggets-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
}

.places-item {
    max-width: 100%;
    margin-left: 16px;
    padding-top: 9px;
    padding-left: 4px;
    padding-right: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, .05);
    padding-bottom: 13px;
}

.item-description {
    color: #b0b0b0;
    font-size: 14px;
}

.item-title {
    color: #000000;
    font-size: 16px;
}

.palces {
    width: 100%;
    height: 100%;
    background: red;
}
</style><style lang="scss">
input:focus {
    outline: none;
}

.address-input {
    font-size: 14px;
    padding: 10px;
    width: 100%;
    color: #000;
}

.manual-enter-address {
    height: calc(var(--vh, 1vh) * 100);
    width: 100vw;
    background-color: white;
    padding: 5px 0;
}

.theme--dark.v-input {
    display: flex;
    justify-content: center;
    align-items: baseline;
}

.cancel {
    font-size: 14px;
    margin: 5px;
    padding: 5px;
    border-left: 1px solid rgba(0, 0, 0, .1);
}

.theme--dark.v-input input,
.theme--dark.v-input textarea,
.v-text-field__slot,
.v-label {
    color: black !important;
}

.theme--dark.v-text-field--solo>.v-input__control>.v-input__slot {
    background: none !important;
}

ymaps[class*=suggestPlaces-item_selected_yes] {
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
