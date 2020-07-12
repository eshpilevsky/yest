<template>
<div class="header-contain" v-if="!isMapVisible" :class="{ burgerOverlaySet: showburgerOverlay == true}">
    <div class="containe">
        <div class="burger-log" @click="showHideSidebar()" v-show="showSidebar == false" />
        <v-navigation-drawer v-model="showSidebar" absolute left temporary burgerOverlay-opacity="0.7" class="newHeader" v-if="showSidebar == true">
            <v-list>
                <div class="burger-log-close" @click="showHideSidebar()" />
                <div class="mobile-logo-block">
                    <img src="@/assets/logo.png" class="logo-img" alt="logomobile">
                </div>
                <div class="primary-links">
                    <div>
                        <nuxt-link to="/">
                            <v-icon>restaurant</v-icon>
                            Рестораны
                        </nuxt-link>
                    </div>
                </div>
                <div class="secondary-links">
                    <div>
                        <nuxt-link to="/">
                            О сервисе
                        </nuxt-link>
                        <nuxt-link to="/">
                            Стать курьером
                        </nuxt-link>
                        <nuxt-link to="/">
                            Стать партнёром
                        </nuxt-link>
                        <nuxt-link to="/">
                            Вопросы и ответы
                        </nuxt-link>
                        <nuxt-link to="/">
                            Еда для бизнеса
                        </nuxt-link>
                        <nuxt-link to="/">
                            Пользовательское соглашение
                        </nuxt-link>
                    </div>

                    <div class="contact-us">
                        <v-bottom-sheet v-model="sheet" persistent>
                            <template v-slot:activator="{ on }">
                                <div class="contact-us-block" v-on="on">
                                    <v-btn fab class="contact-us-btn" color="secondary">
                                        <v-icon color="primary">
                                            chat
                                        </v-icon>
                                    </v-btn>
                                    <div class="contact-us-text">
                                        Связаться с нами
                                    </div>
                                </div>
                            </template>
                            <v-sheet class="text-start rounding" height="420px">
                                <div class="contact-title">
                                    <span>
                                        Связаться с нами
                                    </span>
                                    <span @click="sheet = !sheet">
                                        <v-icon>close</v-icon>
                                    </span>
                                </div>
                                <div class="contact-item">
                                    <img src="../../assets/contactUs-mail.svg" alt="Электорнная почта">
                                    Электронная почта
                                </div>
                                <div class="contact-item">
                                    <img src="../../assets/contactUs-phone.svg" alt="Позвонить нам">
                                    Позвонить нам
                                </div>
                                <div class="contact-item">
                                    <img src="../../assets/contactUs-vk.svg" alt="Вконтакте">
                                    Вконтакте
                                </div>
                                <div class="contact-item">
                                    <img src="../../assets/contactUs-facebook.svg" alt="Facebook">
                                    Facebook
                                </div>
                                <div class="contact-item">
                                    <img src="../../assets/contactUs-telegram.svg" alt="Telegram">
                                    Telegram
                                </div>
                            </v-sheet>
                        </v-bottom-sheet>
                    </div>
                </div>
            </v-list>
        </v-navigation-drawer>
        <nuxt-link v-if="!showSidebar" to="/" class="mobileLogo">
            <img src="@/assets/logo.png" class="burger-logo-img" :class="{hideLogo : this.getCurrentAddress.length > 0}" alt="logodesktop">
            <map-btn v-if="this.getCurrentAddress.length > 0" class="header-map-btn" />
        </nuxt-link>
        <div v-else class="logo-img">
            <map-btn v-if="canDisplayMap === true" />
        </div>
        <div class="links-list">
            <nuxt-link to="/">
                Ресторанам
            </nuxt-link>
            <nuxt-link to="/">
                Курьерам
            </nuxt-link>
            <nuxt-link to="/">
                Компаниям
            </nuxt-link>
        </div>
        <div class="technical-Btns">
            <v-btn v-if="this.getCurrentAddress.length > 0" small rounded outlined class="zone-btn" color="primary" @click="showDesktopMap()">
                <v-icon>
                    near_me
                </v-icon>
                <span class="zone-btn-address">
                    {{this.getCurrentAddress}}
                </span>
            </v-btn>
            <v-overlay :value="burgerOverlay" :opacity=".5">
                <MapDesktop @closeMap='closeDesktopMap()'></MapDesktop>
            </v-overlay>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn small rounded outlined class="zone-btn" color="primary" v-on="on">
                        {{ getSelectedZone.name }}
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in this.$store.state.zone.data.zone" :key="index" class="zone-list-item" @click="changeRegion(item)">
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </div>
</div>
</template>

