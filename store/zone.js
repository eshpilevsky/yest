import ApiService from '~/common/api.service'

export const state = () => ({
  data: {
    zone: null,
    selectedZoneId: null
  },
  status: 0
})

export const mutations = {
  SET_ZONE(state, payload) {
	state.status = '200'
	console.log(state.data.selectedZoneId);
	if (state.data.selectedZoneId == null) {
		state.data.selectedZoneId = payload[0]
	}
    state.data.zone = payload
  },
  SET_SELECTED_ZONE(state, payload) {
    state.status = '200'
    state.data.selectedZoneId = payload
  }
};

export const actions = {
  setZone(context, payload) {
    context.commit('SET_ZONE', payload)
  },
  setSelectedZone(context, payload) {
    context.commit('SET_SELECTED_ZONE', payload)
  }
};

export const getters = {
  getSelectedZone(state) {
	const zones = state.data.zone
    let find = {
      alias: 'minsk',
      id: 1,
      name: 'Минск'
    }
    if (zones !== null) {
      zones.forEach((element) => {
        if (element.id === (state.data.selectedZoneId == null ? 0 : state.data.selectedZoneId)) {
          find = element
        }
      })
    }
	return find
  },
  getZoneList(state) {
    return state.data.zone
  }
};
