<template>
<div class="categories-containe sticky" v-if="!hideCategory">
    <div class="category-list">
        <div class="category-list__container">
            <v-chip active-class="category-chips--active" class="category-chips" v-for="(item, index) in first" :key="'firstCategor' + index" :color="item.alias == getSelectedCategory.alias ? 'primary': 'white'" @click="selectCategory(item, false)">
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
                    <v-list-item v-for="(item, index) in second" :key="'secondCategor' + index" class="more-category-list" @click="selectCategory(item, true)">
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
        <div v-for="(item, index) in allCategory" :key="'adaptiveCatList' + index" v-show="item.category_icon" class="category-list-mobile-item" @click="selectCategoryAdaptive(item, false)">
            <v-chip :class="{selected: item.id === getSelectedCategory.id}" class="item-name">
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
                this.selectedCategory = this.getSelectedCategory
            }
        }
    },
    computed: {
        ...mapGetters({
            getSelectedZone: 'zone/getSelectedZone',
            getSelectedCategory: 'user/getSelectedCategory',
            getUserCoordinate: 'user/getUserCoordinate',
            getCurrentAddress: 'map/getCurrentAddress',
            getSearchNameKitchenDish: 'user/getSearchNameKitchenDish',
        }),
    },
    methods: {
        showModalWindow() {
            this.showModalOverlay = !this.showModalOverlay
        },
        getCategories() {
            this.hideCategory = false
            ApiService.post('/categories', {
                zone_id: this.getSelectedZone.id
            }).then((response) => {
                const resp = response.data
                const allCategory = this.categoryAll.concat(response.data)
                if (allCategory.length == 1) {
                    this.$store.dispatch('user/setSelectedCategoryTitle', null)
                    this.loadingCategories = false
                    this.hideCategory = true
                } else {
                    this.$store.dispatch('user/allCategory', allCategory)
                    if (this.getSelectedCategory.id === null) {
                        this.$store.dispatch('user/selectCategory', {
                            id: allCategory[0].id,
                            alias: allCategory[0].alias
                        })
                        this.$store.dispatch('user/setSelectedCategoryTitle', `Быстрая доставка еды в ${this.getSelectedZone.name}`)
                    } else {
                        this.selectCategory(this.getSelectedCategory, false)
                    }
                    this.allCategory = resp
                    this.first = allCategory.slice(0, this.sliceCounter)
                    this.second = allCategory.slice(this.sliceCounter, resp.length)
                    var qwe = this.first.find((category) => {
                        if (category.id === this.getSelectedCategory.id) {
                            return true
                        }
                    })
                    if (qwe === undefined) {
                        this.more.text = this.getSelectedCategory.name
                        this.more.id = this.getSelectedCategory.id
                        this.more.isMore = true
                    }
                    this.loadingCategories = false
                }
            }).catch((error) => {
                console.error(error)
            })
        },
        selectCategoryAdaptive(selectCategory, boll) {
            if (selectCategory.id == this.getSelectedCategory.id) {
                this.selectCategory({
                    name: 'Все',
                    id: 0,
                    alias: 'all'
                }, true)
            } else {
                this.selectCategory(selectCategory, boll)
            }
        },
        selectCategory(item, boll) {
            // this.$store.dispatch('user/selectCategory', {
            //     id: item.id,
            //     alias: item.alias,
            //     name: item.name
            // })
            // this.$router.push(`/${this.getSelectedZone.alias}/restaurants/category/${item.alias}`)

            this.oldCategoryImg = document.getElementById('bgImg') ? document.getElementById('bgImg') : null
            if (item.id !== 0) {
                if (boll === true) {
                    this.more.text = item.name
                    this.more.id = item.id
                    this.more.isMore = true
                } else {
                    this.more.text = 'Ещё'
                    this.more.id = -1
                    this.more.isMore = false
                }
                ApiService.post('/categories/info', {
                    zone_id: this.getSelectedZone.id,
                    category_id: item.id
                }).then((response) => {
                    if (response.status === 200) {
                        const respData = response.data
                        if (respData.hasOwnProperty('status')) {
                            if (response.data.status === 404) {
                                this.$store.dispatch('user/setSelectedCategoryTitle', 'Бесплатная и быстрая доставка')
                                this.$store.dispatch('user/selectCategory', {
                                    id: item.id,
                                    alias: item.alias,
                                    name: item.name
                                })
                                if (this.oldCategoryImg != null) {
                                    // this.oldCategoryImg.style.backgroundImage = '-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))),  url("' + this.defaultBg + '");'
                                    this.oldCategoryImg.setAttribute('style', 'background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))), url("' + this.defaultBg + '");')
                                }
                                if (item.id === 0) {
                                    this.$router.push(`/${this.getSelectedZone.alias}`)
                                } else {
                                    this.$router.push(`/${this.getSelectedZone.alias}/restaurants/category/${item.alias}`)
                                }
                            }
                        } else {
                            this.$store.dispatch('user/selectCategory', {
                                id: item.id,
                                alias: response.data.alias,
                                name: item.name
                            })
                            this.$store.dispatch('user/setSelectedCategoryTitle', response.data.header + ' в ' + response.data.city)
                            var bg = response.data.background

                            if (window.innerWidth > 992) {
                                if (this.oldCategoryImg != null) {
									let currentBg = bg == '' ? this.defaultBg : bg
                                    this.oldCategoryImg.setAttribute('style', 'background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))), url("' + currentBg + '");')
                                    // this.oldCategoryImg.style.backgroundImage = '-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))),  url("' + this.bg + '");'
                                }
                            } else {
                                if (this.oldCategoryImg != null) {
                                    this.oldCategoryImg.setAttribute('style', 'background-image: url("' + response.data.category_icon + '");')
                                    // this.oldCategoryImg.style.backgroundImage = '-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))),  url("' + response.data.category_icon + '");'
                                }
                            }
                            if (item.id === 0) {
                                this.$router.push(`/${this.getSelectedZone.alias}`)
                            } else {
                                this.$router.push(`/${this.getSelectedZone.alias}/restaurants/category/${response.data.alias}`)
                            }
                        }
                    }
                }).catch((error) => {
                    console.error(error)
                })
            } else {
                if (window.innerWidth < 992) {
                    if (this.oldCategoryImg != null) {
                        // this.oldCategoryImg.style.backgroundImage = 'url("https://menu-menu.by/images/category_icons/new/4529d57df6bc970d11c1f3496296d99b-200x200.jpg");'
                        this.oldCategoryImg.setAttribute('style', 'background-image: url("https://menu-menu.by/images/category_background/mobile/pizza.jpg");')
                    }
                } else {
                    if (this.oldCategoryImg != null) {
                        this.oldCategoryImg.setAttribute('style', 'background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))), url("' + this.defaultBg + '");')
                        // this.oldCategoryImg.style.backgroundImage = '-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))),  url("' + this.defaultBg + '");'
                    }
                }
                this.$store.dispatch('user/selectCategory', {
                    id: 0,
                    alias: item.alias,
                    name: item.name
                })
                this.$router.push(`/${this.getSelectedZone.alias}`)
                this.$store.dispatch('user/setSelectedCategoryTitle', `Быстрая доставка в ${this.getSelectedZone.name}`)
            }
        },
        dropSearch() {
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
    },
    mounted() {
        // this.getCategories()
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
    margin-bottom: 0;
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
