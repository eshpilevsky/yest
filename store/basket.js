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
    let dishSizes;
    let findDish = list.find((dish) => {
      return dish.id == payload.id
    })

    if (findDish == undefined) {
      context.commit('SAVE_TO_BASKET', payload)
    } else {
      dishSizes = findDish.selectSize
      let findSize;
      if (dishSizes.id == payload.selectSize.id) {
        findSize = true
      } else {
        findSize = undefined
      }

      if (findSize == undefined) {
        context.commit('SAVE_TO_BASKET', payload)
      } else {
        context.commit('INCREMENT_DISH', payload)
      }
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
  INCREMENT_DISH(state, payload) {
    state.status = '200'
    let dishList = state.data.dishs
    let findDish = dishList.findIndex((dish) => {
      return dish.id == payload.id
    })
    let dishSizes;
    if (findDish !== undefined) {

      dishSizes = state.data.dishs[findDish].selectSize

      let findSize;
      if (dishSizes.id == payload.selectSize.id) {
        findSize = true
      } else {
        findSize = undefined
      }

      if (findSize !== undefined) {
        state.data.dishs[findDish].selectSize.count++
      } else {
        state.data.dishs.push(payload)
      }
    }
  },
  SAVE_RESTRUARNT_URL(state, url) {
    state.status = '200'
	state.data.restuarantUrl = url
	// state.data.restuarantUrl = url
	
  },
  SAVE_TO_BASKET(state, payload) {
    state.status = '200'
    state.data.dishs.push(payload)
  },
  DROP_BASKET(state) {
    state.status = '200'
    state.data.dishs = []
  },
  DECREMENT_DISH(state, payload) {
    state.status = '200'
    let dishList = state.data.dishs
    let findDish = dishList.findIndex((dish) => {
      return dish.id == payload.id
    })
    let dishSizes;
    if (findDish !== undefined) {

      dishSizes = state.data.dishs[findDish].selectSize

      let findSize;
      if (dishSizes.id == payload.selectSize.id) {
        findSize = true
      } else {
        findSize = undefined
      }

      let wellBe = state.data.dishs[findDish].selectSize.count - 1
      if (findSize !== undefined) {
        if (wellBe < 1) {
          state.data.dishs.splice(findDish, 1)
        } else {
          state.data.dishs[findDish].selectSize.count--
        }
      } else {
        state.data.dishs.push(payload)
      }
    }
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
      totalPrice += element.selectSize.price * element.selectSize.count
    });
    return totalPrice.toFixed(1)
  },
};

export const strict = false
