import ApiService from '~/common/api.service'

export const state = () => ({
  data: {
    results: [],
  },
  status: 0
});

export const actions = {

  async search(context, payload) {
    console.log(payload);

    if((payload.search).length > 2){
      await ApiService.post('/search', payload).then((res)=>{
        console.log(res);
        context.commit('SET_SEARCH_RES', res);
      }).catch((err)=>{
        console.error(err);
      });
    }


  }
};

export const mutations = {
  SET_SEARCH_RES(state) {
    state.data.results = state
  },
};

export const getters = {
  search_results (state) {
    return state.data.results
  }
};

export const strict = false;
