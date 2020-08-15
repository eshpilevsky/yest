// import VuexPersistence from 'vuex-persist'

// export default ({ store }) => {
//   new VuexPersistence({

//   }).plugin(store)
// }

import VuexPersistence from 'vuex-persist'

export default ({
  store
}) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      key: 'yest',
      modules: [
        'user', 'zone', 'map', 'device', 'basket'
      ]
    }).plugin(store);
  });
}
