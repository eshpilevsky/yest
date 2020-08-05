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
      console.log('addToBasket -> dishSizes', dishSizes)
      console.log('addToBasket -> payload.selectSize', payload.selectSize)

      let findSize = dishSizes.find((size) => {
        return size.id == payload.selectSize[0].id
      })

      console.log('addToBasket -> findSize', findSize)
      if (findSize == undefined) {
        console.log('save size');
        context.commit('SAVE_TO_BASKET', payload)
      } else {
        console.log('increment', findSize);
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
      console.log('INCREMENT_DISH -> dishSizes', dishSizes)
      console.log('INCREMENT_DISH -> payload.selectSize', payload.selectSize)

      let findSize = dishSizes.findIndex((size) => {
        return size.id == payload.selectSize[0].id
      })

      console.log('INCREMENT_DISH -> findSize', findSize)
      if (findSize !== undefined) {
        state.data.dishs[findDish].selectSize[findSize].count++
      }
    }
  },
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
  DECREMENT_DISH(state, payload) {
    state.status = '200'
    let dishList = state.data.dishs
    dishList.find((dish, index) => {
      if (dish.id == payload) {
        state.data.dishs[index].count--
        if (state.data.dishs[index].count == 0) {
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
      if (element.hasOwnProperty('selectSize')) {
        totalPrice += element.selectSize.price * element.selectSize.count
      }
      //   else {
      //     totalPrice += element.price * element.count
      //   }
    });
    return totalPrice.toFixed(1)
  },
};
