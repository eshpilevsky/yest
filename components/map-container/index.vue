<template>
    <v-overlay light :value="isMapVisible === true">
      <v-progress-circular indeterminate size="64" v-if="false"></v-progress-circular>
      <yandex-map
        v-if="isInputAddressMode !== true"
        :coords="coords"
        :zoom="17" 
        @click.stop="onClick"
        @map-was-initialized="onInit"
        :controls="controls"
        :options="options"
      />
      <div v-else class="address-input">
        <v-text-field 
          append-icon="close"
          @click:append="appendIconCallback"
        >
          <template v-slot:append-outer>
            <v-btn outlined @click="hideMap">Отменить</v-btn>
            </template>
        </v-text-field>
      </div>
    </v-overlay>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { getClose, getGeo, getIamHere, getPlace, getZoomIn, getZoomOut } from './factory'
  export default {
    data: () => ({
      controls: [],
      options: {
          autoFitToVievport: true,
          suppressMapOpenBlock: true
      },
      coords: []
    }),
    computed: {
      ...mapGetters('map', { isMapVisible: 'isMapVisible', getCurrentCoords: 'getCurrentCoords', isInputAddressMode: 'isInputAddressMode' }),
    },
    created() {
      // await this.getLocation();
    },
    methods: {
      ...mapMutations('map', { hideMap: 'HIDE_MAP', setCurrentCoords: 'SET_CURRENT_COORDS' }),
      ...mapActions('map', { getLocation: 'getLocation', getGeoObjects: 'getGeoObjects' }),
      async onInit (mapInstance) {
        getClose(ymaps, mapInstance, () => {
          this.hideMap()
        })
        getZoomIn(ymaps, mapInstance)
        getZoomOut(ymaps, mapInstance)
        getPlace(ymaps, mapInstance)
        getIamHere(ymaps, mapInstance, () => {
          const coords = mapInstance.getCenter()
          this.getGeoObjects({coords, ymaps})
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
      appendIconCallback(e) {
        console.log(e, this )
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
</style>