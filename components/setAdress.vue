<template>
<div class='setAdressContaine containerr' id='bgImg'>
    <div class="setAdressContaine-info">
        <span class="info-pre-title">
            <nuxt-link to="/" class="link">
                Yest.by
            </nuxt-link>
            •
            <nuxt-link :to="`/${this.currentZone.alias}`" class="link">
                {{this.currentZone.name}}
            </nuxt-link>

            <nuxt-link :to="`/${this.currentZone.alias}/restaurants/category/${this.currentCategory.alias}`" class="link">
                <span class="pre-title" v-show="this.currentCategory.id !== 0">
                    • {{this.currentCategory.name}}
                </span>
            </nuxt-link>
        </span>
        <h1 class="info-title">
            {{this.categoryInfoData.header }} <br /> в {{ this.currentZone.accusative }}
        </h1>
        <span class="info-setPlace">
            Укажите ваше местоположение, чтобы мы смогли предложить вам список доступных ресторанов
        </span>
        <div class="smart-search">
            <!-- <v-text-field autocomplete="off" @focus="focusInput" @blur="blurInput()" class='search-me' max-width='500px' prepend-inner-icon="near_me" @click:prepend-inner="openMap()" label="Укажите адрес доставки..." v-model='searchAddress' solo clearable @click:clear="clearAdress"> -->
            <v-text-field v-on:input="changeSearchLocation();" autocomplete="off" class='search-me' max-width='500px' prepend-inner-icon="near_me" @click:prepend-inner="openMap()" label="Укажите адрес доставки..." v-model='searchAddress' solo clearable @click:clear="clearAdress">
                <template v-slot:append-outer>
                    <v-btn class="showRest-block" color='primary' @click="showRestuarants()">Показать рестораны</v-btn>
                </template>
            </v-text-field>
            <!--Подсказки при ввводе -->
            <div v-show="showAdressList && searchAddress.length > 2 && suggestions.length > 0" class="adressList">
                <v-list>
                    <v-list-item v-for="(item, index) in suggestions" :key="'address'+index" class="itemAdress" @click="selectAdress(item)">
                        <v-list-item-content>
                            <v-list-item-title>{{item.geoobjectText}}</v-list-item-title>
                            <v-list-item-subtitle class="itemAdress-sub">{{item.geoobject[1]}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </div>
        </div>
        <map-btn v-show="this.canDisplayMap" class="map-btn" />
    </div>
    <v-overlay z-index="999" :dark='false' :value="showDesktopMap" :opacity=".5">
        <MapDesktop @closeMap='closeDesktopMap()'></MapDesktop>
    </v-overlay>
</div>
</template>

<script>
import {
    mapGetters,
    mapMutations,
    mapActions
} from 'vuex'
import MapBtn from '@/components/map/map-btn'
import MapDesktop from '@/components/map/desktop'
import axios from 'axios'

import {
    settings
} from '@/plugins/ymapPlugin'
import {
    loadYmap
} from 'vue-yandex-maps'

export default {
    name: 'setAdress',
    components: {
        MapBtn,
        MapDesktop,
    },
    props: {
        categoryInfoData: Object,
        currentCategory: Object,
        currentZone: Object,
    },
    data() {
        return {
            searchAddress: '',
            overlay: false,
            showAdressList: false,
            suggestions: [],
            filteredLocations: [],
            loadingSuggest: false,
            showDesktopMap: false,
            ymaps: null,
            check_city_id: null,
            addressMass: [],
            getCityGeocoder: '',
            currentCoordsBuffer: null,
            currentAddress: null,
            confirm: false,
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: 'zone/getSelectedZone',
            getZoneList: 'zone/getZoneList',
            getSelectedCategoryName: 'user/getSelectedCategoryName',
            // getSelectedCategory: 'user/getSelectedCategory',
            canDisplayMap: 'device/isMobile',
            getCurrentAddress: 'map/getCurrentAddress',
            getAddressMass: 'map/getAddressMass'
        })
    },
    watch: {
        searchAddress(newValue, oldValue) {
          // console.log(this);
          // console.log(newValue, oldValue);
          //
          //   if (this.confirm == false) {
          //       if (newValue !== null && newValue.length > 1 && oldValue !== '') {
          //           this.showAdressList = false
          //           this.getSuggest(newValue)
          //       }
          //   }
        },
        getCurrentAddress(newValue) {
            this.searchAddress = newValue;
            this.confirm = true;
        },
        getAddressMass(newValue){
            this.addressMass = newValue;
        },
        categoryInfoData(newValue) {
            return newValue
        },
        currentZone(newValue) {
            return newValue
        },
        currentCategory(newValue) {
            return newValue
        },
    },
    methods: {
        selectAdress(address) {
            var adv = address.value
            var addressSplit = adv.split('Беларусь,');
            this.searchAddress = addressSplit[1];
            this.showAdressList = false
            this.confirm = true
            setTimeout(() => {
                this.confirm = false
			}, 1500);
			this.showRestuarants()
        },
        ...mapMutations({
            setCurrentAddress: 'map/SET_CURRENT_ADDRESS',
            setCurrentCoords: 'map/SET_CURRENT_COORDS',
        }),
        ...mapActions({
           Action__setCurrentAddress: 'map/setCurrentAddress',
        }),
        openMap() {
            this.showDesktopMap = true
            this.showAdressList = false
        },
        closeDesktopMap() {
            this.showDesktopMap = false
        },
        computedTitle(str) {
            let b = str.split(' в ')
            return [b[0], b[1]]
        },
        focusInput() {
            this.showAdressList = true
            this.getSuggest(this.searchAddress)
        },
        blurInput() {
            this.showAdressList = false
        },
        async showRestuarants() {
            this.showAdressList = false
            await this.Action__setCurrentAddress(this.searchAddress);
            this.showAdressList = false;

          let cityId = await axios.post('https://yestapi.xyz/check_delivery_address', this.addressMass).then(res => {
                return res.data.city_id
            });

            console.log('cityId->'+cityId);
            console.log('getSelectedZone->'+this.getSelectedZone.id);

            if (this.getSelectedZone.id !== cityId) {
                let findCity = this.getZoneList.find((zone) => {
                    return zone.id == cityId
                })
                if (findCity !== undefined) {
                    this.$router.push(`/${findCity.alias}`)
                } else {
                    this.$router.push(`/`)
                }
            } else {
                const id = 'restTitle';
                const yOffset = -345;
                const element = document.getElementById(id);
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });

            }

        },
        async getSuggest(str) {
            this.showAdressList = true
            this.loadingSuggest = true
            const app = this
            await ymaps.suggest(str, {
                results: 5,
                boundedBy: [
                    [51.753588, 23.148098],
                    [55.591263, 31.491889]
                ],
                strictBounds: true,
            }).then((items) => {
                items.forEach((item, key)=>{
                  items[key].geoobject = (item.value).split(',');
                  items[key].geoobjectText  = item.value.split(',').slice(2).join(',')
                });

                app.suggestions = items;
                console.log(items);
                app.loadingSuggest = false
            });
        },
        clearAdress() {
            this.showAdressList = false
            this.searchAddress = ''
            this.setCurrentAddress(null);
            this.setCurrentCoords(null);
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
      changeSearchLocation(){
          if (this.confirm === false) {
            if (this.searchAddress !== null && (this.searchAddress).length > 3) {
              this.showAdressList = false
              this.getSuggest(this.searchAddress)
            }
          }
      }
    },
    async beforeMount() {
        await loadYmap({
            ...settings,
            debug: true
        });
    },
    mounted() {
        this.searchAddress = this.getCurrentAddress;
        this.addressMass = this.getAddressMass;
    }
}
</script>

