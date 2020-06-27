const isMapVisible = (state) => {
  return state.data.visible
}

const getCurrentCoords = (state) => {
  return state.data.currentCoords
}

const getCurrentAddress = (state) => {
  return state.data.address
}

const isInputAddressMode = (state) => {
  return state.data.inputAddress
}

export default {
  isMapVisible,
  getCurrentCoords,
  getCurrentAddress,
  isInputAddressMode
}
