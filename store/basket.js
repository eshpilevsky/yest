export const state = () => ({
  data: {
    restuarantUrl: null,
    dishs: [],
    totalPrice: 0,
    orderId: 0,
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
  decrementDishCounter(context, payload) {
    context.commit('DECREMENT_DISH', payload)
  },
  removeFromBasket(context, id) {
    context.commit('REMOVE_FROM_BASKET', id)
  },
  saveRestuarantUrl(context, url) {
    context.commit('SAVE_RESTRUARNT_URL', url)
  },
  setOrderId(context, id) {
    context.commit('SET_ORDER_ID', id)
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
    state.data.restuarantUrl = null
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
          if (state.data.dishs.length == 0) {
            state.data.restuarantUrl = null
          }
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
  SET_ORDER_ID(state, id) {
    state.status = '200'
    state.data.orderId = id
  },
};

export const getters = {
  getOrderId(state) {
    return state.data.orderId
  },
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
    //   if (element.selectOption.length > 0) {
    //     element.selectOption.forEach(option => {
    //       if (option.selected.length > 1) {
    //         option.selected.forEach(opti => {
    //           totalPrice += opti.price == null ? 0 : opti.price[0].price
    //         })
    //       } else {
    //         totalPrice += option.selected.price == null ? 0 : option.selected.price[0].price
    //       }
    //     })
    //     console.error(totalPrice);
    //   }
    });


    // let mass = state.data.restuarantUrl == null ? 0 : state.data.restuarantUrl.delivery.fee
    // let addDeliveryPrice = 0
    // if (mass !== 0) {
    //   function la(mass) {
    //     let finded = mass.find((cost) => {
    //       return cost.min < totalPrice && totalPrice < cost.max
    //     })
    //     if (finded !== undefined) {
    //       if (finded.hasOwnProperty('delivery')) {
    //         return parseInt(finded.delivery)
    //       } else {
    //         return parseInt(finded.deliveryFee)
    //       }
    //     } else {
    //       return parseInt(mass[mass.length - 1].deliveryFee)
    //     }

    //   }
    //   addDeliveryPrice = la(mass)

    // } else {
    //   addDeliveryPrice = 0
    // }
    // return parseFloat(totalPrice) + addDeliveryPrice
    return totalPrice
  },
};

export const strict = false
