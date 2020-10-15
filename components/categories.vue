<template>
<div class="categories-containe sticky" v-if="!hideCategory">
    <div class="category-list">
        <div class="category-list__container">
            <v-chip active-class="category-chips--active" class="category-chips" v-for="(item, index) in first" :key="'firstCategor' + index" :color="item.alias == currentCategory.alias ? 'primary': 'white'" @click="selectCategory(item); restOverlay = !restOverlay;">
                <div class="category-name">
                    {{ item.name }}
                </div>
            </v-chip>
            <v-menu offset-y max-height="200px">
                <template v-slot:activator="{ on }">
                    <v-chip v-on="on" class="category-chips" :color="more.isMore === true ? 'primary': 'white'">
                        <span class="category-name">
                            {{ more.text }}
                        </span>
                        <v-icon color="secondary">
                            keyboard_arrow_down
                        </v-icon>
                    </v-chip>
                </template>
                <v-list class="list-component">
                    <v-list-item v-for="(item, index) in second" :key="'secondCategor' + index" class="more-category-list" @click="selectCategory(item)">
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <!-- <v-menu offset-y top :close-on-content-click="false" v-model="sortMenu" v-show="this.getCurrentAddress.length > 0">
            <template v-slot:activator="{ on }">
                <v-btn rounded dense depressed class="sort-btn category-chips" v-on="on">
                    <v-icon left>
                        sort
                    </v-icon>
                    Сортировка
                </v-btn>
            </template>
            <div class="sort-block">
                <div class="sort-title">
                    Какие показать сначала?
                </div>
                <v-radio-group>
                    <v-radio color="primary" v-for="item in sortText" :key="'sort' + item.value" :label="`${item.name}`" :value="item.value" class="radio-item"></v-radio>
                </v-radio-group>
                <v-divider />
                <div class="sort-block-bottom">
                    <v-btn color="primary" class="show-sort-btn" @click="sortMenu = false">
                        Показать
                    </v-btn>
                </div>
            </div>
        </v-menu> -->
    </div>
    <div id="mobile-categories-block" class="category-list-mobile">
      <button class="category-list-mobile-item category-list-mobile-item--first" @click="showModalWindow()">
        <span class="item-name" style="width: 48px;">
            <v-icon>search</v-icon>
        </span>
      </button>
      <div v-for="(item, index) in allCategory" :key="'adaptiveCatList' + index" v-show="item.category_icon" class="category-list-mobile-item" @click="selectCategory(item)">
        <v-chip :class="{selected: item.id === currentCategory.id}" class="item-name">
          {{ item.name }}
        </v-chip>
      </div>
      <v-overlay :value="showModalOverlay" :dark="false">
        <searchModal @closeModalWindow='showModalWindow()' />
      </v-overlay>
    </div>
    <!--<v-divider class="divider" />-->
  <div class="rest-search">
      <v-text-field placeholder="Название, кухня или блюдо" height="46" dense clearable prepend-inner-icon="search" outlined class="searchDesktop" @focus="searchFocus" v-model="searchNameKitchenDish" @click:clear="dropSearch"></v-text-field>
      <v-text-field placeholder="Найти в Еде" height="48" clearable prepend-inner-icon="search" outlined dense filled class="searchMobile" @focus="searchFocus" v-model="searchNameKitchenDish" @click:clear="dropSearch">
      <template v-slot:append-outer v-show="this.getCurrentAddress.length > 0" >
        <v-btn rounded height="40px">
          <i class="material-icons" color='#000'>sync_alt</i>
        </v-btn>
      </template>

    <div v-show="searchNameKitchenDish.length > 2 && SearchSuggestions.length > 0" class="rest-search__list">
      <v-list class="rest-search__wrapper">
        <v-list-item v-for="(item, index) in SearchSuggestions" :key="'SearchSuggestion'+index" class="rest-search-item">
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
      </v-text-field>
  </div>


  <v-overlay :value="restOverlay" z-index="100">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</div>
</template>

<script>
import ApiService from '../common/api.service'

import searchModal from '@/components/search-modal';

import {
    mapGetters,
    mapActions
} from 'vuex'

