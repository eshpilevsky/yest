import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  data: {
    visible: false,
    currentCoords: [],
    inputAddress: false,
    address: ''
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
