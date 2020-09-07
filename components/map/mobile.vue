<template>
<v-overlay class="mobile-map-wrapper" :dark='false' :value="isMapVisible">
    <div v-show="this.getMapLoading" class="map-loading">
        <v-progress-circular indeterminate size="40" color="grey"></v-progress-circular>
    </div>
    <div v-show="!this.getMapLoading" class="map-search-wrapper">
        <div class="currentAddress" v-show="!isInputAddressMode">
            <h2 class="currentAddress-title">{{address.address}}</h2>
            <div class="currentAddress-put" @click="switchToAddressMode">Изменить адрес доставки</div>
        </div>
        <yandex-map v-show="!isInputAddressMode" :coords="coords" :zoom="17" @click.stop="onClick" @map-was-initialized="onInit" :controls="controls" :options="options" @boundschange="onBoundsChange" />
        <map-suggest v-show="isInputAddressMode" @select="onSelect" @selectedPlace='selectedPlace' />
    </div>
</v-overlay>
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
    getClose,
    getGeo,
    getIamHere,
    getPlace,
    getZoomIn,
    getZoomOut
} from './factory/mobile'
import MapSuggest from '@/components/map/suggest'
import {
    getAddresFromGeoobject,
    getAddressFromString,
    getAddresByCoords
} from '@/common/lib/map'
import {
    settings as yMapSettings
} from '@/plugins/ymapPlugin' // так сделал потому что из плагина переменная ymaps с первого открытия карты не доступна
import axios from 'axios'

export default {
    components: {
        MapSuggest
    },
    data: () => ({
        controls: [],
        options: {
            autoFitToVievport: true,
            suppressMapOpenBlock: true
        },
        address: '',
        coords: [53.902515, 27.561456],
        mapInstance: null,
        ymaps: null,
        getCityGeocoder: '',
        addressMass: null,
        addressBuffer: null,
        coordsBuffer: null,
    }),
    watch: {
        getMapLoading(newValue, oldValue) {
            return newValue
        }
    },
    computed: {
        ...mapGetters({
            isMapVisible: 'map/isMapVisible',
            getCurrentCoords: 'map/getCurrentCoords',
            getCurrentAddress: 'map/getCurrentAddress',
            isInputAddressMode: 'map/isInputAddressMode',
            geolocationAvailable: 'map/geolocationAvailable',
            getMapLoading: 'map/getMapLoading',
            getSelectedZone: 'zone/getSelectedZone',
            getZoneList: 'zone/getZoneList',
        }),
        currentAddress() {
            return this.getCurrentAddress
        }
    },
    async beforeMount() {
        await loadYmap({
            ...yMapSettings
        });
    },
    async mounted() {
        if (performance.navigation.type == 1) {
            this.hideMap()
        }
    },
    methods: {
        ...mapMutations({
            hideMap: 'map/HIDE_MAP',
            setCurrentCoords: 'map/SET_CURRENT_COORDS',
            switchToMapMode: 'map/UNSET_INPUT_ADDRESS_MODE',
            switchToAddressMode: 'map/SET_INPUT_ADDRESS_MODE',
            loadf: 'map/LOADF',
        }),
        ...mapActions({
            getLocation: 'map/getLocation',
            getGeoObjects: 'map/getGeoObjects'
        }),
        async onInit(mapInstance) {
            if (this.getCurrentAddress !== '') {
                this.address = this.getCurrentAddress
            }
            if (this.getCurrentCoords.length !== 0) {
                this.coords = this.getCurrentCoords
            }
            this.mapInstance = mapInstance
            getClose(ymaps, mapInstance, async () => {
                setTimeout(() => {
                    this.hideMap();
                }, 100);
            })
            getZoomIn(ymaps, mapInstance)
            getZoomOut(ymaps, mapInstance)
            getPlace(ymaps, mapInstance)
            getGeo(ymaps, mapInstance)

            let getZoneList = this.getZoneList
            let getSelectedZone = this.getSelectedZone
            let router = this.$router
            getIamHere(ymaps, mapInstance, async (e) => {
                const coords = mapInstance.getCenter()
                await this.getGeoObjects({
                    ymaps,
                    coords,
                    getZoneList,
                    getSelectedZone,
                    router
                }, {
                    root: true
				})
                await this.hideMap()
            })
            if (this.getCurrentCoords.length === 0) {
                await this.getLocation()
            }
            this.coords = this.getCurrentCoords
            await this.loadf()
            console.error('onInit -> this.coords', this.coords)
        },
        onClick(e) {
            this.coords = e.get('coords')
            this.setCurrentCoords(this.coords)
        },
        async selectedPlace(address) {
            const app = this
            this.address = address.value
            await ymaps.geocode(address.value, {
                results: 1,
                boundedBy: [
                    [51.753588, 23.148098],
                    [55.591263, 31.491889]
				],
				strictBounds: true,
            }).then((geo) => {
                const geoObjects = geo.geoObjects.get(0)
                app.getCityGeocoder = geoObjects.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName')
                app.addressMass = geoObjects.properties.get('metaDataProperty.GeocoderMetaData.Address.Components')
                app.coordsBuffer = geoObjects.geometry.getCoordinates()
                app.addressBuffer = address.value
                app.coords = geoObjects.geometry.getCoordinates()
                app.mapInstance.setCenter(geoObjects.geometry.getCoordinates(), 17)
            });
            let cityId = await axios.post('https://yestapi.xyz/check_delivery_address', this.addressMass).then(res => {
                return res.data.city_id
            })

            if (this.getSelectedZone.id !== cityId) {
                let findCity = this.getZoneList.find((zone) => {
                    return zone.id == cityId
                })
                if (findCity !== undefined) {
                    this.$router.push(`/${findCity.alias}`)
                } else {
                    this.$router.push(`/`)
                }
            } else {
                this.setCurrentCoords(this.coordsBuffer)
                this.setCurrentAddress(this.addressBuffer)
            }
        },
        async onSelect(e) {
            const mapInstance = this.mapInstance
            const ymaps = this.ymaps
            const app = this
            if (mapInstance !== null) {
                const selectedValue = e.get('item').value
                await ymaps.geocode(selectedValue, {
                        results: 1
                    })
                    .then((geo) => {
                        const geoObjects = geo.geoObjects.get(0)
                        app.getCityGeocoder = geoObjects.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName')
                        app.addressMass = geoObjects.properties.get('metaDataProperty.GeocoderMetaData.Address.Components')
                        app.coordsBuffer = geoObjects.geometry.getCoordinates()
                        app.addressBuffer = address.value
                        app.coords = geoObjects.geometry.getCoordinates()
                        app.mapInstance.setCenter(geoObjects.geometry.getCoordinates(), 17)
                        app.address = getAddresFromGeoobject(geoObjects)

                        if (app.geolocationAvailable) {
                            app.address = getAddressFromString(selectedValue)
                            mapInstance.setCenter(app.coords, 17)
                            this.switchToMapMode()
                            return
                        }
                        const bounds = geoObjects.properties.get('boundenBy')
                        mapInstance.setBounds(bounds, {
                            checkZoomRange: true
                        })
                        mapInstance.setCenter()
                    });
                let cityId = await axios.post('https://yestapi.xyz/check_delivery_address', this.addressMass).then(res => {
                    return res.data.city_id
                })

                if (this.getSelectedZone.id !== cityId) {
                    let findCity = this.getZoneList.find((zone) => {
                        return zone.id == cityId
                    })
                    if (findCity !== undefined) {
                        this.$router.push(`/${findCity.alias}`)
                    } else {
                        this.$router.push(`/`)
                    }
                } else {
                    this.setCurrentCoords(this.coordsBuffer)
                    this.setCurrentAddress(this.addressBuffer)
                    this.address = this.addressBuffer
                }
            }
        },
        async onBoundsChange() {
            const coords = this.mapInstance.getCenter()
            this.address = await getAddresByCoords(ymaps, coords, this.getZoneList, this.getSelectedZone, this.$router)
        }
    },
};
</script>

