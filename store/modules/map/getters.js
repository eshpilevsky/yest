const isMapVisible = (state) => {
  return state.data.visible
}

const getCurrentCoords = (state) => {
  return state.data.currentCoords
}

const getCurrentAddress = (state) => {
  return state.data.address
}

const geolocationAvailable = (state) => {
  return !state.data.geolocationDenied
}

const isInputAddressMode = (state) => {
  return state.data.inputAddressMode
}

export default {
  isMapVisible,
  getCurrentCoords,
  getCurrentAddress,
  isInputAddressMode,
  geolocationAvailable
}
