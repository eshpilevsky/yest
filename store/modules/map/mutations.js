const SHOW_MAP = (state) => {
  console.log('SHOW_MAP -> state', state)
  state.data.visible = true
  navigator.geolocation.getCurrentPosition(() => {
    const crd = pos.coords
    console.error('getCoordinate -> crd', crd)
    const latitude = crd.latitude
    const longitude = crd.longitude
    const coords = {
      latitude: latitude,
      longitude: longitude
	}
	alert('cord')
    state.data.currentCoords = coords

  }, (error) => {
    console.warn(`ERROR(${error.code}): ${error.message}`)

  }, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  })

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
