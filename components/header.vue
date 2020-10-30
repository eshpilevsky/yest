<template>
  <div class="header-contain" v-show="!isMapVisible" :class="{ burgerOverlaySet: showburgerOverlay == true}">
    <div class="container">
      <div class="burger-log" @click="showHideSidebar()" v-show="showSidebar == false" />
      <v-navigation-drawer v-model="showSidebar" absolute left temporary burgerOverlay-opacity="0.7" class="newHeader" v-show="showSidebar">
        <v-list>
          <div class="menu-header" style="position: relative">
            <div class="burger-log-close" @click="showHideSidebar()" />
            <div class="mobile-logo-block">
              <img src="@/assets/logo.svg" class="logo-img" alt="logomobile">
            </div>
          </div>
          <div class="primary-links">
            <div>
              <nuxt-link :to="`/${this.getSelectedZone.alias}`">
                <v-icon>restaurant</v-icon>
                Рестораны
              </nuxt-link>
            </div>
          </div>
          <div class="secondary-links">
            <div>
              <nuxt-link to="/contacts">
                О сервисе
              </nuxt-link>
              <nuxt-link to="/rabota">
                Стать курьером
              </nuxt-link>
              <nuxt-link to="/partner">
                Стать партнёром
              </nuxt-link>
              <nuxt-link to="/faq">
                Вопросы и ответы
              </nuxt-link>
              <nuxt-link to="/business">
                Еда для бизнеса
              </nuxt-link>
              <nuxt-link to="/terms-of-use">
                Пользовательское соглашение
              </nuxt-link>
            </div>

            <div class="contact-us">
              <v-bottom-sheet v-model="sheet" persistent :eager=true>
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
                <v-sheet class="text-start rounding" >
                  <div class="contact-title">
                                    <span>
                                        Связаться с нами
                                    </span>
                    <span @click="sheet = !sheet">
                                        <v-icon>close</v-icon>
                                    </span>
                  </div>
                  <!-- <div class="contact-item">
                      <img src="@/assets/contactUs-mail.svg" alt="Электорнная почта">
                      Электронная почта
                  </div> -->
                  <div class="contact-item">
                    <img src="@/assets/contactUs-phone.svg" alt="Позвонить нам">
                    <a href="tel:375339119312">
                      Позвонить нам
                    </a>
                    <!-- 375339119312 -->
                  </div>
                  <!-- <div class="contact-item">
                      <img src="@/assets/contactUs-vk.svg" alt="Вконтакте">
                      Вконтакте
                  </div>
                  <div class="contact-item">
                      <img src="@/assets/contactUs-facebook.svg" alt="Facebook">
                      Facebook
                  </div>
                  <div class="contact-item">
                      <img src="@/assets/contactUs-telegram.svg" alt="Telegram">
                      Telegram
                  </div> -->
                </v-sheet>
              </v-bottom-sheet>
            </div>
          </div>
        </v-list>
      </v-navigation-drawer>
      <nuxt-link v-show="!showSidebar" :to="this.getSelectedZone.alias !== undefined ? `/${this.getSelectedZone.alias}`: `/`" class="mobileLogo">
        <img src="@/assets/logo.svg" class="burger-logo-img" :class="{hideLogo : this.getCurrentAddress.length > 0}" alt="logodesktop">
        <map-btn v-show="showSetAdressBtn" :isHeader='true' class="header-map-btn" />
      </nuxt-link>
      <div v-show="showSidebar" class="logo-img">
        <map-btn v-show="canDisplayMap" />
      </div>
      <div class="links-list">
        <nuxt-link to="/partner">
          Ресторанам
        </nuxt-link>
        <nuxt-link to="/rabota">
          Курьерам
        </nuxt-link>
        <nuxt-link to="/business">
          Компаниям
        </nuxt-link>
      </div>
      <div class="technical-Btns">
        <client-only>
          <v-btn v-show="this.getCurrentAddress.length > 0" small rounded outlined class="zone-btn" color="primary" @click="showDesktopMap()" :class="{'btn--rounded' : this.getTotalPrice == 0}">
            <v-icon>
              near_me
            </v-icon>
            <span class="zone-btn-address">{{this.getCurrentAddress}}</span>
          </v-btn>
          <v-btn v-if="this.getTotalPrice > 0" color="primary" @click='goToLatestReset()' class="header-cart-btn"  :class="{'btn--rounded' : this.getCurrentAddress.length == 0}">
            <v-icon class="header-cart-icon">shopping_cart</v-icon>
            {{this.getTotalPrice}} BYN
          </v-btn>
        </client-only>

         <client-only>
           <v-overlay v-model="showAuthForm">
             <smsForm @closeForm='closeAuthForm()' @closeFormShowOrderForm='closeFormAuth()' />
           </v-overlay>
         </client-only>

        <v-overlay :dark='false' :value="burgerOverlay" :opacity=".5">
          <MapDesktop @closeMap='closeDesktopMap()' />
        </v-overlay>

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn small rounded outlined class="zone-btn country-zone-btn btn--rounded" color="primary" v-on="on">
              {{ getSelectedZone.name }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in this.getZoneList" :key="index" v-show="getSelectedZone.id !== item.id" class="zone-list-item" @click="changeRegion(item)">
              <v-list-item-title>{{ item.name }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!--Вывод личного кабинета -->
        <!--<client-only>-->
          <!--<nuxt-link to="/profile" v-if="this.getUserPhoneNumber != null">-->
            <!--<div  class="user__number">-->
              <!--+{{this.getUserPhoneNumber}}-->
            <!--</div>-->
          <!--</nuxt-link>-->

          <!--<div v-else  class="user__login" @click="openAuthForm()">-->
            <!--Войти-->
          <!--</div>-->
        <!--</client-only>-->

      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import MapBtn from '@/components/map/map-btn'
  import MapContainer from '@/components/map/mobile'
  import MapDesktop from '@/components/map/desktop'
  import smsForm from '@/components/restaurant/sms-form'

  export default {
    name: 'layout-header',
    components: {
      MapBtn,
      MapContainer,
      MapDesktop,
      smsForm
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
        showAuthForm: false,
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
      getSelectedZone(newValue){
        return newValue
      },
      getCurrentAddress(newValue, oldValue) {
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
      goToLatestReset() {
        setTimeout(() => {
          if (this.getLatetestRestInfoWithOrder !== null) {
            this.$router.push(`/${this.getLatetestRestInfoWithOrder.params.region}/restaurant/${this.getLatetestRestInfoWithOrder.params.resName}`)
          } else {
            this.$router.push(`/${this.getSelectedZone.alias}`)
          }
        }, 100);
      },
      onClick(e) {
        this.coords = e.get('coords')
        this.setCurrentCoords(this.coords)
      },
      closeAuthForm(){
        this.showAuthForm = false;
      },
      closeFormAuth() {
        this.showAuthForm = false;
      },
      openAuthForm(){
        this.showAuthForm = true;
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
        // Очистить корзину //
        this.$store.dispatch('basket/dropBasket');
        // Очистить информацию об адресе //
        this.$store.dispatch('map/dropLocation');

        this.$store.dispatch('zone/setSelectedZone', item.id);
        this.$router.push(`/${item.alias}`)
      }
    },
    computed: {
      ...mapGetters({
        getSelectedZone: 'zone/getSelectedZone',
        getCurrentAddress: 'map/getCurrentAddress',
        isMapVisible: 'map/isMapVisible',
        canDisplayMap: 'device/isMobile',
        isInputAddressMode: 'map/isInputAddressMode',
        getZoneList: 'zone/getZoneList',
        getTotalPrice: "basket/getTotalPrice",
        getLatetestRestInfoWithOrder: "basket/getLatetestRestInfoWithOrder",
        getUserPhoneNumber: "user/getUserPhoneNumber"
      }),
      checkAddress() {
        return this.getCurrentAddress > 0 ? true : false
      },
    },
    mounted() {
      if (this.getCurrentAddress.length > 0) {
        this.showSetAdressBtn = true
      }
      let lastScrollTop = 0
      if (window.innerWidth < 992) {
        window.addEventListener('scroll', () => {
          const st = window.pageYOffset || document.documentElement.scrollTop
          if (st > lastScrollTop) {
            // downscroll code
            if (st > 330) {
              this.showSetAdressBtn = true
            } else {
              if (this.getCurrentAddress.length > 0) {
                this.showSetAdressBtn = true
              } else {
                this.showSetAdressBtn = false
              }
            }
          } else if (st < 330) {
            if (this.getCurrentAddress.length > 0) {
              this.showSetAdressBtn = true
            } else {
              this.showSetAdressBtn = false
            }
          } else {
            this.showSetAdressBtn = true
          }
          lastScrollTop = st <= 0 ? 0 : st
        })
      }
    }
  }
</script>

<style>
  .header-cart-icon {
    font-size: 20px;
    margin-left: 6px;
  }
  .header-cart-btn {
    font-size: 14px !important;
    letter-spacing: 0.1px;
    border-radius: 0 28px 28px 0;
    padding-left: 4px !important;
    height: 28px !important;
    box-shadow: none !important;
  }
  .header-cart-btn:before {
    content: none !important;
  }
  .header-cart-btn i {
    font-size: 20px !important;
  }
  .btn--rounded {
    border-radius: 28px !important;
  }
  .zone-btn .v-btn__content {
    width: 100%;
    overflow: hidden;
    direction: rtl;
    text-align: left;
    display: flex;
    flex-direction: row-reverse;
  }
  .zone-btn .v-btn__content i {
    font-size: 18px;
    margin-right: 4px;
  }
  .zone-btn .zone-btn-address {
    text-overflow: ellipsis;
    overflow: hidden;
    direction: rtl;
    text-align: left;
    max-width: 100%;
    flex: 1 1 auto;
    width: calc(100% - 22px);
    white-space: nowrap;
  }
  .burger-logo-img {
    max-height: 60px;
  }
  .logo-img {
    height: 40px !important;
  }
</style>
<style scoped>
  .user__number, .user__login {
    border: .5px solid rgba(0, 0, 0, .1);
    height: 32px;
    line-height: 32px;
    padding: 0 16px;
    margin-left: 20px !important;
    font-size: 14px !important;
    text-transform: none !important;
    color: #000 !important;
    text-overflow: clip;
    overflow: hidden;
    max-width: 400px;
    border-radius: 28px;
    font-weight: 600;
    cursor: pointer;
    order: 1;
  }
  .user__login {
    letter-spacing: 0.09rem;
  }
  .country-zone-btn {
    max-width: initial !important;
  }
  .header-map-btn {
    display: none;
    margin-top: 0;
    position: relative;
    z-index: 999;
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
    position: fixed;
    top: 0px !important;
    width: 310px !important;
    bottom: 0px !important;
    max-height: 100% !important;
    height: 100% !important;
  }
  .burger-log,
  .burger-log-close {
    display: none;
  }
  .technical-Btns {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    min-width: 228px;
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
  .contact-item a{
    text-decoration: none;
    color: black;
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
    width: 100%;
    position: absolute;
    bottom: 8px;
    left: 0;
    right: 0;
    background-color: #fff;
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
    height: 100%;
  }
  .burger-logo-img {
    height: 100%;
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
    justify-content: center;
    flex: 1 0 auto;
  }
  .links-list a {
    font-weight: 400 !important;
    font-size: 16px !important;
    color: black !important;
    padding: 0 20px;
    text-decoration: none !important;
    line-height: 1em;
  }
  .links-list a:hover {
    text-decoration: underline !important;
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
    height: 32px;
    min-width: 50px;
    padding: 7px 16px;
    margin-left: 20px !important;
    font-size: 15px !important;
    text-transform: none !important;
    color: #000 !important;
    text-overflow: clip;
    overflow: hidden;
    max-width: 400px;
    border-radius: 28px 0 0 28px;
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
    z-index: 20;
    display: flex;
    justify-content: center;
  }
  .logo-img {
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .container {
    margin: auto;
    width: 100%;
    max-width: 1500px;
    padding: 10px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    position: fixed;
  }
  @media screen and (max-width: 1265px) {
    .containe {
      max-width: 900px;
    }
  }
  @media screen and (max-width: 992px) {
    .mobileLogo {
      margin: 0 auto;
    }
    .hideLogo {
      display: none !important;
    }
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
      top: 10px;
    }
    .mobile-logo-block {
      position: absolute;
      top: 2px;
      left: 104px;
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
    .container {
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
    padding-bottom: 100px;
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
    background-image: url('../assets/burgerMenu.svg');
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
