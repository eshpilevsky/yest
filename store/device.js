
export const state = () => ({
  data: {
    isMobile: true
  },
  status: 0
})

export const mutations = {
  SET_IS_MOBILE(state) {
    console.log("SET_IS_MOBILE")
    state.data.isMobile = true
  },
  UNSET_IS_MOBILE(state) {
    state.data.isMobile = false
  }
};


export const getters = {
  isMobile (state) {
    return state.data.isMobile
  }
};
