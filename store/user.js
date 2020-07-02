export const state = () => ({
  data: {
    name: null,
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
})

export const mutations = {
  SELECT_CATEGORY(state, payload) {
    state.status = '200'
    state.data.selectedCategory.id = payload.id
    state.data.selectedCategory.alias = payload.alias
    state.data.selectedCategory.name = payload.name
  },

  SET_LANGUAGE(state, payload) {
    state.status = '200'
    state.data.language = payload
  },

  SET_CATEGORY_TITLE(state, payload) {
    state.status = '200'
    state.data.selectedCategoryTitle = payload
  },

  CATEGOTY_LIST(state, payload) {
    state.status = '200'
    state.data.categoryList = payload
  },

  SEARCH_NAME_KITCHEN_DISH(state, payload) {
    state.status = '200'
    state.data.searchNameKitchenDish = payload
  },
  SET_USER_LOCATION(state, payload) {
    state.status = '200'
    console.log(payload.coords);
    state.data.userLocation.coords.latitude = payload.coords.latitude
    state.data.userLocation.coords.longitude = payload.coords.longitude
    state.data.userLocation.locationAdress = payload.locationAdress
  },
  DROP_USER_LOCATION(state) {
    state.status = '200'
    state.data.userLocation.coords.latitude = 0
    state.data.userLocation.coords.longitude = 0
    state.data.userLocation.locationAdress = null
  }
};

export const actions = {

  selectCategory(context, payload) {
    context.commit('SELECT_CATEGORY', payload)
  },

  setLanguage(context, payload) {
    context.commit('SET_LANGUAGE', payload)
  },

  setSelectedCategoryTitle(context, payload) {
    context.commit('SET_CATEGORY_TITLE', payload)
  },

  setSearchNameKitchenDish(context, payload) {
    context.commit('SEARCH_NAME_KITCHEN_DISH', payload)
  },

  allCategory(context, payload) {
    context.commit('CATEGOTY_LIST', payload)
  },

  setUserLocation(context, payload) {
    context.commit('SET_USER_LOCATION', payload)
  },

  dropUserLocation(context) {
    context.commit('DROP_USER_LOCATION')
  }

};

export const getters = {
  getSelectedCategory(state) {
    return state.data.selectedCategory
  },
  getUserCoordinate(state) {
    const mass = {
      latitude: state.data.userLocation.coords.latitude,
      longitude: state.data.userLocation.coords.longitude
    }
    return mass
  },
  getSelectedCategoryTitle(state) {
    return state.data.selectedCategoryTitle
  },
  getCategoryList(state) {
    return state.data.categoryList
  },
  getSearchNameKitchenDish(state) {
    return state.data.searchNameKitchenDish
  },
  getSelectedCategoryName(state) {
    const catList = state.data.categoryList
    const selectCategoryId = state.data.selectedCategory.id
    let test = ''
    for (let index = 0; index < catList.length; index++) {
      if (catList[index].id === selectCategoryId) {
        test = catList.name
      }
    }
    return test
  },
  getUserLocation(state) {
    return state.data.userLocation
  }
};
