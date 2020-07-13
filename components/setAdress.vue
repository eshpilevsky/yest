<template>
<div class='setAdressContaine containerr' id='bgImg' >
    <div class="setAdressContaine-info">
        <span class="info-pre-title">
            Yest.by • {{this.getSelectedZone.name}} {{this.getSelectedCategoryName ? `• ${this.getSelectedCategoryName}` : ``}}
        </span>
        <h1 class="info-title">
            {{computedTitle[0] }} <br />в {{computedTitle[1] }}
        </h1>
        <span class="info-setPlace">
            Укажите ваше местоположение, чтобы мы смогли предложить вам список доступных ресторанов
        </span>
        <v-text-field @focus="focusInput" @blur="blurInput()" class='search-me' prepend-inner-icon="near_me" label="Укажите адрес доставки..." v-model='searchAddress' solo clearable @click:clear="clearAdress">
            <template v-slot:append-outer>
                <v-btn class="showRest-block" color='primary' @click="showRestuarants()">Показать рестораны</v-btn>
            </template>
        </v-text-field>
        <div v-show="showAdressList && searchAddress.length > 3" class="adressList">
            <v-list>
                <v-list-item v-for="(item, index) in suggestions" :key="'adres'+index" class="itemAdress" @click="selectAdress(item)">
                    <v-list-item-content>
                        <v-list-item-title>{{item.value}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>
        <map-btn v-show="this.canDisplayMap" class="map-btn" />
    </div>
</div>
</template>

<script>
import {
    mapGetters,
    mapMutations
} from 'vuex'
import MapBtn from '@/components/map-btn'
import {
    settings
} from '@/plugins/ymapPlugin'
import {
    loadYmap
} from 'vue-yandex-maps'
export default {
    name: 'setAdress',
    components: {
        MapBtn
    },
    data() {
        return {
            searchAddress: '',
            overlay: false,
            showAdressList: false,
            ww: 0,
            suggestions: [],
            filteredLocations: [],
            ymaps: null,
            loadingSuggest: false,
            coords: []
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: 'zone/getSelectedZone',
            getSelectedCategoryTitle: 'user/getSelectedCategoryTitle',
            getSelectedCategoryName: 'user/getSelectedCategoryName',
            canDisplayMap: 'device/isMobile',
            getCurrentAddress: 'map/getCurrentAddress'
        }),
        computedTitle() {
            let a = this.getSelectedCategoryTitle
            let b = a.split(' в ')
            return [b[0], b[1]]
        }
    },
    watch: {
        getSelectedCategoryTitle(newValue) {
            return newValue
        },
        searchAddress(newValue) {
            if (newValue.length > 3) {
                this.getSuggest(newValue)
            }
        },
        getCurrentAddress(newValue) {
            this.searchAddress = newValue
        },
    },
    methods: {
        ...mapMutations({
            setCurrentAddress: 'map/SET_CURRENT_ADDRESS',
            setCurrentCoords: 'map/SET_CURRENT_COORDS',
        }),
        focusInput() {
            setTimeout(() => {
                this.showAdressList = true
            }, 500);
        },
        blurInput() {
            setTimeout(() => {
                this.showAdressList = false
            }, 500);
        },
        async showRestuarants() {
            const component = this
            ymaps.geocode(this.searchAddress, {
                results: 1,
                boundedBy: [
                    [51.753588, 23.148098],
                    [55.591263, 31.491889]
                ]
            }).then((geo) => {
                const geoObjects = geo.geoObjects.get(0)
                component.coords = geoObjects.geometry.getCoordinates()
                component.setCurrentCoords(geoObjects.geometry.getCoordinates())
                component.setCurrentAddress(component.searchAddress)
            });
            const id = 'restTitle';
            const yOffset = -70;
            const element = document.getElementById(id);
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        },
        getSuggest(str) {
            this.loadingSuggest = true
            const component = this
            ymaps.suggest(str, {
                results: 6,
                boundedBy: [
                    [51.753588, 23.148098],
                    [55.591263, 31.491889]
                ]
            }).then((items) => {
                component.suggestions = items
                component.loadingSuggest = false
            });
        },
        clearAdress() {
            this.setCurrentAddress('');
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
        selectAdress(address) {
            this.searchAddress = address.value
        },
    },
    async beforeMount() {
        this.ww = window.innerWidth;
        await loadYmap({
            ...settings,
            debug: true
        });
        this.ymaps = ymaps
    },
    mounted() {
        this.searchAddress = this.getCurrentAddress
    }
}
</script>

<style scoped>
.map-btn {
    visibility: hidden;
}

.setAdress {
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
    width: 50%;
    position: absolute;
    z-index: 100;
    margin-top: -2rem;
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
    margin-bottom: 2rem !important;
}

.setAdressContaine-info {
    padding: 50px 80px;
    min-width: 100%;
    margin-bottom: -40px;
}

.setAdressContaine {
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
    .map-btn {
        visibility: visible;
    }

    .setAdress {
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
        padding-bottom: 45px;
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
        background-position-x: 250px;
        background-position-y: -10px;
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
        margin-top: -10px;
    }

    .search-me {
        display: none;
    }

}
</style>
