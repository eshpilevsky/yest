<template>
<v-app>
	<layout-header v-if="isMapVisible === false"/>
    <v-content v-if="isMapVisible === false">
        <v-container class="main_cont">
            <nuxt />
        </v-container>
    </v-content>
	<layout-footer v-if="isMapVisible === false"/>
    <map-container v-if="canDisplayMap === true"/>
</v-app>
</template>

<script>
import LayoutHeader from '@/components/layout-header';
import LayoutFooter from '@/components/layout-footer';
import MapContainer from '@/components/map-container'
import { mapGetters } from 'vuex'

export default {
	components: {
		LayoutHeader,
        LayoutFooter,
        MapContainer
	},
    data() {
        return {
            test: null
        }
    },
    computed: {
        ...mapGetters({
            canDisplayMap: 'device/isMobile',
            isMapVisible: 'map/isMapVisible'
        })
    }
}
</script>

<style scoped>
.container{
	padding-top: 3rem !important;
	padding-right: 0 !important;
	padding-bottom: 0 !important;
	padding-left: 0 !important;
}
</style>