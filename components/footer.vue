<template>
  <div class="containe">
    <div class="footer">
      <div class="footer-top">
        <div class="top-block">
          <div class="footer-top-left">
            <img src="@/assets/logo.svg" class="footer-logo" alt="logo">
          </div>
          <!-- <div class="footer-top-right">
              <img src="@/assets/googlePlay.svg" class="footer-top-img" alt="googlePlay" />
              <img src="@/assets/appStore.svg" class="footer-top-img" alt="appStore" />
          </div> -->
        </div>
      </div>
      <div class="footer-center">
        <div class="center-block">
          <div class="footer-center-left">
            <div class="footer-center-column">
              <div class="bottom-title">
                Регионы
              </div>
              <div class="regions-list">
                <client-only>
                  <div class="bottom-items" v-for="region in this.$store.state.zone.data.zone" :key="'footerRegion' + region.alias" @click="goToRegion(region)">
                    {{ region.name }}
                  </div>
                </client-only>
              </div>
            </div>
            <div class="footer-center-column">
              <div class="bottom-title">
                Блюда и кухни
              </div>
              <div class="category-list">
                <client-only>
                  <div class="bottom-items" v-for="category in computedCategory" :key="+ 'footerCategory' + category.alias "  @click="goToCategory(category)">
                    <div >
                      {{ category.name }}
                    </div>
                  </div>
                  <div v-show="!all" class="bottom-items" @click="showAllCategory()">
                    Показать все >
                  </div>
                </client-only>
              </div>
            </div>
          </div>
          <div class="footer-center-column">
            <div class="links-list">
              <div class="bottom-title ">
                О компании
              </div>
              <nuxt-link to="/contacts" class="bottom-items">
                Контакты
              </nuxt-link>
              <nuxt-link to="/delivery" class="bottom-items">
                Доставка
              </nuxt-link>
              <nuxt-link to="/terms-of-use" class="bottom-items">
                Пользоватльское соглашние
              </nuxt-link>
              <nuxt-link to="/faq" class="bottom-items">
                Вопросы и ответы
              </nuxt-link>
              <nuxt-link to="/partner" class="bottom-items">
                Стать партнёром
              </nuxt-link>
              <nuxt-link to="/rabota" class="bottom-items">
                Стать курьером
              </nuxt-link>
              <nuxt-link to="/business" class="bottom-items">
                Еда для бизнеса
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="bottom-block">
          <div class="copyright">
            ООО "Фудтех системс"
          </div>
          <div class="social-links">
            <a href="https://www.facebook.com/groups/yestby/"  rel="nofollow" target="_blank">>
              <img src="@/assets/fb.svg" alt="facebook" class="social-links-img">
            </a>
            <a href="https://vk.com/yestby"  rel="nofollow" target="_blank">>
              <img src="@/assets/vk.svg" alt="vk" class="social-links-img">
            </a>
            <a href="https://www.instagram.com/yest.by/"  rel="nofollow" target="_blank">
              <img src="@/assets/insta.svg" alt="instagramm" class="social-links-img">
            </a>
            <a href="https://twitter.com/yest_by" rel="nofollow" target="_blank">
              <img src="@/assets/twitter.svg" alt="twitter" class="social-links-img">
            </a>
          </div>
        </div>
      </div>
    </div>
<!--    <v-overlay :value="restOverlay2" z-index="100">-->
<!--      <v-progress-circular indeterminate size="64"></v-progress-circular>-->
<!--    </v-overlay>-->
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'layout-footer',
    data() {
      return {
        all: false,
        limit: 5,
        mass: []
      }
    },
    computed: {
      ...mapGetters({
        getCategoryList: 'user/getCategoryList',
        getSelectedZone: 'zone/getSelectedZone'
      }),
      computedCategory() {
        if (this.all) {
          return this.$store.state.user.data.categoryList
        } else {
          return this.$store.state.user.data.categoryList.slice(0,4)
        }
      },
    },
    methods: {
      showAllCategory() {
        this.all = !this.all
      },
      goToCategory(category) {
        this.$store.dispatch('user/selectCategory', category)
        this.$router.push(`/${this.getSelectedZone.alias}/restaurants/category/${category.alias}`)
      },
      goToRegion(region) {
        this.$store.dispatch('zone/setSelectedZone', region.id)
        this.$router.push(`/${region.alias}`)
      }
    },
  }
