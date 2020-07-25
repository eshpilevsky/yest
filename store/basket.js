export const state = () => ({
  data: {
	dishs: Array,
	totalPrice: 0,
  },
  status: 0
})

export const mutations = {
	SAVE_TO_BASKET(state, payload) {
		state.status = '200'
		state.data.dishs.push(payload)
	  },
	INCREMENT_DISH(state, payload) {
		state.status = '200'
		let result = dishList.find((dish) => {
			if(dish.id === payload.id){
				dish.size[0].count++;
			}
		})
	  },
};

export const actions = {
	async addToBasket(context, payload) {
        // console.error('addToBasket -> payload', payload)
		let dishList = context.state.data.dishs
		console.log('addToBasket -> dishList', dishList)
		let result = await dishList.find((dish) => {
			if(dish.id === payload.id){
				context.commit('INCREMENT_DISH', payload)
			}
		})
		if (result == undefined) {
			context.commit('SAVE_TO_BASKET', payload)
		}
		
		// context.commit('SELECT_CATEGORY', payload)
	  },
};

export const getters = {
	getSelectedDishs(state) {
		return state.data.dishs
	  },
	getTotalPrice(state) {
		return state.data.totalPrice
	  },
};
