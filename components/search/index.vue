<template>
  <div v-show=" this.searchText.length > 2 && showData.length > 0" class="rest-search">
   <!--SEARCH ->> {{searchText}}-->
    <v-list class="rest-search__wrapper">
      <v-list-item v-for="(item, index) in showData" :key="'SearchSuggestion'+index" class="rest-search-item">
        <v-list-item-content class="rest-search-item__wrapper">

          <!-- Это вид с изображением и с категориями -->
          <a href="" class="rest-search-item__link">
            <img class="rest-search-item__img" src="https://via.placeholder.com/150" alt="placeholder">
            <div class="rest-search-item__content">
              <p class="rest-search-item__title">Суши</p>
              <p class="rest-search-item__categories">
                <span class="rest-search-item__category">Японская</span>
                <span class="rest-search-item__category">Китайская</span>
                <span class="rest-search-item__category">Суши</span>
              </p>
            </div>
          </a>

          <!-- Это вид без изображения, но с ценником -->
          <a href="" class="rest-search-item__link">
            <span></span>
            <div class="rest-search-item__content">
              <p class="rest-search-item__subtitle">Суши с тунцом</p>
              <p class="rest-search-item__price">25 BYN</p>
            </div>
          </a>

          <a href="" class="rest-search-item__link">
            <span></span>
            <div class="rest-search-item__content">
              <p class="rest-search-item__subtitle">Суши со сливочной креветкой</p>
              <p class="rest-search-item__price">12 BYN</p>
            </div>
          </a>

        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>


<script>
  import {
    mapGetters
  } from "vuex";

  export default {

    props: ['searchText'],
    data(){
      return{
        showData: []
      };
    },
    watch: {
      searchText: function (newVal) {

        let data = {
          search: newVal,
          city: (this.getSelectedZone).id,
          location: this.getCurrentCoords ? this.getCurrentCoords : null
        };

        this.$store.dispatch('search/search', data);
      },
      search_results: function (newVal) {
        console.log('search_results ->'+newVal);
        this.showData = newVal;
      }
    },
    computed:{
      ...mapGetters({
        getSelectedZone: "zone/getSelectedZone",
        getCurrentCoords: "map/getCurrentCoords",
        search_results: "search/search_results"
      })
    }
  }
</script>

<style scoped lang="scss">
  .rest-search {
    position: absolute;
    top: 46px;
    left: 80px;
    right: 80px;
    z-index: 10;
    overflow: auto;
    max-height: 400px;
    box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 4px;

    @media screen and (max-width: 992px) {
      position: fixed;
      top: 53px;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      z-index: 400;
      overflow: auto;
      max-height: initial;
      box-shadow: none;
    }

    &__wrapper {
      padding: 0;
    }

    &-item {
      padding: 6px 0;
      border-bottom: 1px solid #ddd;

      &__wrapper {
        padding: 0;
      }

      &__link {
        display: grid;
        grid-template-columns: 36px 1fr;
        grid-column-gap: 16px;
        padding: 6px 16px;
        text-decoration: none;

        &:hover {
          background-color: #efefef;
        }
      }

      &__img {
        width: 36px;
        border-radius: 8px;
        overflow: hidden;
      }

      &__title {
        font-size: 20px;
        line-height: 18px;
        font-weight: bold;
        color: #262626;
        margin-bottom: 1px !important;
      }

      &__subtitle {
        line-height: 18px;
        color: #262626;
        margin-bottom: 1px !important;
      }

      &__category {
        color: #b0b0b0;
        font-size: 14px;
        margin-right: 10px;
        position: relative;

        &:after {
          content: "";
          position: absolute;
          top: 50%;
          left: calc(100% + 6px);
          transform: translateY(-50%);
          display: block;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: #ddd;
        }

        &:last-child {
          &:after {
            display: none;
          }
        }
      }

      &__price {
        color: #b0b0b0;
        font-size: 14px;
      }
    }
  }
</style>
