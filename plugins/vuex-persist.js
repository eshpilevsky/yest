import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
	key: 'yest',
	modules: [
	  'user', 'zone', 'map', 'device', 'basket'
	]
  }).plugin(store)
}
