const SELECT_CATEGORY = (state, payload) => {
  state.status = '200'
  state.data.selectedCategory.id = payload.id
  state.data.selectedCategory.alias = payload.alias
  state.data.selectedCategory.name = payload.name
}

const SET_LANGUAGE = (state, payload) => {
  state.status = '200'
  state.data.language = payload
}

const SET_CATEGORY_TITLE = (state, payload) => {
  state.status = '200'
  state.data.selectedCategoryTitle = payload
}

const CATEGOTY_LIST = (state, payload) => {
  state.status = '200'
  state.data.categoryList = payload
}

const SEARCH_NAME_KITCHEN_DISH = (state, payload) => {
  state.status = '200'
  state.data.searchNameKitchenDish = payload
}
const SET_USER_LOCATION = (state, payload) => {
  state.status = '200'
  console.log(payload.coords);
  state.data.userLocation.coords.latitude = payload.coords.latitude
  state.data.userLocation.coords.longitude = payload.coords.longitude
  state.data.userLocation.locationAdress = payload.locationAdress
}
const DROP_USER_LOCATION = (state) => {
  state.status = '200'
  state.data.userLocation.coords.latitude = 0
  state.data.userLocation.coords.longitude = 0
  state.data.userLocation.locationAdress = null
}

export default {
  SELECT_CATEGORY,
  SET_LANGUAGE,
  SET_CATEGORY_TITLE,
  CATEGOTY_LIST,
  SEARCH_NAME_KITCHEN_DISH,
  SET_USER_LOCATION,
  DROP_USER_LOCATION
}
