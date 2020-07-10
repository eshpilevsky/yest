<template>
<v-overlay :value="isMapVisible">
    <div v-if="this.getMapLoading" class="map-loading">
        <v-progress-circular indeterminate size="40" color="grey"></v-progress-circular>
		{{this.getMapLoading}}
    </div>
    <div v-else>
        <div class="currentAddress" v-show="!isInputAddressMode">
            <h2 class="currentAddress-title">{{address}}</h2>
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
        controls: [],
        options: {
            autoFitToVievport: true,
            suppressMapOpenBlock: true
        },
        address: '',
        coords: [53.902515, 27.561456],
        mapInstance: null,
        ymaps: null,
	}),
	watch: {
		getMapLoading(newValue, oldValue) {
			return newValue
		}
	},
    computed: {
        ...mapGetters('map', {
            isMapVisible: 'isMapVisible',
            getCurrentCoords: 'getCurrentCoords',
            getCurrentAddress: 'getCurrentAddress',
            isInputAddressMode: 'isInputAddressMode',
            geolocationAvailable: 'geolocationAvailable',
            getMapLoading: 'getMapLoading',
        }),
        currentAddress() {
            return this.getCurrentAddress
        }
	},
	async beforeMount(){
        await loadYmap({
            ...yMapSettings
		});
        console.log('mounted -> ymaps', ymaps)
		this.ymaps = ymaps
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
        }),
        ...mapActions('map', {
            getLocation: 'getLocation',
            getGeoObjects: 'getGeoObjects'
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
            getIamHere(ymaps, mapInstance, async (e) => {
                const coords = mapInstance.getCenter()
                await this.getGeoObjects({
                    coords,
                    ymaps
                })
                await this.hideMap()
            })
            if (this.getCurrentCoords.length === 0) {
                await this.getLocation()
            }
            this.coords = this.getCurrentCoords
            console.error('onInit -> this.coords', this.coords)
        },
        onClick(e) {
            this.coords = e.get('coords')
            this.setCurrentCoords(this.coords)
        },
        selectedPlace(place) {
            const component = this
            this.ymaps.geocode(place.value, {
                results: 1,
                boundedBy: [
                    [51.753588, 23.148098],
                    [55.591263, 31.491889]
                ]
            }).then((geo) => {
                const geoObjects = geo.geoObjects.get(0)
                component.coords = geoObjects.geometry.getCoordinates()
            });
        },
        onSelect(e) {
            const mapInstance = this.mapInstance
            const ymaps = this.ymaps
            const component = this
            if (mapInstance !== null) {
                const selectedValue = e.get('item').value
                ymaps.geocode(selectedValue, {
                        results: 1,
                        boundedBy: [
                            [51.753588, 23.148098],
                            [55.591263, 31.491889]
                        ]
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
        }
    },
};
</script>

<style lang="scss">
$size: 7vw;
$header: 65px;

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

ymaps .customMapBtn,
ymaps .customMapBtn i.material-icons {
    font-size: 7vw;
    line-height: 7vw;
	display: flex;
	justify-content: center;
	align-items: center;
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
    top: 20vh;
    text-align: center;
    position: absolute;
    z-index: 4500;
}

h2.currentAddress-title {
    color: #000;
    width: 100%;
    font-size: 30px;
    margin-bottom: 20px;
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