<script>
import {
    mapGetters,
    mapMutations
} from 'vuex'
import MapBtn from '@/components/map-btn'
import MapContainer from '@/components/map-container'
import MapDesktop from '@/components/map-desktop'

export default {
    name: 'layout-header',
    components: {
        MapBtn,
        MapContainer,
        MapDesktop,
    },
    data() {
        return {
            calcWidth: 340,
            showburgerOverlay: false,
            burgerOverlay: false,
            sheet: false,
            showSetAdressBtn: false,
            showMap: false,
            showSidebar: false,
            items: [{
                    title: 'Home',
                    icon: 'dashboard'
                },
                {
                    title: 'About',
                    icon: 'question_answer'
                }
            ],
            saveAddress: false
        }
    },
    watch: {
        getCurrentAddress(newValue, oldValue) {
            console.log('getCurrentAddress -> newValue', newValue)
            if (newValue.length > 0) {
                this.showSetAdressBtn = true
            }
            return newValue
        }
    },
    methods: {
        ...mapMutations({
            setCurrentCoords: 'map/SET_CURRENT_COORDS',
        }),
        onClick(e) {
            this.coords = e.get('coords')
            this.setCurrentCoords(this.coords)
        },
        showDesktopMap() {
            this.burgerOverlay = true
        },
        closeDesktopMap() {
            console.error('emit close');
            this.burgerOverlay = false
        },
        showHideSidebar() {
            console.error('was click');
            // if (!this.isMapVisible) {
            this.showSidebar = !this.showSidebar
            // }
        },
        show(value) {
            this.showMap = value
        },
        handleOpenMenu() {
            this.showburgerOverlay = true
        },
        handleCloseMenu() {
            this.showburgerOverlay = false
        },
        changeRegion(item) {
            this.$store.dispatch('user/dropUserLocation')
            this.$store.dispatch('user/selectCategory', {
                id: 0,
                alias: 'all'
            })
            this.$store.dispatch('zone/setSelectedZone', item.id)
            this.$store.dispatch('user/setSelectedCategoryTitle')
            this.$router.replace(`/${this.getSelectedZone.alias}`)
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: 'zone/getSelectedZone',
            getCurrentAddress: 'map/getCurrentAddress',
            isMapVisible: 'map/isMapVisible',
            canDisplayMap: 'device/isMobile',
            getCurrentAddress: 'map/getCurrentAddress',
            isInputAddressMode: 'map/isInputAddressMode',
        }),
        checkAddress() {
            return this.getCurrentAddress > 0 ? true : false
        },
    },
    mounted() {
        this.$store.dispatch('zone/queryZones')
        if (this.getCurrentAddress.length > 0) {
            this.showSetAdressBtn = true
        }
        let lastScrollTop = 0
        if (window.innerWidth < 450) {
            if (this.getUserLocation.length > 0) {
                window.addEventListener('scroll', () => {
                    const st = window.pageYOffset || document.documentElement.scrollTop
                    if (st > lastScrollTop) {
                        // downscroll code
                        if (st > 330) {
                            this.showSetAdressBtn = true
                        } else {
                            this.showSetAdressBtn = false
                        }
                    } else if (st < 330) {
                        this.showSetAdressBtn = false
                    } else {
                        this.showSetAdressBtn = true
                    }
                    lastScrollTop = st <= 0 ? 0 : st
                })
            } else {
                this.showSetAdressBtn = true
            }
        }
    }
}
</script>

