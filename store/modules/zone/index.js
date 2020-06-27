import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  data: {
    zone: null,
    selectedZoneId: null
  },
  status: 0
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
