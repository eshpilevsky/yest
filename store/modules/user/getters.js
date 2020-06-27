const getSelectedCategory = (state) => {
  return state.data.selectedCategory
}

const getUserCoordinate = (state) => {
  const mass = {
    latitude: state.data.userLocation.coords.latitude,
    longitude: state.data.userLocation.coords.longitude
  }
  return mass
}

const getLocale = (state) => {
  return state.data.language
}

const getSelectedCategoryTitle = (state) => {
  return state.data.selectedCategoryTitle
}

const getCategoryList = (state) => {
  return state.data.categoryList
}

const getSearchNameKitchenDish = (state) => {
  return state.data.searchNameKitchenDish
}

const getSelectedCategoryName = (state) => {
  const catList = state.data.categoryList
  const selectCategoryId = state.data.selectedCategory.id
  let test = ''
  for (let index = 0; index < catList.length; index++) {
    if (catList[index].id === selectCategoryId) {
      test = catList.name
    }
  }
  return test
}

const getUserLocation = (state) => {
  return state.data.userLocation
}

export default {
  getSelectedCategory,
  getLocale,
  getSelectedCategoryTitle,
  getCategoryList,
  getSearchNameKitchenDish,
  getSelectedCategoryName,
  getUserLocation,
  getUserCoordinate
}