export default {
    name: 'Categories',
    props: {
      categoriesList: Array,
		  currentCategory: Object,
		  currentZone: Object,
    },
    components: {
        searchModal,
    },
    data() {
        return {
            restOverlay: false,
            first: [],
            second: [],
            allCategory: [],
            loadingCategories: true,
            searchNameKitchenDish: '',
            firstCategoryId: [],
            secondCategoryId: [],
            SearchSuggestions: [{},{},{},{}],
            ww: 0,
            sliceCounter: 9,
            sortText: [{
                    name: 'Доверюсь вам',
                    value: 1
                },
                {
                    name: 'С высоким рейтингом',
                    value: 2
                },
                {
                    name: 'Быстрые',
                    value: 3
                },
                {
                    name: 'Недорогие',
                    value: 4
                },
                {
                    name: 'Дорогие',
                    value: 5
                }
            ],
            categoryAll: [{
                name: 'Все',
                id: 0,
                alias: 'all'
            }],
            more: {
                text: 'Eщё',
                id: -1,
                isMore: false
            },
            sortMenu: false,
            defaultBg: 'https://yastatic.net/s3/eda-front/prod-www/assets/default-d3a889e26c9ac9089ce5b007da1ac51b.png',
            oldCategoryImg: null,
            hideCategory: false,
            selectedCategory: null,
            showModalOverlay: false,
        }
    },
    watch: {
        getSelectedZone(newValue, oldValue) {
            if (newValue.id !== oldValue.id) {
                this.selectedCategory = this.currentCategory
            }
		    },
        currentCategory(newValue){
          return newValue
        },
        getSearchResults(newValue){
          this.SearchSuggestions = newValue;
        },
        async searchNameKitchenDish(newValue){
          if(newValue.length > 3){

            await this.Action__SearchSuggestions({
              address: newValue,
              city: this.currentZone.id
            });
          }
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: 'zone/getSelectedZone',
            // currentCategory: 'user/currentCategory',
            getCurrentAddress: 'map/getCurrentAddress',
            getSearchNameKitchenDish: 'user/getSearchNameKitchenDish',
            getSearchResults: 'user/getSearchResults'
        }),
    },
    methods: {
      ...mapActions({
        Action__SearchSuggestions: 'user/SearchSuggestions',
      }),
        showModalWindow() {
            this.showModalOverlay = !this.showModalOverlay
        },
        selectCategory(item) {
            if (this.currentCategory.id == item.id) {
              this.$router.push(`/${this.currentZone.alias}`)
            } else {
              this.$router.push(`/${this.currentZone.alias}/restaurants/category/${item.alias}`)
            }
        },
        dropSearch() {
			this.searchNameKitchenDish = ''
            this.$store.dispatch('user/setSearchNameKitchenDish', null)
        },
        searchFocus() {
            // const si = document.getElementById('searchDesktop')
            // const possi = si.getBoundingClientRect().top
            // window.scrollTo(0, si.getBoundingClientRect().top - 210)
        }
    },
    created() {


        this.selectedCategory = this.$route.params.alias
        this.allCategory = this.categoriesList
        this.first = this.allCategory.slice(0, this.sliceCounter)
		    this.second = this.allCategory.slice(this.sliceCounter, this.categoriesList.length)

		let checkMore = this.first.find((cat)=>{
			return cat.id == this.currentCategory.id
		})
		if (checkMore == undefined) {
			this.more= {
                text: this.currentCategory.name,
                id: this.currentCategory.id,
                isMore: true
            }
		} else {
			this.more= {
                text: 'Ещё',
                id: -1,
                isMore: false
            }
		}
    },
    mounted() {
      // Прокрутка до активной категории

      let mobileCategories = document.getElementById("mobile-categories-block");
      let childs = mobileCategories.childNodes;
      let need_element = undefined;
      let ScrollWidth = 0;

      childs.forEach((element)=>{
        (element.childNodes).forEach((elementChild)=>{
          if(need_element === undefined){
            let className = elementChild.className;

            if(className.match('selected') != null){
              need_element = element;
            }else {

              ScrollWidth += elementChild.offsetWidth+8;
              // console.log(elementChild.offsetWidth);
            }
          }
        });
        // console.log(element);
      });
      // console.log(ScrollWidth);
      // console.log(need_element);

      let need_scroll_width = ScrollWidth - 25;


      mobileCategories.scrollLeft = need_scroll_width;








        this.hideCategory = false
        this.ww = window.innerWidth
        if (this.getSearchNameKitchenDish !== null) {
            this.searchNameKitchenDish = this.getSearchNameKitchenDish
        }
        if (this.windoWidth < 1300) {
            this.sliceCounter -= 2
            if (this.windoWidth < 1000) {
                this.sliceCounter -= 2
                if (this.windoWidth < 850) {
                    this.sliceCounter -= 2
                }
            }
        }
    }
}
</script>

<style>
.category-chips.primary .category-name {
  color: #fff !important;
}

/* .v-text-field.v-text-field--enclosed .v-text-field__details {
    display: none !important;
} */

.searchDesktop .v-input__control .v-input__slot .v-input__prepend-inner {
    margin-top: 11px !important;
}

.theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)>.v-input__control>.v-input__slot fieldset {
    color: rgba(0, 0, 0, .1) !important;
}

.v-menu__content {
    overflow-y: scroll !important;
}

.v-text-field__details {
    margin-bottom: 0 !important;
    min-height: initial !important;
    padding: 0 !important;
    height: initial;
}

@media screen and (max-width: 992px) {
    .v-input__prepend-inner {
        margin-top: 13px !important;
    }

    .v-text-field--outlined fieldset {
        opacity: 0;
    }

    fieldset {
        border: 0px solid !important;
        opacity: .1 !important;
    }
}
</style><style scoped>

.list-component {
    overflow: scroll;
}

.sort-block-bottom {
    padding: 20px;
}

.show-sort-btn {
    width: 100%;
    color: #000000 !important;
    height: 100%;
    border: none;
    padding: 0 24px;
    display: inline-block;
    overflow: hidden;
    font-size: 16px;
    min-height: 41px;
    font-weight: normal;
    user-select: none;
    border-radius: 4px;
    text-transform: none !important;
}

.radio-item {
    cursor: pointer;
    height: 58px;
    display: flex;
    align-items: center;
    margin: 0 40px;
}

.sort-title {
    color: #000000;
    padding: 40px 40px 15px 40px;
    font-size: 20px;
    font-weight: bold;
    line-height: 1.15;
}

.sort-block {
    background: #fff;
}

.sort-btn {
    text-transform: none !important;
}

.searchDesktop {
    padding: 0 80px 6px!important;
    border-bottom: 4px solid rgba(245, 245, 245, 0.6);
}

.selected {
    background-color: #00a646 !important;
    background: #00a646 !important;
    color: #fff !important;
}

.more-category-list:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, .1);
}

.category-list-loading {
    margin: 10px 15px;
}

.category-list {
    padding: 20px 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 90%;
    margin: auto;
}

.category-list__container {
    display: flex;
    align-items: center;
    width: 100%;
}

.categories-containe {
    width: 100%;
    max-width: 1420px;
    margin: auto;
    border-left: 1px solid rgba(0, 0, 0, .1);
    border-right: 1px solid rgba(0, 0, 0, .1);
    background: #fff;
}

.divider {
    margin: 0px 0;
    border-color: rgba(0, 0, 0, .05) !important;
}

.category-name {
    margin: 5px 0;
    cursor: pointer;
    line-height: 46px;
    font-weight: 400;
    font-size: 16px;
    color: #000 !important;
    white-space: nowrap;
}

.category-chips {
    height: 46px !important;
    padding: 0 18px;
    display: block;
    line-height: 46px;
    border-radius: 22px !important;
    margin-right: 4px;
}

.category-list-mobile-loading {
    display: none;
}

.category-list-mobile {
    display: none;
}

.category_icon {
    max-width: 75px;
    max-height: 75px;
}

.category-list-mobile-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    outline: none;
}

.category-list-mobile-item--first {
  position: absolute;
  top: 1px;
  left: 0;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  padding-left: 10px;
}

.item-name {
    min-height: 48px;
    display: flex;
    font-size: 16px !important;
    transition: background-color 100ms;
    align-items: center;
    flex-shrink: 0;
    margin-right: 8px;
    border-radius: 16px;
    justify-content: center;
    background-color: #e0e0e0;
    padding: 0 12px;
}

.searchMobile {
    display: none;
}

/*@media screen and (max-width: 768px) {*/
/*.searchDesktop {*/
/*margin: 10px 20px 0px 20px !important;*/
/*}*/
/*}*/

@media screen and (max-width: 992px) {

    .sticky {
        position: sticky;
        top: 64px;
        z-index: 3;
    }

    .divider {
        display: none;
    }

    .searchMobile {
        display: flex;
        padding-top: 20px !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
        border-radius: 15px !important;
        border: none !important;
        width: 100% !important;
        height: 75px !important;
        margin-top: -15px !important;
    }

    .searchDesktop {
        display: none;
    }

    .category-list-mobile-loading {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
    }

    .category-list {
        display: flex;
        flex-direction: column;
    }

    .category-chips {
        margin: 3px 0;
        text-align: center;
    }

    .category-name {
        text-align: center;
        width: 100%;
    }

    .category-list {
        display: none;
    }

    .category-list-mobile {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-items: flex-start;
      max-width: 992px;
      overflow: hidden;
      overflow-x: auto;
      padding: 10px 0 10px 66px;
      border-top: 1px solid rgba(0, 0, 0, .1);
    }

    .searchDesktop {
        padding: 10px 10px !important;
    }
}
</style>

<style scoped lang="scss">
  .rest-search {
    position: relative;

    &__list {
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
