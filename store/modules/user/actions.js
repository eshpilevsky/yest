import axios from 'axios'

const selectCategory = (context, payload) => {
  context.commit('SELECT_CATEGORY', payload)
}

const setLanguage = (context, payload) => {
  context.commit('SET_LANGUAGE', payload)
}

const setSelectedCategoryTitle = (context, payload) => {
  context.commit('SET_CATEGORY_TITLE', payload)
}

const setSearchNameKitchenDish = (context, payload) => {
  context.commit('SEARCH_NAME_KITCHEN_DISH', payload)
}

const allCategory = (context, payload) => {
  context.commit('CATEGOTY_LIST', payload)
}

const setUserLocation = (context, payload) => {
  context.commit('SET_USER_LOCATION', payload)
}

const dropUserLocation = (context) => {
  context.commit('DROP_USER_LOCATION')
}

export default {
  selectCategory,
  setLanguage,
  setSelectedCategoryTitle,
  setSearchNameKitchenDish,
  allCategory,
  setUserLocation,
  dropUserLocation
}
