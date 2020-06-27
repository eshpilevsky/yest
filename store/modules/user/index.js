import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  data: {
    name: String,
    selectedCategory: {
      id: null,
      alias: null
    },
    selectedCategoryTitle: 'Быстрая доставка еды в Минскe',
    searchNameKitchenDish: null,
    categoryList: {},
    userLocation: {
      locationAdress: null,
      coords: {
        latitude: 0,
        longitude: 0
      }
    },
    language: null
  },
  status: 0
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