<style>
.zone-btn-address {
    text-overflow: clip;
    overflow: hidden;
}

.zone-btn .v-btn__content {
    max-width: 200px;
    overflow: hidden;
    direction: rtl;
    text-align: left;
    display: flex;
    flex-direction: row-reverse;
}

.burger-logo-img {
    max-height: 50px;
}

.logo-img {
    height: 40px !important;
}
</style><style scoped>

.hideLogo{
	display: none !important; 
}

.header-map-btn {
    display: none;
	margin-top: 40px;
}

.map {
    height: 100%;
    width: 100%;
}

.desktop-map-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.map-actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: baseline;
    width: 100%;
}

.desktop-map-title {
    margin: 0;
    font-size: 30px;
    line-height: 1.2;
    font-weight: 400;
    color: black;
}

.desktop-map {
    min-width: 800px;
    font-size: 16px;
    background: white;
    min-height: 600px;
    border-radius: 10px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.newHeader {
    position: absolute;
    top: 0px !important;
    width: 280px !important;
    bottom: 0px !important;
    max-height: 100vh !important;
    height: 100vh !important;
    top: 0 !important;
    bottom: 0 !important;
}

.burger-log,
.burger-log-close {
    display: none;
}

.technical-Btns {
    display: flex;
    flex-direction: row;
}

.rounding {
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
}

.contact-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px;
    font-size: 20px;
    min-height: 24px;
    box-sizing: content-box;
    line-height: 24px;
    font-weight: bold;
    border-bottom: 1px solid rgba(0, 0, 0, .05);
}

.contact-item img {
    margin-right: 10px;
}

.contact-item {
    cursor: pointer;
    display: flex;
    padding: 20px 20px 20px 0;
    align-items: center;
    margin-left: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, .05);
}

.contact-us-block {
    display: flex;
    justify-content: center;
    align-items: center;
}

.contact-us-text {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 15px;
    color: #000;
    font-size: 14px;
}

.contact-us-btn {
    /* background: ; */
}

.contact-us {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border-top: 30vh solid rgb(245, 245, 245);
    width: 100%;
    /* padding-top: 18vh; */
}

.burgerOverlaySet {
    display: block !important;
    position: fixed !important;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100vh !important;
    width: 100vw !important;
    background-color: rgba(87, 81, 81, 0.733) !important;
}

.mobileLogo {
    display: flex;
    justify-content: center;
    align-items: center;
}

.zone-list-item {
    cursor: pointer;
}

.zone-list-item:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.links-list {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.links-list a {
    font-weight: 400 !important;
    font-size: 16px !important;
    color: black !important;
    padding: 0 20px;
    text-decoration: none !important;
}

.language-switcher p {
    margin-left: 20px;
    margin-bottom: 0px !important;
}

.language-switcher {
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: auto;
}

.zone-btn {
    border: .5px solid rgba(0, 0, 0, .1);
    margin-left: 15px !important;
    font-size: 15px !important;
    text-transform: none !important;
    color: #000 !important;
    text-overflow: clip;
    overflow: hidden;
}

.links {
    display: flex;
    width: 100%;
    align-items: center;
}

.header-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: auto;
    height: 80px;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    position: fixed;
    z-index: 300;
    background-color: white;
    width: 100%;
    max-width: 1480px;
    padding: 0 40px;
}

.header-container a {
    margin-left: 20px;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
}

.header-contain {
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    width: 100%;
    height: 80px;
    position: fixed;
    background: #fff;
    z-index: 100;
    display: flex;
    justify-content: center;
}

