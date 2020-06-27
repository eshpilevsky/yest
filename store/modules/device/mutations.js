const SET_IS_MOBILE = (state) => {
  console.log("SET_IS_MOBILE")
  state.data.isMobile = true
}

const UNSET_IS_MOBILE = (state) => {
  state.data.isMobile = false
}

export default {
  SET_IS_MOBILE,
  UNSET_IS_MOBILE
}
