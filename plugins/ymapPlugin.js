import Vue from 'vue'
import YmapPlugin from 'vue-yandex-maps'

const settings = {
	apiKey: '3ada3000-4fe5-4450-8bd0-9840db3bf539',
	lang: 'ru_RU',
	coordorder: 'latlong',
	version: '2.1'
}

Vue.use(YmapPlugin, settings);