.logo-img {
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.containe {
    margin: auto;
    width: 100%;
    max-width: 1420px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    position: fixed;
}

@media screen and (max-width: 1900px) {
    .containe {
        max-width: 1180px;
    }
}

@media screen and (max-width: 1265px) {
    .containe {
        max-width: 900px;
    }
}

@media screen and (max-width: 450px) {

    .header-map-btn {
        display: flex;
    }

    .burger-log {
        display: flex;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiLz48ZyBmaWxsPSIjMDAwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzIDQpIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMiIgcng9IjEiLz48cmVjdCB3aWR0aD0iMTMiIGhlaWdodD0iMiIgeT0iMTQiIHJ4PSIxIi8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjIiIHk9IjciIHJ4PSIxIi8+PC9nPjwvZz48L3N2Zz4=');
        width: 35px;
        height: 35px;
        position: absolute;
        left: 25px;
        top: 20px;
    }

    .burger-log-close {
        display: flex;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIvPgogICAgICAgIDxnIGZpbGw9IiMwMDAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQgNCkiPgogICAgICAgICAgICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMiIgeD0iLTIiIHk9IjciIHJ4PSIxIiB0cmFuc2Zvcm09InJvdGF0ZSg0NSA4IDgpIi8+CiAgICAgICAgICAgIDxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyIiB4PSItMiIgeT0iNyIgcng9IjEiIHRyYW5zZm9ybT0icm90YXRlKDEzNSA4IDgpIi8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K');
        width: 35px;
        height: 55px;
        position: relative;
        left: 20px;
        top: 15px;
    }

    .mobile-logo-block {
        position: absolute;
        top: 5px;
        left: 90px;
        min-height: 60px;
        max-height: 140px;
    }

    .header-contain,
    .header-container {
        height: 65px;
    }

    .enterAdressBtn {
        width: 100%;
        margin: auto;
    }

    .burger-menu {
        display: flex;
        position: relative;
        z-index: 9999;
    }

    .technical-Btns,
    .links-list {
        display: none;
    }

    .containe {
        justify-content: center;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
        background: #fff;
        height: 65px;
    }

    .logo-img {
        margin-top: 1%;
    }

    .header-container a {
        margin-left: 0;
    }

    .burger-logo-img {
        position: absolute;
        z-index: 999;
        max-height: 40px;
    }
}
</style><style>
.v-overlay {
    height: 100vh;
}

.primary-links div i {
    margin-right: 10px;
}

.secondary-links div a,
.primary-links div a {
    padding: 20px;
    border-bottom: 1px solid rgb(245, 245, 245);
    width: 100%;
    color: black;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    max-height: 55px;
    text-decoration: none;
}

.secondary-links {
    height: 100%;
    justify-content: space-between !important;

}

.secondary-links,
.primary-links {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    background-color: rgb(255, 255, 255);
    border-top: 8px solid rgb(245, 245, 245);
}

.burger-menu {
    display: none;
}

.bm-burger-button {
    position: fixed;
    width: 30px;
    height: 25px;
    left: 20px;
    top: 20px !important;
    cursor: pointer;
    background-image: url('../../assets/burgerMenu.svg');
}

.bm-burger-bars {
    background-color: #373a47;
    display: none;
}

.line-style {
    position: absolute;
    height: 10%;
    left: 0;
    right: 0;
    display: none;
}

.cross-style {
    width: 30px;
    height: 25px;
    left: 40px;
    top: 25px !important;
    cursor: pointer;
}

.bm-cross {
    background: #000;
    height: 25px !important;
}

.bm-cross-button {
    height: 30px;
    width: 25px;
}

.bm-menu {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    background-color: #fff;
    overflow-x: hidden;
    padding-top: 65px;
    /* transition: 0.5s; */
}

.bm-burgerOverlay {
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    height: calc(var(--vh, 1vh) * 100);
    width: 100vw;
    position: relative;
}

.bm-item-list {
    color: #b8b7ad;
    font-size: 20px;
    margin-left: 0;
}

.bm-item-list>* {
    display: flex;
    text-decoration: none;
    padding: 0;
}

.bm-item-list>*>span {
    margin-left: 10px;
    font-weight: 700;
    color: white;
}
</style>
