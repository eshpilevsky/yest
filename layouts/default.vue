<template>
<v-app dark>
	<layout-header v-show="this.$router.currentRoute.name !== 'restik'"/>
	<!-- !isMapVisible -->
    <v-content v-show="!isMapVisible">
        <v-container class="main_cont">
            <nuxt />
        </v-container>
    </v-content>
	<layout-footer v-show="!isMapVisible"/>
  <map-container v-show="canDisplayMap"/>
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
	},
	mounted () {
		this.$vuetify.theme.dark = false;
		console.log(this.$router.currentRoute.name)
	},
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
