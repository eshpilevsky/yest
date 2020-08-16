import Vue from 'vue';
import VuexPersistence from 'vuex-persist'
Vue.use(VuexPersistence);

export default ({ store }) => {
  new VuexPersistence({
	key: 'yest',
	modules: [
	  'user', 'zone', 'map', 'device', 'basket'
	]
  }).plugin(store)
}



// export default ({
//   store
// }) => {
//   window.onNuxtReady(() => {
//     new VuexPersistence({
//       key: 'yest',
//       modules: [
//         'user', 'zone', 'map', 'device', 'basket'
//       ]
//     }).plugin(store);
//   });
// }
