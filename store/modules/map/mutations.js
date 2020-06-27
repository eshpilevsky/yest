const SHOW_MAP = (state) => {
  state.data.visible = true
}

const HIDE_MAP = (state) => {
  state.data.visible = false
}

const SET_CURRENT_COORDS = (state, coords) => {
  console.log('SET_CURRENT_COORDS', coords)
  state.data.currentCoords = coords
}

const SET_CURRENT_ADDRESS = (state, address) => {
  state.data.address = address
}

const SET_INPUT_ADDRESS_MODE = (state) => {
  state.data.inputAddressMode = true
}

const UNSET_INPUT_ADDRESS_MODE = (state) => {
  state.data.inputAddressMode = false
}

const SET_GEOLOCATION_DENIED = (state) => {
  state.data.geolocationDenied = true
}

export default {
  SHOW_MAP,
  HIDE_MAP,
  SET_CURRENT_COORDS,
  SET_CURRENT_ADDRESS,
  SET_INPUT_ADDRESS_MODE,
  UNSET_INPUT_ADDRESS_MODE,
  SET_GEOLOCATION_DENIED
}
