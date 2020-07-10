<template>
<div>
    <div class="desktop-map">
        <div class="desktop-map-top">
            <div class="desktop-map-title">
                Укажите адрес доставки
            </div>
            <div class="close-icon">
                <v-icon @click="emitClose()" color="black">close</v-icon>
            </div>
        </div>
        <div class="map-actions">
            <div class="map-actions-top">
                <v-btn height='40' outlined dense small shaped color='primary' @click="getMyGeo()" class="near_me-btn">
                    <v-icon>near_me</v-icon>
                    Определить
                </v-btn>
                <v-text-field @focus="focusInput" @blur="blurInput()" height='40' dense placeholder="Укажите адрес доставки..." v-model="address" dark filled outlined clearable background-color="primary" class="address-input btnFz"></v-text-field>
                <v-btn height='40' color="primary" class="ml-2" @click="confirmPosition()">
                    Ok
                </v-btn>
            </div>
            <div v-if="showSuggestList" class="map-actions-bottom">
                <v-list class="sugList">
                    <v-list-item v-for="(item, index) in suggestList" :key="'sug'+index" class="itemAdress" @click="selectAdress(item)">
                        <v-list-item-content>
                            <v-list-item-title>{{item.value}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </div>
        </div>
        <div v-if="isMapLoading" class="map-loading-desktop">
            <v-progress-circular indeterminate size="40" color="grey"></v-progress-circular>
        </div>
        <div v-else>
            <yandex-map :coords="coords" :zoom="17" @click.stop="onClick" @map-was-initialized="onInit" :controls="controls" :options="options" @boundschange="onBoundsChange" />
        </div>
    </div>

</div>
</template>

<script>
import {
    loadYmap
} from 'vue-yandex-maps'
import {
    mapActions,
    mapGetters,
    mapMutations
} from 'vuex'
import {
    getGeo,
    getPlace,
} from './factory'
import MapSuggest from '@/components/map-suggest'
import {
    getAddresFromGeoobject,
    getAddressFromString,
    getAddresByCoords
} from '@/common/lib/map'
import {
    settings as yMapSettings
} from '@/plugins/ymapPlugin' // так сделал потому что из плагина переменная ymaps с первого открытия карты не доступна

export default {
    components: {
        MapSuggest
    },
    data: () => ({
        controls: ['zoomControl'],
        options: {
            autoFitToVievport: true,
            suppressMapOpenBlock: true
        },
        address: '',
        coords: [53.902474, 27.561461],
        // coords: [],
        suggestList: [],
        mapInstance: null,
        isMapLoading: true,
        ymaps: null,
        showSuggestList: false,
    }),
    computed: {
        ...mapGetters('map', {
            isMapVisible: 'isMapVisible',
            getCurrentCoords: 'getCurrentCoords',
            getCurrentAddress: 'getCurrentAddress',
            isInputAddressMode: 'isInputAddressMode',
            geolocationAvailable: 'geolocationAvailable'
        }),
    },
    watch: {
        address(newValue, oldValue) {
            if (newValue.length > 3) {
				this.suggestPlaces(newValue)		            
			}
        },
        coords(newValue) {
            return newValue
        }
    },
    methods: {
        ...mapMutations({
            hideMap: 'map/HIDE_MAP',
            setCurrentCoords: 'map/SET_CURRENT_COORDS',
            setCurrentAddress: 'map/SET_CURRENT_ADDRESS',
            switchToMapMode: 'map/UNSET_INPUT_ADDRESS_MODE',
            switchToAddressMode: 'map/SET_INPUT_ADDRESS_MODE',
        }),
        ...mapActions('map', {
            getLocation: 'getLocation',
            getGeoObjects: 'getGeoObjects'
		}),
		focusInput(){
			this.showSuggestList = true
		},
		blurInput(){
			this.showSuggestList = false
		},
        async selectAdress(address) {
            this.showSuggestList = false
			const component = this
			await this.setCurrentAddress(address.value)
            ymaps.geocode(address, {
                results: 1,
                boundedBy: [
                    [51.753588, 23.148098],
                    [55.591263, 31.491889]
                ]
            }).then((geo) => {
                const geoObjects = geo.geoObjects.get(0)
                component.coords = geoObjects.geometry.getCoordinates()
                component.setCurrentCoords(geoObjects.geometry.getCoordinates())
            });

        },
        suggestPlaces(str) {
            const component = this
            ymaps.suggest(str, {
                results: 6,
                boundedBy: [
                    [51.753588, 23.148098],
                    [55.591263, 31.491889]
                ]
            }).then((items) => {
                component.suggestList = items
            });
        },
        getMyGeo() {
            const myGeoBtn = document.getElementById('myGeoBtn')
            myGeoBtn.click()
        },
        emitClose() {
            this.$emit('closeMap')
        },
        async confirmPosition() {
            // const coords = this.mapInstance.getCenter()
            // await this.getGeoObjects({
            //     coords,
            //     ymaps
            // })
            await this.setCurrentCoords(this.coords)
            await this.setCurrentAddress(this.address)
            this.$emit('closeMap')
        },
        async onInit(mapInstance) {
            if (this.getCurrentAddress !== '') {
                this.address = this.getCurrentAddress
            }
            if (this.getCurrentCoords.length !== 0) {
                this.coords = this.getCurrentCoords
            }
            this.mapInstance = mapInstance
            getPlace(ymaps, mapInstance)
            getGeo(ymaps, mapInstance)

            if (this.getCurrentCoords.length === 0) {
                await this.getLocation()
            }
            this.coords = this.getCurrentCoords
        },
        onClick(e) {
            this.coords = e.get('coords')
            this.setCurrentCoords(this.coords)
        },
        onSelect(e) {
            const mapInstance = this.mapInstance
            const ymaps = this.ymaps
            const component = this
            if (mapInstance !== null) {
                const selectedValue = e.get('item').value
                ymaps.geocode(selectedValue, {
                        results: 1
                    })
                    .then((res) => {
                        const geoObjects = res.geoObjects.get(0)
                        component.coords = geoObjects.geometry.getCoordinates()
                        if (component.geolocationAvailable) {
                            component.address = getAddressFromString(selectedValue)
                            mapInstance.setCenter(component.coords, 17)
                            this.switchToMapMode()
                            return
                        }
                        const bounds = geoObjects.properties.get('boundenBy')
                        mapInstance.setBounds(bounds, {
                            checkZoomRange: true
                        })
                        mapInstance.setCenter()
                        component.address = getAddresFromGeoobject(res.geoObjects.get(0))
                    })
            }
        },
        async onBoundsChange() {
            const coords = this.mapInstance.getCenter()
            this.address = await getAddresByCoords(this.ymaps, coords)
            await this.$emit('selectAddress', this.address)
        }
    },
    beforeMount() {

        if (this.getCurrentAddress.length > 0) {
            this.address = this.getCurrentAddress
        }
            console.log('beforeMount -> this.getCurrentCoords', this.getCurrentCoords)
        if (this.getCurrentCoords.length > 0) {
            this.coords = this.getCurrentCoords
            console.log('mounted -> this.coords', this.coords)
        }
    },
    async mounted() {

        if (performance.navigation.type == 1) {
            this.hideMap()
        }
        this.isMapLoading = true
        await loadYmap({
            ...yMapSettings
        });

        this.isMapLoading = false
		this.mapInstance.setCenter(this.coords, 17)
		this.showSuggestList = false
    },
};
</script>

<style>
.map-actions-top {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
}

.map-actions-bottom {
    margin-left: 150px;
    margin-right: 0px;
    position: relative;
    bottom: 26px;
    z-index: 9;
}

.near_me-btn {
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
}

.btnFz {
    font-size: 19px;
}

.address-input {
    font-weight: bold;
    border-top-left-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
}

.close-icon {
    position: relative;
    left: 2rem;
    bottom: 2.5rem;
    opacity: .5;
}

.map {
    height: 100%;
    width: 100%;
}

.desktop-map-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.map-actions {}

.map-actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    max-height: 55px;
}

