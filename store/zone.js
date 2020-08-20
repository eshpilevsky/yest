import ApiService from '~/common/api.service'

export const state = () => ({
  data: {
    zone: null,
    selectedZoneId: null
  },
  status: 0
})

export const actions = {
  setZone(context, payload) {
    context.commit('SET_ZONE', payload)
  },
  setSelectedZone(context, payload) {
    context.commit('SET_SELECTED_ZONE', payload)
  }
};

export const mutations = {
  SET_ZONE(state, payload) {
    state.status = '200'
    state.data.zone = payload
  },
  SET_SELECTED_ZONE(state, payload) {
	  state.status = '200'
    state.data.selectedZoneId = payload
  }
};

export const getters = {
  getSelectedZone(state) {
    const zones = state.data.zone

    if (zones !== null) {
		return state.data.selectedZoneId
	} else {
		return zones[0];
	}

  },
  getZoneList(state) {
    return state.data.zone
  }
};

export const strict = false
