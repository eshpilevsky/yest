<template>
<div id="map" class="smallMap">
    <yandex-map v-show="pageReady" :coords="current_coords" :zoom="17" @click="onClick">
        <ymap-marker :coords="current_coords" marker-id="123" hint-content="Моё местопложение" />
    </yandex-map>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    data: () => ({
        current_coords: [],
        optionsMass: [],
        coords: [
            53.88764467779466,
            28.039743999999992,
        ],
        coords2: [
            53.88764467779466,
            28.039743999999992
        ],
        controlsMass: [
            'zoomControl',
        ],
        markerIcon: {
            layout: 'default#imageWithContent',
            imageHref: 'https://yastatic.net/s3/eda-front/prod-www/assets/black_pin-d24d811c3377a0124f553f293f9e35e6.svg',
            imageSize: [30, 30],
            imageOffset: [0, 0],
            content: '',
            contentOffset: [0, 15],
            contentLayout: ''
        },
        pageReady: false
    }),
    computed: {
        ...mapGetters({
            getUserLocation: 'user/getUserLocation'
        })
    },
    methods: {
        onClick(e) {
            this.coords = e.get('coords');
        },
    },
    mounted() {
        this.current_coords[0] = this.getUserLocation.coords.latitude
        this.current_coords[1] = this.getUserLocation.coords.longitude
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
}

.ymap-container {
    height: 100%;
}

.red {
    color: red;
}
</style>
