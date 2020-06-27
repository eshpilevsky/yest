import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  data: {isMobile: true},
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
