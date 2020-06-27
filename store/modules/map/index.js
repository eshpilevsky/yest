import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  data: {
    visible: false,
    currentCoords: [],
    inputAddressMode: false,
    address: '',
    geolocationDenied: false
  },
  status: 0
}

export default {
  name: 'map',
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
