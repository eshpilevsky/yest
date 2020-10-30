import ApiService from '~/common/api.service'

export const state = () => ({
  data: {
    results: [],
  },
  status: 0
});

export const actions = {

  async search(context, payload) {
    if((payload.search).length > 2){
      let answ = {};
      await ApiService.post('/search', payload).then((res)=>{
        context.commit('SET_SEARCH_RES', res.data)
      }).catch((err)=>{
        console.error(err);
      });
    }
  }
};

export const mutations = {
  SET_SEARCH_RES(state,payload) {
    console.log('SET_SEARCH_RES');
    state.data.results = payload
    console.log(payload);
  },
};

export const getters = {
  search_results (state) {
    return state.data.results
  }
};

export const strict = false;
