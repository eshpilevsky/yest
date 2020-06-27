<template>
  <v-overlay :value="isMapVisible === true">
    <!-- <v-progress-circular indeterminate size="64" v-if="false"></v-progress-circular> -->
    <div class="currentAddress" v-show="!isInputAddressMode">
      <h2 class="currentAddress-title">{{address}}</h2>
      <div class="currentAddress-put" @click="switchToAddressMode">изменить адрес</div>
    </div>
    <yandex-map
      v-show="!isInputAddressMode"
      :coords="coords"
      :zoom="17"
      @click.stop="onClick"
      @map-was-initialized="onInit"
      :controls="controls"
      :options="options"
      @boundschange="onBoundsChange"
    />
    <map-suggest
      v-show="isInputAddressMode"
      @select="onSelect"
    />

  </v-overlay>
</template>

<script>
  import { loadYmap } from 'vue-yandex-maps'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { getClose, getGeo, getIamHere, getPlace, getZoomIn, getZoomOut } from './factory'
  import MapSuggest from '@/components/map-suggest'
  import { getAddresFromGeoobject, getAddressFromString, getAddresByCoords } from '@/common/lib/map'
  import { settings as yMapSettings } from '@/plugins/ymapPlugin' // так сделал потому что из плагина переменная ymaps с первого открытия карты не доступна

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
      coords: [],
      mapInstance: null,
      ymaps: null
    }),
    computed: {
      ...mapGetters('map', {
        isMapVisible: 'isMapVisible',
        getCurrentCoords: 'getCurrentCoords',
        getCurrentAddress: 'getCurrentAddress',
        isInputAddressMode: 'isInputAddressMode',
        geolocationAvailable: 'geolocationAvailable'
      }),
      currentAddress () {
        return this.getCurrentAddress
      }
    },
    async mounted() {
      await loadYmap({ ...yMapSettings });
    },
    methods: {
      ...mapMutations('map', {
        hideMap: 'HIDE_MAP',
        setCurrentCoords: 'SET_CURRENT_COORDS',
        switchToMapMode: 'UNSET_INPUT_ADDRESS_MODE',
        switchToAddressMode: 'SET_INPUT_ADDRESS_MODE'
      }),
      ...mapActions('map', { getLocation: 'getLocation', getGeoObjects: 'getGeoObjects' }),
      async onInit (mapInstance) {
        if (this.getCurrentAddress !== '') {
          this.address = this.getCurrentAddress
        }
        if (this.getCurrentCoords.length !== 0) {
          this.coords = this.getCurrentCoords
        }
        this.mapInstance = mapInstance
        this.ymaps = ymaps
        getClose(ymaps, mapInstance, () => {
          this.hideMap()
        })
        getZoomIn(ymaps, mapInstance)
        getZoomOut(ymaps, mapInstance)
        getPlace(ymaps, mapInstance)
        getIamHere(ymaps, mapInstance, async (e) => {
          const coords = mapInstance.getCenter()
          await this.getGeoObjects({coords, ymaps})
        })
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
          ymaps.geocode(selectedValue, { results: 1 })
            .then((res) => {
              const geoObjects = res.geoObjects.get(0)
              component.coords = geoObjects.geometry.getCoordinates()
              if (!component.geolocationAvailable) {
                component.address = getAddressFromString(selectedValue)
                this.switchToMapMode()
                mapInstance.setCenter(component.coords, 17)
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
  .ymap-container {
    width: 100vw;
    height: 100vh;
  }
  ymaps .customMapBtn {
    text-align: center;
  }
  ymaps .customMapBtn, ymaps .customMapBtn i.material-icons {
    font-size: $size;
    line-height: $size;
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
    -moz-box-shadow:    0px 2px 5px 0px rgba(50, 50, 50, 0.5);
    box-shadow:         0px 2px 5px 0px rgba(50, 50, 50, 0.5);
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
    width: 80vw;
    border-radius: 5px;
  }
  .v-overlay__content {
    width: 100vw;
    height: 100vh;
  }
  .currentAddress {
    width: 100%;
    top: 25vh;
    text-align: center;
    position: absolute;
    z-index: 4500;
  }
  h2.currentAddress-title {
    color:rgba(50, 50, 50, 0.7)
  }
  .currentAddress-put {
    color: #00a646;
  }
</style>
