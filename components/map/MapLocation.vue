<template>
<div id="map">
    <span class="label_wrap">
        <span class="label"></span>
    </span>
</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'MapLocation',
	props: ['currentLocation', 'changedFrom'],
	data () {
		return {
			map: null,
			newLocation: {},
			getAdress: {},
			userLocation: {},
			currentLocationCoords: this.currentLocation
		}
	},
	watch: {
		changedFrom: function (val) {
			if (val !== 'map') {
				this.changeCenter(this.currentLocation)
			}
		},
		newLocation: function (val) {
			this.setLocation(val)
		}
	},
	mounted () {
		this.buildMap(this.currentLocationCoords)
	},
	methods: {
		mapHandler (e) {
			const coords = e.originalEvent.map.getCenter()
			this.getLocation(coords)
		},
		buildMap (coords) {
			/* eslint-disable */
            var myMap
            const coordsArr = this.currentLocationCoords !== '' ? [this.currentLocationCoords.latitude, this.currentLocationCoords.longitude] : [53.902496, 27.561481]
            var init = () => {
                myMap = new ymaps.Map('map', {
                    center: coordsArr,
                    controls: [],
                    zoom: 17
                }, {
                    suppressMapOpenBlock: true
                })
                var btnPlus = new ymaps.control.Button({
                    options: {
                        layout: ymaps.templateLayoutFactory.createClass(
                            "<div class='customZoomBtn plus'><div/>"
                        ),
                        maxWidth: 150
                    }
                });
                myMap.controls.add(btnPlus, {
                    float: 'none',
                    position: {
                        bottom: '350px',
                        right: '25px'
                    }
                });
                btnPlus.events.add('click', function (event) {
                    myMap.setZoom(myMap.getZoom() + 1, {
                        duration: 500
                    });
                });

                var btnMinus = new ymaps.control.Button({
                    options: {
                        layout: ymaps.templateLayoutFactory.createClass(
                            "<div class='customZoomBtn minus'><div/>"
                        ),
                        maxWidth: 150
                    }
                });
                myMap.controls.add(btnMinus, {
                    float: 'none',
                    position: {
                        bottom: '310px',
                        right: '25px'
                    }
                });
                btnMinus.events.add('click', function (event) {
                    myMap.setZoom(myMap.getZoom() - 1, {
                        duration: 500
                    });
                });
                var geolocationControl = new ymaps.control.GeolocationControl({
                    options: {
                        noPlacemark: true,
                        layout: ymaps.templateLayoutFactory.createClass(
                            "<div class='customZoomBtn myGeo'><div/>"
                        ),
                        float: 'none',
                        position: {
                            bottom: '250px',
                            right: '25px'
                        }
                    }
                });
                geolocationControl.events.add('locationchange', function (event) {
                    var position = event.get('position'),
                        locationPlacemark = new ymaps.Placemark(position);
                    myMap.panTo(position);
                });
                myMap.controls.add(geolocationControl)

                geolocationControl.events.add('locationchange', function (event) {
                    var position = event.get('position')
                    myMap.panTo(position)
                });
                myMap.events.add('actionend', this.mapHandler, this)
            }
            ymaps.ready(init())

            // let currentUserPosition = [coords.latitude, coords.longitude]
            // this.getLocation(currentUserPosition)
            this.map = myMap
        },
        changeCenter(coords) {
            this.map.events.remove('actionend', this.mapHandler, this)
            this.map.setCenter([coords.latitude, coords.longitude], 17, {
                duration: 100,
                checkZoomRange: false
            })
            this.map.events.add('actionend', this.mapHandler, this)
        },
        getLocation: async function (coords) {
            let location = {}
            location.coords = {
                latitude: coords[0],
                longitude: coords[1]
            }
            const ySecretKey = '3ada3000-4fe5-4450-8bd0-9840db3bf539'
            let labelCoord = `${location.coords.longitude} ${location.coords.latitude}`
            axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=${ySecretKey}&format=json&lang=ru_RU&rspn=1&ll=27.561481,53.902496&bbox=27.405475,53.832828~27.702106,53.948831&geocode=${labelCoord}`).then((response) => {
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

                this.$emit('changeAdress', this.userLocation)
            }).catch((error) => {
                console.error(error)
            })
        },
        setLocation: function (location) {
            location.from = 'map'
            if (location) {
                this.$emit('addNewLocation', location)
            }
        }
    }
}
</script>

<style>
.customZoomBtn {
    height: 40px;
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
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iIzQ0M0MwRiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjYiIGQ9Ik01LjAwMiAxMC44OEwxOCA2bC00Ljg3MiAxMy0xLjYyOC02LjV6Ii8+PC9zdmc+);
    border-radius: 100%;
}

.plus {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTEgMTFIN2ExIDEgMCAwIDAgMCAyaDR2NGExIDEgMCAwIDAgMiAwdi00aDRhMSAxIDAgMCAwIDAtMmgtNFY3YTEgMSAwIDAgMC0yIDB2NHoiLz48L3N2Zz4=);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom: 1px solid rgba(96, 96, 96, 0.15);
}

.minus {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iMiIgeD0iNiIgeT0iMTEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgcng9IjEiLz48L3N2Zz4=);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}

#map {
    height: 100%;
    width: 100%;
    margin: 0;
    position: relative;
    box-sizing: border-box;
}

#map .label_wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}

#map .label {
    width: 30px;
    height: 40px;
    background: url('../../assets/geo.svg');
    z-index: 2000;
    background-size: contain;
    background-repeat: no-repeat;
    padding-bottom: 35px;
}
</style>
