import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    key: 'key',
    modules: [
     'user', 'zone'
    ]
  }).plugin(store)
}
