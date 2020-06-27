import Vue from 'vue'
import Vuex from 'vuex'

import VuexPersistence from 'vuex-persist'
import zoneModule from './modules/zone'
import basketModule from './modules/basket'
import userModule from './modules/user'
import mapModule from './modules/map'
import deviceModule from './modules/device'

Vue.use(Vuex)

const plugins = []

// if (process.browser) {
//   plugins.push(VuexPersistence)
// }

export function createStore () {
  return new Vuex.Store({
    modules: {
      zone: zoneModule,
      basket: basketModule,
      user: userModule,
      map: mapModule,
      device: deviceModule
    },
    strict: false,
    plugins
  })
}

export default createStore