<style lang="scss">
$size: 7vw;
$header: 65px;

[class*=copyrights-pane] {
    z-index: 3000;
}

.map-search-wrapper {
    height: 100% !important;
    overflow: hidden !important;
    -webkit-overflow-scrolling: touch !important;
    padding-bottom: calc(0px + var(--safe-area-inset-bottom, 0px));
}

.mobile-map-wrapper .v-overlay__content {
    height: 100%;
    overflow: hidden;
}

.mobile-map-wrapper {
    height: 100% !important;
    overflow: hidden;
}

.mobile-map-wrapper .ymap-container {
    height: 100% !important;
}

ymaps {
    color: black
}

.customGeoBtn {
    height: 40px !important;
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
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.map-loading {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('../../assets/mapBg.svg');
    background-size: cover;
}

.ymap-container {
    width: 100vw !important;
    height: calc(var(--vh, 1vh) * 100) !important;
}

ymaps .customMapBtn {
    text-align: center;
}

ymaps .customMapBtn.place {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1vw;
}

ymaps .customMapBtn,
ymaps .customMapBtn i.material-icons {
    font-size: 7vw;
    line-height: 7vw;
    display: flex;
    justify-content: center;
    align-items: center;
}

ymaps .customMapBtn.place i {
    font-size: 40px;
}

ymaps .customMapBtn .close {
    box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.15) !important;
}

ymaps .customMapBtn {
    width: 8vw;
    height: 8vw;
}

ymaps .customMapBtn.plus,
ymaps .customMapBtn.minus {
    box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.15) !important;
}

ymaps .customMapBtn.plus {
    margin-top: -38px;
    border-bottom: 1px solid #ddd !important;
}

ymaps .customMapBtn.minus {
    border-top: 1px solid #ddd !important;
}

ymaps .customMapBtn.plus i,
ymaps .customMapBtn.minus i {
    font-size: 20px !important;
}

ymaps .customMapBtn.iamhere {
    border-radius: 16px !important;
    height: 36px !important;
    width: 100%;
    color: #fff !important;
    z-index: 4000;
}

ymaps [title="Определить ваше местоположение"] {
    border-radius: 50%;
}

.customMapBtn {
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
}

.iamhere {
    background-color: #00a646;
    width: 85vw;
    border-radius: 5px;
    font-size: 16px !important;
    padding: 10px 0;
    margin: auto;
}

.currentAddress {
    width: 100%;
    top: 14%;
    text-align: center;
    position: absolute;
    z-index: 4500;
}

h2.currentAddress-title {
    color: #000;
    width: 100%;
    font-size: 30px;
    margin-bottom: 16px;
    text-align: center;
    padding-left: 16px;
    padding-right: 16px;
    font-weight: normal;
}

.currentAddress-put {
    color: #000;
    height: 24px;
    width: 55%;
    margin: auto;
    font-size: 14px;
    line-height: 24px;
    box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.15);
    border-radius: 14px;
    pointer-events: auto;
    background-color: rgba(255, 255, 255, 0.8);
}
</style><style scoped>
.v-overlay__content {
    width: 100vw;
    height: 100vh;
    background: #fff;
}
</style>
