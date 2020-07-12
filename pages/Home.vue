<template>
  <div style="padding-bottom: 0px">
    <setAdress v-if="showSetAdress" />
	<specialOffers v-show="getCurrentAddress.length > 0"/>
	<categories/>
	<mobileSearch v-show="showSearch" />
	<restorans/>
  </div>
</template>

<script>

import setAdress from '~/components/setAdress'
import categories from '~/components/categories.vue'
import specialOffers from '~/components/specialOffers.vue'
import restorans from '~/components/restorans.vue'
import mobileSearch from '~/components/mobileSearch.vue'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'Home',
  components: {
    categories,
    specialOffers,
    restorans,
    mobileSearch,
    setAdress
  },
  data () {
    return {
      showSearch: false,
      showSetAdress: true,
      showSpecialOffer: false,
    }
  },
  watch: {
    showSearch (newValue, oldValue) {
      return newValue
    },
  },
  computed: {
    ...mapGetters({
      selectedZoneId: 'zone/getSelectedZone',
      getZoneList: 'zone/getZoneList',
      getCategoryList: 'user/getCategoryList',
      getCurrentAddress: "map/getCurrentAddress",
    })
  },
  mounted () {
    // this.redirectCategoryByUrl()
    let lastScrollTop = 0
    if (window.innerWidth < 450) {
      window.addEventListener('scroll', () => {
        const st = window.pageYOffset || document.documentElement.scrollTop
        if (st > lastScrollTop) {
          // downscroll code
          this.showSearch = false
        } else if (st > 400) {
          this.showSearch = true
        } else {
          this.showSearch = false
        }
        lastScrollTop = st <= 0 ? 0 : st
      })

      if (this.getCurrentAddress.length > 0) {
        this.showSetAdress = false
      } else {
        this.showSetAdress = true
      }
    }
  },
  methods: {

    redirectCategoryByUrl () {
      const findZone = this.getZoneList.find((zone) => {
        if (zone.alias === this.$route.params.region) {
          return zone.id
        }
      })
      const findCategory = this.getCategoryList.find((category) => {
        if (category.alias === this.$route.params.alias) {
          return category
        }
      })
      if (findZone !== undefined) {
        this.$store.dispatch('zone/setSelectedZone', findZone.id)
      }
      if (findCategory !== undefined) {
        this.$store.dispatch('user/selectCategory', findCategory)
      } else {
        this.$store.dispatch('user/selectCategory', {
          id: 0,
          alias: 'all',
          name: 'Все'
        })
      }
    }
  }
  // metaInfo: {
  // 	title: 'Быстрая Доставка еды из кафе и ресторанов Минска, Беларусь - Главная Минск, Беларусь - Menu.by',
  // 	meta: [{ // set meta
  // 		name: 'keyWords',
  // 		content: 'My Example App'
  // 	}]
  // }
}
</script>

<style scoped>
.home-container {
    position: relative;
    z-index: 1;
}
</style>
