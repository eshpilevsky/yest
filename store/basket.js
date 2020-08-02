export const state = () => ({
  data: {
    restuarantUrl: null,
    dishs: [],
    totalPrice: 0,
  },
  status: 0
})

export const actions = {
  async addToBasket(context, payload) {
    let list = context.state.data.dishs
    let findDish = list.find((dish) => {
      if (dish.id == payload.id) {
        return dish
      }
    })
    if (findDish == undefined) {
      context.commit('SAVE_TO_BASKET', payload)
    } else{
		context.commit('INCREMENT_DISH', payload.id)
	}
  },
  dropBasket(context) {
    context.commit('DROP_BASKET')
  },
  incrementDishCounter(context, id) {
    context.commit('INCREMENT_DISH', id)
  },
  decrementDishCounter(context, id) {
    context.commit('DECREMENT_DISH', id)
  },
  removeFromBasket(context, id) {
    context.commit('REMOVE_FROM_BASKET', id)
  },
  saveRestuarantUrl(context, url) {
    context.commit('SAVE_RESTRUARNT_URL', url)
  },
};

export const mutations = {
	SAVE_RESTRUARNT_URL(state, url) {
	  state.status = '200'
	  state.data.restuarantUrl = url
	},
	SAVE_TO_BASKET(state, payload) {
	  state.status = '200'
	  state.data.dishs.push(payload)
	},
	DROP_BASKET(state) {
	  state.status = '200'
	  state.data.dishs = []
	},
	INCREMENT_DISH(state, payload) {
	  state.status = '200'
	  let dishList = state.data.dishs
	  dishList.find((dish, index) => {
		if (dish.id == payload) {
		  state.data.dishs[index].counter++
		}
	  })
	},
	DECREMENT_DISH(state, payload) {
	  state.status = '200'
	  let dishList = state.data.dishs
	  dishList.find((dish, index) => {
		if (dish.id == payload) {
		  state.data.dishs[index].counter--
		  if (state.data.dishs[index].counter == 0) {
			state.data.dishs.splice(index, 1)
		  }
		}
	  })
	},
	REMOVE_FROM_BASKET(state, id) {
	  state.status = '200'
	  state.data.dishs.filter(dish => {
		return dish !== id
	  })
	},
  };

export const getters = {
  getLatetestRestInfoWithOrder(state) {
    return state.data.restuarantUrl
  },
  getSelectedDishs(state) {
    return state.data.dishs
  },
  getTotalPrice(state) {
    let dl = state.data.dishs
    let totalPrice = 0
    dl.forEach(element => {
      if (element.hasOwnProperty('sizes')) {
        totalPrice += element.selectSize.price * element.counter
      } else {
        totalPrice += element.price * element.counter
      }
    });
    return totalPrice.toFixed(1)
  },
};
