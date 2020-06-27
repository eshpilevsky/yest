<template>
<div id="map" class="smallMap"  >
	hello
  <yandex-map 
  v-if="pageReady"
    :coords="coords_test"
    :zoom="13" 
    
    @click="onClick"
  >
    <ymap-marker 
      :coords="coords_test" 
      marker-id="123"
      hint-content="Аэропорт" 
    />
  </yandex-map>
</div>
  
</template>

<script>
export default {
  data: () => ({
    coords_test: [53.88764467779466,28.039743999999992],
    coords: [
      53.88764467779466,
      28.039743999999992,
    ],
    coords2: [
      53.88764467779466,
      28.039743999999992
    ],
    markerIcon: {
      layout: 'default#imageWithContent',
      imageHref: '',
      imageSize: [30, 30],
      imageOffset: [0, 0],
      content: '',
      contentOffset: [0, 15],
      contentLayout: ''
	},
	pageReady: false
  }),
  computed: {
  },
  methods: {
    onClick(e) {
      this.coords = e.get('coords');
    },
  },
  mounted() {
    this.pageReady = true;
}
};
</script>

<style scoped>
#map {
  width: 100%;
  max-width: 768px;
  height: 100vh;
  max-height: 600px;
  position: relative;
  z-index: 99999 !important;
}
.ymap-container {
  height: 100%;
  position: relative;
  z-index: 99999 !important;
}
.red {
  color: red;
}
</style>