<style scoped>
.link {
    color: #fff;
    text-decoration: none;
}

.itemAdress-sub {
    color: #aaa !important;
}

.itemAdress .v-list-item__content {
    padding: 6px 0 !important;
}

.itemAdress:hover {
    background: rgba(128, 128, 128, 0.2) !important;
}

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
    z-index: 100;
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    max-width: 100%;
    width: calc(100% - 220px);
    z-index: 10;
    box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.15);
    border: none;
}

.showRest-block {
    margin-top: -12px !important;
    margin-left: -15px !important;
    height: 48px !important;
    font-weight: bold !important;
    text-transform: none !important;
    border-top-left-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
    font-size: 16px !important;
    width: 220px;
    font-size: 16px !important;
    letter-spacing: 0.5px !important;
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

.smart-search {
    position: relative;
    max-width: 80%;
}

.search-me {
    height: 50px;
}

.setAdressContaine-info {
    padding: 50px 80px;
    min-width: 100%;
    /* margin-bottom: 70px; */
}

.setAdressContaine {
    background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))), url('https://yastatic.net/s3/eda-front/prod-www/assets/default-d3a889e26c9ac9089ce5b007da1ac51b.png');
    background-color: rgba(0, 0, 0, 0.4);
    background-size: cover;
    background-position: center;
    min-height: 250px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin: auto;
    margin-top: 2.5rem;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    max-width: 1420px;
}

.info-setPlace {
    display: none;
}

/*@media screen and (max-width: 768px) {*/
/*.setAdressContaine-info {*/
/*padding: 40px 0;*/
/*}*/

/*.info-title {*/
/*font-size: 40px;*/
/*}*/

/*}*/

@media screen and (max-width: 992px) {
    .link {
        color: #000000;
        margin: 0 4px
    }

    .pre-title {
        display: flex;
    }

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
        background-size: auto 250px;
        background-repeat: no-repeat;
        background-position: top right;
        margin-top: 0;
        background-color: #fff;
        z-index: 10;
        position: relative;
    }

    .info-pre-title {
        display: flex;
        margin-bottom: 2px;
        margin-left: -4px;
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
        margin: 0 0 14px;
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
        /*background-position: right;*/
        /*background-repeat: no-repeat;*/
        /*margin-top: 0;*/
        /*height: 100%;*/
        /*width: 100%;*/
        /*background-position-x: 250px;*/
        /*background-position-y: -10px;*/
    }

    .setAdressContaine:active {
        /* background-image: none !important; */
        /*background-size: auto;*/
        background-position: right;
        background-repeat: no-repeat;
        margin-top: 0;
        height: 100%;
        width: 100%;
        /*background-position-x: 230px;*/
        /*background-position-y: -0px;*/
    }

    .setAdressContaine-info {
        padding: 40px 16px;
        margin-top: -10px;
        padding-bottom: 0px;
    }

    .search-me {
        display: none;
    }

}
</style>
