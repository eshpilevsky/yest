<template>
<div class='setAdressContaine containerr' id='bgImg'>
    <div class="setAdressContaine-info">
        <span class="info-pre-title">
            Yest.by • {{this.getSelectedZone.name}} {{this.getSelectedCategoryName ? `• ${this.getSelectedCategoryName}` : ``}}
        </span>
        <h1 class="info-title">
            {{computedTitle[0] }} <br/>в {{computedTitle[1] }}
        </h1>
        <span class="info-setPlace">
            Укажите ваше местоположение, чтобы мы смогли предложить вам список доступных ресторанов
        </span>
        <v-text-field class='search-me' prepend-inner-icon="near_me" label="Укажите адрес доставки..." v-model='serachAdress' solo clearable @click:clear="clearAdress">
            <template v-slot:append-outer>
                <v-btn class="showRest-block" color='primary' @click="getSuggestions(serachAdress)">Показать рестораны</v-btn>
            </template>
        </v-text-field>
        <div v-if="showAdressList == true" class="adressList" v-click-outside="closeAdressList">
            <v-list>
                <v-list-item v-for="(item, index) in suggestions" :key="'adres'+index" class="itemAdress" @click="selectAdress(item)">
                    <v-list-item-content>
                        <v-list-item-title>{{item.text}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>
        <map-btn v-if="canDisplayMap === true" />
        <!-- <EnterAdressBtn class="setAdress" @show='show'/> -->
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import MapBtn from '@/components/map-btn'
import axios from 'axios'

// import EnterAdressBtn from '../components/enterAdressBtn.vue'
export default {
    name: 'setAdress',
    components: {
        MapBtn
        // EnterAdressBtn
    },
    data() {
        return {
            serachAdress: '',
            overlay: false,
            showAdressList: false,
            ww: 0,
            suggestions: [],
            filteredLocations: []
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: 'zone/getSelectedZone',
            getSelectedCategoryTitle: 'user/getSelectedCategoryTitle',
            getUserLocation: 'user/getUserLocation',
            getSelectedCategoryName: 'user/getSelectedCategoryName',
            canDisplayMap: 'device/isMobile'
        }),
        computedTitle(){
            let a = this.getSelectedCategoryTitle
            let b = a.split(' в ')
            return [b[0], b[1]]
        }
    },
    watch: {
        getSelectedCategoryTitle(newValue) {
            return newValue
        },
        serachAdress(newValue) {
            this.getSuggestions(newValue)
            // this.showAdressList = true
        },
        getUserLocation(newValue) {
            this.serachAdress = newValue.locationAdres
        },
        getSelectedZone(newValue) {
            // this.serachAdress = ''
            if (this.getUserLocation.locationAdress !== null) {
                this.serachAdress = this.getUserLocation.locationAdress
            };
        }
    },
    methods: {
        clearAdress() {
            // this.$store.dispatch('user/setUserLocation', {
			// 	coords: {
            //         latitude: null,
            //         longitude: null
            //     },
            //     locationAdress: null
			// })
        },
        show(value) {
            var body = document.getElementsByTagName('body')[0]
            var headContainer = document.getElementsByClassName('header-contain')[0]
            if (value === true) {
                body.className += 'stop-scrolling'
                headContainer.style.visibility = 'hidden'
            } else {
                body.classList.remove('stop-scrolling')
                headContainer.style.visibility = 'visible'
            }
        },
        closeAdressList() {
            this.showAdressList = false
        },
        selectAdress(adress) {
            this.serachAdress = adress.text
            const ySecretKey = '3ada3000-4fe5-4450-8bd0-9840db3bf539'
            // axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=${ySecretKey}&format=json&lang=ru_RU&geocode=${adress.text}`).then((response) => {
            // 	const currentLocation = response.data.response.GeoObjectCollection.featureMember[0].GeoObject
            // 	const locationName = currentLocation.name
            // 	let coordStr = currentLocation.Point.pos.split(' ')
            // 	var result = {
            // 		coords: {
            // 		latitude: coordStr[0],
            // 		longitude: coordStr[1]
            // 		},
            // 		locationAdress: locationName.trim()
            // 	}
            // 	console.log('selectAdress -> result', result)
            // 	this.$store.dispatch('user/setUserLocation', result)
            // 	this.showAdressList = false
            // }).catch((error) => {
            // 	console.error(error)
            // })
        },
        getSuggestions(text) {
            // if (text.length > 3) {
            //     text = this.getSelectedZone.name + text
            //     let result = []
            //     eslint-disable-next-line no-undef
            //     ymaps.suggest(text, {
            //     	results: 6
            //     })
            //     	.then(items => {
            //     		items.forEach(item => {
            //     		const currentItem = item.value.split(',')
            //     		if (currentItem.length > 3 && currentItem.length < 5) {
            //     		result.push({
            //     		text: currentItem.slice(2).join(',')
            //     		})
            //     		}
            //     		})
            //     		this.suggestions = result
            //     	})
            // }
        }
    },
    beforeMount() {
        this.ww = window.innerWidth;
    },
    mounted() {
        if (this.getUserLocation.locationAdress !== null) {
            this.serachAdress = this.getUserLocation.locationAdress
            this.showAdressList = false
            console.log('mounted -> this.showAdressList', this.showAdressList)
        };
    }
}
</script>

