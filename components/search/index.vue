<template>
  <div v-show=" this.searchText.length > 2 && showData.length > 0" class="rest-search">
   <!--SEARCH ->> {{searchText}}-->
    <v-list class="rest-search__wrapper">
      <v-list-item v-for="(item, index) in showData" :key="'SearchSuggestion'+index" class="rest-search-item">
        <v-list-item-content class="rest-search-item__wrapper">

          <!-- Это вид с изображением и с категориями -->
          <nuxt-link :to="get_rest_url({name: item.name, restaurant_id: item.id})" class="rest-search-item__link">
            <img class="rest-search-item__img" src="https://via.placeholder.com/150" alt="placeholder">
            <div class="rest-search-item__content">
              <p class="rest-search-item__title">{{item.name}}</p>
              <p class="rest-search-item__categories">
                <span class="rest-search-item__category"  v-for="(tag, index) in item.tags">{{tag.name}}</span>
              </p>
            </div>
          </nuxt-link>

          <!-- Это вид без изображения, но с ценником -->
          <nuxt-link :to="get_rest_url({name: item.name, restaurant_id: item.id})" class="rest-search-item__link" v-for="(dish, index) in item.dishes ">
            <span></span>
            <div class="rest-search-item__content">
              <p class="rest-search-item__subtitle">{{dish.name}}</p>
              <p class="rest-search-item__price">{{dish.price}} BYN</p>
            </div>
          </nuxt-link>



        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>


<script>
  import {mapGetters} from "vuex";

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
    methods:{
      translite(str){
        let text = this.to_latin(str);
        return text.toLowerCase();
      },
      to_latin(str) {
        str = str.replace(/\n/, "");
        str = str.replace(/\r/, "");
        str = str.replace(/\s+/, " ");
//   str = str.replace(/[^0-9a-z-_ ]/i, "");

        const ru = new Map([
          ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'],
          ['є', 'e'], ['ё', 'e'], ['ж', 'j'], ['з', 'z'], ['и', 'i'], ['ї', 'yi'], ['й', 'i'],
          ['к', 'k'], ['л', 'l'], ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'],
          ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'], ['х', 'h'], ['ц', 'c'], ['ч', 'ch'],
          ['ш', 'sh'], ['щ', 'shch'], ['ы', 'y'], ['э', 'e'], ['ю', 'u'], ['я', 'ya'],
        ]);

        str = str.replace(/[ъь]+/g, '');

        return Array.from(str)
          .reduce((s, l) =>
            s + (
              ru.get(l)
              || ru.get(l.toLowerCase()) === undefined && l
              || ru.get(l.toLowerCase()).toUpperCase()
            )
            , '');

      },
      get_rest_url(info){
        // return 'minsk';
        let name = this.translite(info.name);
        let modifName = name.replace(' ', '-');
        return `/${this.getSelectedZone.alias}/restaurant/${info.restaurant_id}-${modifName.toLowerCase()}`;
      },
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
