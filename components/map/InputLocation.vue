<template>
<div class="location_component" v-click-outside="closeList">
    <span class="location_component_input_close" v-show="currentLocationText.length > 0" @click="cleanLocation">Отменить</span>

    <input ref="input_location" class="location_component_input" type="text" placeholder="Введите ваш адрес доставки" :value="currentLocationText" @click="openList" @input="textLocation">
    <div class="location_component_list" v-show="isListOpen && filteredLocations.length > 0">
        <ul class="location_component_list_items" v-for="(item, index) in filteredLocations" :key="index">
            <li class="location_component_list_item" @click="setLocation(item)" v-show="item.text">
                <span class="list_item_adress_primary">{{item.text}}</span>
                <span class="list_item_adress_secondary">Беларусь, Минск</span>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'InputLocation',
	props: ['currentLocation'],
	data () {
		return {
			currentLocationText: this.currentLocation,
			isListOpen: false,
			suggestions: [],
			filteredLocations: [],
			userLocation: {}
		}
	},
	watch: {
		currentLocationText (newValue) {
			this.getSuggestions(newValue)
		}
	},
	methods: {
		openList: function () {
			this.isListOpen = true
		},
		closeList: function () {
			this.isListOpen = false
		},
		cleanLocation: function () {
			this.currentLocationText = ''
			this.$refs.input_location.focus()
			this.isListOpen = false
			this.$emit('closeSearchInput')
		},
		textLocation: function (e) {
			this.isListOpen = true
			const text = e.target.value
			this.currentLocationText = text
			this.getPrompts(text)
		},
		getPrompts: async function (text) {
			await this.getLocation(text)
			this.getSuggestions(text)

			const namesArr = this.filteredLocations.map(({
				text
			}) => text.trim())
			const namesSet = new Set(namesArr)
			this.suggestions.forEach(item => {
				if (!namesSet.has(item.text.trim())) {
					this.filteredLocations.push(item)
				}
			})
		},
		getSuggestions: function (text) {
			text = 'Минск ' + text
			let result = []
			// eslint-disable-next-line no-undef
			ymaps.suggest(text, {
				results: 6
			})
				.then(items => {
					items.forEach(item => {
						const currentItem = item.value.split(',')
						if (currentItem.length > 3 && currentItem.length < 5) {
							result.push({
								text: currentItem.slice(2).join(',')
							})
						}
					})
					this.suggestions = result
				})
		},
		getLocation: async function (text) {
			this.filteredLocations = []
			if (text.length > 3) {
				// await this.$store.dispatch('getLocation', text)
				// .then((res) => {
				// 	res.forEach((item) => {
				// 		let house = item.GeoObject.metaDataProperty.GeocoderMetaData.kind === 'house'
				// 		if (house) {
				// 			let text = item.GeoObject.metaDataProperty.GeocoderMetaData.text.split(',').slice(2).join(',')
				// 			let currentLocation = item.GeoObject.Point.pos.split(' ')
				// 			let coords = {
				// 				longitude: currentLocation[0],
				// 				latitude: currentLocation[1]
				// 			}
				// 			this.filteredLocations.push({
				// 				coords,
				// 				text
				// 			})
				// 		}
				// 	})
				// })
			}

			const firstItem = this.filteredLocations.slice(-1)[0]
			if (firstItem) {
				const props = {
					coords: firstItem.coords,
					textLocation: firstItem.text
				}
				this.$emit('getCurrentLocationItem', props)
			}
		},
		setLocation: function (item) {
			let currentItem = item

			const setItem = (item) => {
				this.currentLocationText = item.text
				const props = {
					coords: item.coords,
					textLocation: item.text
				}
				props.from = 'input'
				this.$emit('addNewLocation', props)
				this.$emit('toggleMobileInput')
				this.isListOpen = false
			}

			const isCoords = currentItem.hasOwnProperty('coords')
			if (!isCoords) {
				const ySecretKey = '3ada3000-4fe5-4450-8bd0-9840db3bf539'
				axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=${ySecretKey}&format=json&lang=ru_RU&geocode=${item.text}`).then((response) => {
					const currentLocation = response.data.response.GeoObjectCollection
					const currentLocationCoords = currentLocation.featureMember[0].GeoObject.Point.pos.split(' ')
					let coords = {
						longitude: currentLocationCoords[0],
						latitude: currentLocationCoords[1]
					}
					let locationAdress = currentLocation.featureMember[0].GeoObject.name
					this.userLocation = {
						coords,
						locationAdress
					}
					this.currentLocationText = locationAdress
					this.$emit('closeInputForm', this.userLocation)
					this.isListOpen = false
				}).catch((error) => {
					console.error(error)
				})
				// this.$store.dispatch('getLocation', item.text)
				// 	.then(res => {
				// 		let text = res[0].GeoObject.metaDataProperty.GeocoderMetaData.text.split(',').slice(2).join(',')
				// 		let currentLocation = res[0].GeoObject.Point.pos.split(' ')
				// 		let coords = {
				// 			longitude: currentLocation[0],
				// 			latitude: currentLocation[1]
				// 		}
				// 		currentItem = {
				// 			coords,
				// 			text
				// 		}
				// 		setItem(currentItem)
				// 	})
			} else {
				setItem(currentItem)
			}
		}
	}
}
</script>

<style>

.list_item_adress_secondary{
	color: #b0b0b0;
    font-size: 14px;
}

.list_item_adress_primary{
	font-size: 16px;
}

.location_component {
    width: 100%;
    position: relative;
    min-height: 45px;
	z-index: 200;
}

.location_component_input {
    width: 100%;
    border: none;
    height: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 25px;
    text-overflow: ellipsis;
	color: #000;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
}

.location_component_input_close {
    position: absolute;
    right: 10px;
    font-size: 30px;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
	color: #000;
	font-size: 14px;
	padding: 10px 5px;
	border-left: 1px solid rgba(0, 0, 0, .2);
}

.location_component_list {
    position: absolute;
    top: 100%;
    width: 100%;
    background: #fff;
    box-shadow: 4px 6px 4px 0px #3a3a3a70;
    padding-top: 10px;
    z-index: 3001;
    max-height: 300px;
    overflow-y: scroll;
}

.location_component_list_items {
    list-style: none;
    padding: 0 !important;
    margin: 0;
}

.location_component_list_item {
    padding: 12px 10px;
    max-height: 106px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: gray;
	border-bottom: 1px solid rgba(0, 0, 0, .2);
}

.location_component_list_item:hover {
    background: #e5e5e59e
}

.location_component_list_item>span {
    display: block
}

.location_component_list_item>span:first-child {
    font-size: 16px;
    color: black;
}

.location_component_list_item>span:last-child {
    font-size: 12px;
}

@media screen and (max-width: 690px) {
    .location_component {
        height: 50px;
    }

    .location_component_list {
        max-height: 400px;
    }
}
</style>
