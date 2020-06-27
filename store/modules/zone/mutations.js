const SET_ZONE = (state, payload) => {
  state.status = '200'
  state.data.zone = payload
}

const SET_SELECTED_ZONE = (state, payload) => {
  state.status = '200'
  state.data.selectedZoneId = payload
}

export default {
  SET_ZONE,
  SET_SELECTED_ZONE
}
