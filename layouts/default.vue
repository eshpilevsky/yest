<template>
<v-app>

    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WDRSHHG" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
  <script charset="UTF-8" src="//web.webpushs.com/js/push/83855c25d19785e2ee130158855efa0c_1.js" async></script>
  <layout-header v-show="!isMapVisible && this.$route.name !=='cart'" :class="{'hide': this.$route.name =='restik'}" />
    <v-content v-show="!isMapVisible">
        <v-container class="main_cont">
            <nuxt :key="$route.fullPath" />
        </v-container>
    </v-content>
    <layout-footer v-show="!isMapVisible && this.$route.name !=='cart'" />
    <map-container v-show="canDisplayMap" />
</v-app>
</template>

<script>
import LayoutHeader from '@/components/header';
import LayoutFooter from '@/components/footer';
import MapContainer from '@/components/map/mobile';
import {
    mapGetters
} from 'vuex'

export default {
    components: {
        LayoutHeader,
        LayoutFooter,
        MapContainer
    },
    computed: {
        ...mapGetters({
            canDisplayMap: 'device/isMobile',
            isMapVisible: 'map/isMapVisible'
        })
    },
    mounted() {
        this.$vuetify.theme.dark = false;
        document.addEventListener('touchmove', function (event) {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        }, false);
    },
}
</script>

<style>
i {
    cursor: pointer;
}
</style><style scoped>
.container {
    max-width: 1500px;
    width: 100%;
    margin: 0 auto;
    padding: 3rem 40px 0;
}

.hide {
    display: flex;
}

@media screen and (max-width: 992px) {
    .container {
        padding: 65px 0 0;
    }

    .hide {
        display: none;
    }
}
</style>
