
import ApiService from '~/common/api.service'

const queryZones = (context) => {
	setTimeout(() => {
		ApiService.get(`/get-zones`).then((response) => {
			context.commit('SET_ZONE', response.data)
			if (context.getters.getSelectedZone == null) {
				context.commit('SET_SELECTED_ZONE', response.data[0].id)
			}
		}).catch((error) => {
			console.error(error)
		})
	}, 1000)
}
const setZone = (context, payload) => {
	context.commit('SET_ZONE', payload)
}

const setSelectedZone = (context, payload) => {
	context.commit('SET_SELECTED_ZONE', payload)
}

export default {
	queryZones,
	setZone,
	setSelectedZone
}