</script>

<style scoped>
  .footer-top-right {
    display: flex;
    align-items: center;
    justify-content: initial;
  }
  .footer-top-left {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .copyright {
    color: #b8b8b8;
    font-size: 13px;
    display: flex;
    align-items: center;
  }
  .center-block,
  .bottom-block,
  .top-block {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    max-width: 1420px;
    margin: auto;
    padding: 0 120px;
  }
  .social-links {
    display: flex;
    flex-direction: row;
    padding-right: 20px;
  }
  .social-links-img {
    margin-left: 15px;
    max-width: 28px;
    max-height: 28px;
    cursor: pointer;
  }
  .footer-bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 30px 0px 30px 0px;
  }
  .links-list {
    text-align: end;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
  }
  .footer-center-left {
    display: flex;
    flex-direction: row;
  }
  .bottom-items a,
  .bottom-items {
    color: #b8b8b8 !important;
    cursor: pointer;
    font-size: 13px !important;
    margin-bottom: 15px;
    padding: 0 !important;
    text-decoration: none !important;
    letter-spacing: 0.05rem;
  }
  .bottom-items:hover, .bottom-items a:hover {
    text-decoration: underline !important;
  }
  .bottom-title {
    color: #646464;
    font-size: 17px;
    font-weight: bold;
    line-height: 1.76;
    padding: 30px 0 30px 0;
  }
  .footer-center-column {
    display: flex;
    flex-direction: column;
    width: 210px;
  }
  .footer-center-left a {
    padding: 10px;
    font-weight: 500;
    color: black;
  }
  .footer-center {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
    padding: 20px 0px;
    max-width: 1420px;
    margin: auto;
    padding-top: 5px !important;
  }
  .footer-top-img {
    margin: 10px 0 10px 10px;
    max-height: 46px;
    max-width: 156px;
  }
  .footer-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 0px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .footer-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    height: 80px;
    width: 100%;
    box-shadow: 3px 3px 5px 6px rgba(0, 0, 0, 0.1);
    background-color: white;
  }
  .footer-container a {
    margin-left: 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  .footer {
    width: 100%;
    background-color: #f9f9f9;
  }
  .containe {
    margin: auto;
    width: 100vw;
    background-color: rgb(249, 249, 249);
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .footer-logo {
    opacity: .5;
    max-height: 40px;
    filter: grayscale(1);
  }
  @media screen and (max-width: 1265px) {
    .center-block,
    .bottom-block,
    .top-block {
      max-width: 900px;
      width: 100%;
      padding: 0;
    }
  }
  @media screen and (max-width: 350px) {
    .top-block {
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
  @media screen and (max-width: 992px) {
    .footer-top-right {
      display: flex;
      flex-wrap: wrap;
    }
    .footer-bottom {
      padding: 15px 0px;
    }
    .bottom-block {
      padding: 0 20px;
    }
    .center-block {
      padding: 0px;
      flex-direction: column;
    }
    .footer-top-img {
      margin: 10px 10px 10px 0;
    }
    .top-block {
      flex-wrap: wrap;
      padding: 10px 20px;
    }
    .category-list,
    .regions-list {
      padding: 0 20px;
      border-bottom: 1px solid #ddd;
    }
    .category-list {
      column-count: 2;
      padding-bottom: 20px;
    }
    .bottom-title {
      width: 100%;
      padding: 20px 20px 5px;
      margin-bottom: 8px;
      color: #b0b0b0;
      font-size: 12px;
      font-weight: 300;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    a.bottom-items {
      padding-left: 0;
    }
    .bottom-items {
      margin-bottom: 10px;
      color: #6a6a6a !important;
      display: block;
      font-size: 12px !important;
    }
    .links-list .bottom-title {
      margin-left: -20px;
    }
    .links-list {
      text-align: start;
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      padding: 0 20px;
    }
    .footer-center {
      padding: 0 !important;
      flex-direction: column;
    }
    .footer-center-left {
      flex-direction: column-reverse;
      width: 100%;
    }
    .footer-center-column {
      width: 100%;
    }
    .bottom-items:last-child {
      margin-bottom: 15px !important;
    }
    .footer-logo {
      max-height: 40px;
      margin: 10px;
    }
  }
</style>
