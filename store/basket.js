export const state = () => ({
  data: {
    dishs: [],
    totalPrice: 0,
  },
  status: 0
})

export const mutations = {
  SAVE_TO_BASKET(state, payload) {
	state.status = '200'
	payload.counter = 1
    console.log('SAVE_TO_BASKET -> payload', payload)
	state.data.dishs.push(payload)
    console.log('SAVE_TO_BASKET -> state.data.dishs', state.data.dishs)
  },
  DROP_BASKET(state) {
    state.status = '200'
	state.data.dishs = []
  },
  INCREMENT_DISH(state, payload) {
    state.status = '200'
    let result = dishList.find((dish) => {
      if (dish.id === payload.id) {
        dish.size[0].count++;
      }
    })
  },
};

export const actions = {
  async addToBasket(context, payload) {
		let list = context.state.data.dishs

      context.commit('SAVE_TO_BASKET', payload)
  },
  dropBasket(context) {
      context.commit('DROP_BASKET')
  },
};

export const getters = {
  getSelectedDishs(state) {
    return state.data.dishs
  },
  getTotalPrice(state) {
	let dl = state.data.dishs
	let totalPrice = 0
	dl.forEach(element => {
		totalPrice += element.sizes[0].price
        console.log('getTotalPrice -> element.sizes[0].price', element.sizes[0].price)
        console.log('getTotalPrice -> totalPrice', totalPrice)
	});
	return totalPrice.toFixed(2)
    // return state.data.totalPrice
  },
};