.desktop-map-title {
    margin: 0;
    font-size: 30px;
    line-height: 1.2;
    font-weight: 400;
    color: black;
    height: 45px;
}

.desktop-map {
    min-width: 800px;
    font-size: 16px;
    background: white;
    min-height: 600px;
    border-radius: 10px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style><style lang="scss">
$size: 40px;
$header: 65px;

.customGeoBtn {
    height: 40px;
    width: 40px;
    border: none;
    display: inline-block;
    box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.15);
    background-size: 24px;
    background-color: rgba(255, 255, 255, 0.8);
    background-repeat: no-repeat;
    background-position: center;
}

.myGeo {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iIzQ0M0MwRiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjYiIGQ9Ik01LjAwMiAxMC44OEwxOCA2bC00Ljg3MiAxMy0xLjYyOC02LjV6Ii8+PC9zdmc+);
    border-radius: 100%;
    margin: .5rem;
}

.map-loading-desktop {
    max-width: 720px;
    max-height: 400px;
    width: 100vh;
    height: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('../../assets/mapBg.svg');
    background-size: cover;
}

.desktop-map div section.ymap-container {
    max-width: 720px;
    max-height: 400px;
}

ymaps .customMapBtnDesktop {
    text-align: center;
}

ymaps .customMapBtnDesktop,
ymaps .customMapBtnDesktop i.material-icons {
    font-size: $size;
    line-height: $size;
}

ymaps [title="Определить ваше местоположение"] {
    border-radius: 50%;
}

.customMapBtnDesktop {
    padding: 1vw;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    width: $size;
    height: $size;
    -webkit-box-shadow: 0px 2px 5px 0px rgba(50, 50, 50, 0.5);
    -moz-box-shadow: 0px 2px 5px 0px rgba(50, 50, 50, 0.5);
    box-shadow: 0px 2px 5px 0px rgba(50, 50, 50, 0.5);
}

.close {
    position: relative;
    z-index: 400;
    top: .5rem;
    left: .5rem;
}

.plus {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.minus {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.place {
    background-color: transparent;
    box-shadow: none;
    font-size: 20px !important;
}
</style>