<style scoped>

.setAdress{
	display: none;
}

.itemAdress {
    cursor: pointer;
    background-color: 1px solid rgba(238, 0, 0, 0.4) !important;
}

.itemAdress:hover {
    background-color: 1px solid rgba(238, 0, 0, 0.4) !important;
}

.adressList {
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.4);
    width: 60%;
    position: relative;
    z-index: 100;
}

.showRest-block {
    margin-top: -12px !important;
    margin-left: -15px !important;
    height: 48px !important;
    color: #000 !important;
    font-weight: bold !important;
    text-transform: none !important;
    border-top-left-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
}

.info-title {
    margin: 0;
    font-size: 50px;
    line-height: 1.2;
    font-weight: 400;
    padding-right: 25%;
    color: white;
    margin-bottom: 30px;
}

.info-pre-title {
    color: white;
    opacity: 0.8;
}

.search-me {
    width: 80%;
    height: 50px;
}

.setAdressContaine-info {
    padding: 50px 80px;
    min-width: 100%;
    margin-bottom: -40px;
}

.setAdressContaine {
    transition: 1s;
    /* background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))), url('https://yastatic.net/s3/eda-front/prod-www/assets/default-d3a889e26c9ac9089ce5b007da1ac51b.png'); */
    background-color: rgba(0, 0, 0, 0.4);
    background-size: cover;
    background-position: center;
    min-height: 250px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin: auto;
    margin-top: 4.5rem;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    max-width: 1420px;
    background-position-x: -650px;
    background-position-y: -70px;
}

.info-setPlace {
    display: none;
}

@media screen and (max-width: 768px) {
    .setAdressContaine-info {
        padding: 40px 0;
    }

    .info-title {
        font-size: 40px;
    }

}

@media screen and (max-width: 450px) {

	.setAdress{
		display: flex;
	}

    .near_me_icon {
        padding-right: 10px;
    }

    .setAdressContaine {
        background: none;
    }

    .info-pre-title {
        color: #b0b0b0;
        font-size: 12px;
    }

    .info-title {
        color: #000;
        width: 95%;
        font-size: 24px;
        min-height: 60px;
        line-height: 1.2;
        align-items: center;
    }

    .info-setPlace {
        display: flex;
        color: #b0b0b0;
        padding-bottom: 30px;
        font-size: 12px;
        line-height: 1.67;
        width: 60%;
    }

    .setAdressContaine {
        /* background-image: none !important; */
        /*background-size: auto;*/
        background-position: right;
        background-repeat: no-repeat;
        margin-top: 0;
        height: 100%;
        width: 100%;
        background-position-x: 230px;
        background-position-y: -0px;
    }

    .setAdressContaine:active {
        /* background-image: none !important; */
        /*background-size: auto;*/
        background-position: right;
        background-repeat: no-repeat;
        margin-top: 0;
        height: 100%;
        width: 100%;
        background-position-x: 230px;
        background-position-y: -0px;
  }

    .setAdressContaine-info {
        padding: 40px 16px;
    }

    .search-me {
        display: none;
    }

}
</style>
