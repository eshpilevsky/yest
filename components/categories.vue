<template>
<div class="categories-containe sticky" v-if="!hideCategory">
    <div class="category-list">
        <div class="category-list__container">
            <v-chip active-class="category-chips--active" class="category-chips" v-for="(item, index) in first" :key="'firstCategor' + index" :color="item.alias == currentCategory.alias ? 'primary': 'white'" @click="selectCategory(item)">
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
    <div class="category-list-mobile">
        <button class="category-list-mobile-item" @click="showModalWindow()">
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
    <v-divider class="divider" />
    <v-text-field placeholder="Название, кухня или блюдо" height="46" dense clearable prepend-inner-icon="search" outlined class="searchDesktop" @focus="searchFocus" v-model="searchNameKitchenDish" @click:clear="dropSearch"></v-text-field>
    <!--    <v-text-field placeholder="Найти в Еде" height="48" clearable prepend-inner-icon="search" outlined dense filled class="searchMobile" @focus="searchFocus" v-model="searchNameKitchenDish" @click:clear="dropSearch">-->
    <!--        &lt;!&ndash; <template v-slot:append-outer v-show="this.getCurrentAddress.length > 0" >-->
    <!--            <v-btn rounded height="40px">-->
    <!--                <i class="material-icons" color='#000'>sync_alt</i>-->
    <!--            </v-btn>-->
    <!--        </template> &ndash;&gt;-->
    <!--    </v-text-field>-->
</div>
</template>

<script>
import ApiService from '../common/api.service'

import searchModal from '@/components/search-modal';

import {
    mapGetters
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
            first: [],
            second: [],
            allCategory: [],
            loadingCategories: true,
            searchNameKitchenDish: '',
            firstCategoryId: [],
            secondCategoryId: [],
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
                this.getCategories()
                this.selectedCategory = this.currentCategory
            }
		},
		currentCategory(newValue){
			return newValue
		}
    },
    computed: {
        ...mapGetters({
            getSelectedZone: 'zone/getSelectedZone',
            // currentCategory: 'user/currentCategory',
            getUserCoordinate: 'user/getUserCoordinate',
            getCurrentAddress: 'map/getCurrentAddress',
            getSearchNameKitchenDish: 'user/getSearchNameKitchenDish',
        }),
    },
    methods: {
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
    padding: 20px 80px !important;
    padding-bottom: 16px !important;
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
        padding: 10px 0;
        padding-left: 16px;
        border-top: 1px solid rgba(0, 0, 0, .1);
    }

    .searchDesktop {
        padding: 10px 10px !important;
    }
}
</style>
