export const state = () => ({
  data: {
    restuarantUrl: null,
    dishs: [],
    totalPrice: 0,
    orderId: 0
  },
  status: 0
})

export const actions = {
  async addToBasket (context, payload) {
    const list = context.state.data.dishs
    let dishSizes
    const findDish = list.find((dish) => {
      return dish.id == payload.id
    })

    if (findDish == undefined) {
      context.commit('SAVE_TO_BASKET', payload)
    } else {
      dishSizes = findDish.selectSize
      let findSize
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
  dropBasket (context) {
    context.commit('DROP_BASKET')
  },
  incrementDishCounter (context, id) {
    context.commit('INCREMENT_DISH', id)
  },
  decrementDishCounter (context, payload) {
    context.commit('DECREMENT_DISH', payload)
  },
  removeFromBasket (context, id) {
    context.commit('REMOVE_FROM_BASKET', id)
  },
  system_dropBasket (context) {
    context.commit('SYSTEM_DROP_BASKET')
  },
  saveRestuarantUrl (context, url) {
    context.commit('SAVE_RESTRUARNT_URL', url)
  },
  setOrderId (context, id) {
    context.commit('SET_ORDER_ID', id)
  }
}

export const mutations = {
  INCREMENT_DISH (state, payload) {
    state.status = '200'
    const dishList = state.data.dishs
    const findDish = dishList.findIndex((dish) => {
      return dish.id === payload.id
    })
    let dishSizes
    if (findDish !== undefined) {
      dishSizes = state.data.dishs[findDish].selectSize
      let findSize
      if (dishSizes.id === payload.selectSize.id) {
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

    window.dataLayer = window.dataLayer || []
    dataLayer.push({
      ecommerce: {
        add: {
          products: [
            {
              id: payload.selectSize.id,
              name: payload.name,
              price: payload.selectSize.price,
              brand: '',
              category: '',
              quantity: 1
            }
          ]
        }
      },
      event: 'gtm-ee-event',
      'gtm-ee-event-category': 'Enhanced Ecommerce',
      'gtm-ee-event-action': 'Adding a Product to a Shopping Cart',
      'gtm-ee-event-non-interaction': 'False'
    })
  },
  SAVE_RESTRUARNT_URL (state, url) {
    state.status = '200'
    state.data.restuarantUrl = url
  },
  SAVE_TO_BASKET (state, payload) {
    // Добавление товара в корзину в первый раз
    state.status = '200'
    state.data.dishs.push(payload)

    window.dataLayer = window.dataLayer || []
    dataLayer.push({
      ecommerce: {
        add: {
          products: [
            {
              id: payload.selectSize.id,
              name: payload.name,
              price: payload.selectSize.price,
              brand: '',
              category: '',
              quantity: 1
            }
          ]
        }
      },
      event: 'gtm-ee-event',
      'gtm-ee-event-category': 'Enhanced Ecommerce',
      'gtm-ee-event-action': 'Adding a Product to a Shopping Cart',
      'gtm-ee-event-non-interaction': 'False'
    })
  },
  DROP_BASKET (state) {
    window.dataLayer = window.dataLayer || [];

    (state.data.dishs).forEach(function (data) {
      dataLayer.push({
        ecommerce: {
          remove: {
            products: [
              {
                id: data.selectSize.id,
                name: data.name,
                price: data.selectSize.price,
                brand: '',
                category: '',
                quantity: data.selectSize.count
              }
            ]
          }
        },
        event: 'gtm-ee-event',
        'gtm-ee-event-category': 'Enhanced Ecommerce',
        'gtm-ee-event-action': 'DROP_BASKETt',
        'gtm-ee-event-non-interaction': 'False'
      })
    })

    state.status = '200'
    state.data.dishs = []
    state.data.restuarantUrl = null
  },
  DECREMENT_DISH (state, payload) {
    state.status = '200'
    const dishList = state.data.dishs
    const findDish = dishList.findIndex((dish) => {
      return dish.id == payload.id
    })
    let dishSizes
    if (findDish !== undefined) {
      dishSizes = state.data.dishs[findDish].selectSize
      let findSize
      if (dishSizes.id == payload.selectSize.id) {
        findSize = true
      } else {
        findSize = undefined
      }

      const wellBe = state.data.dishs[findDish].selectSize.count - 1
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

    window.dataLayer = window.dataLayer || []
    dataLayer.push({
      ecommerce: {
        remove: {
          products: [
            {
              id: payload.selectSize.id,
              name: payload.name,
              price: payload.selectSize.price,
              brand: '',
              category: '',
              quantity: 1
            }
          ]
        }
      },
      event: 'gtm-ee-event',
      'gtm-ee-event-category': 'Enhanced Ecommerce',
      'gtm-ee-event-action': 'delete a Product from Shopping Cart',
      'gtm-ee-event-non-interaction': 'False'
    })

    console.log('DECREMENT_DISH')
    console.log(payload)
  },
  REMOVE_FROM_BASKET (state, id) {
    console.log('REMOVE_FROM_BASKET')
    state.status = '200'
    state.data.dishs.filter((dish) => {
      console.log(dish)
      return dish !== id
    })
  },
  SET_ORDER_ID (state, id) {
    state.status = '200'
    state.data.orderId = id
  },
  SYSTEM_DROP_BASKET (state, payload) {
    // Добавление товара в корзину в первый раз
    state.status = '200'
    state.data.dishs.push(payload)
  }
}

export const getters = {
  getOrderId (state) {
    return state.data.orderId
  },
  getLatetestRestInfoWithOrder (state) {
    return state.data.restuarantUrl
  },
  getSelectedDishs (state) {
    const dishes = state.data.dishs
    console.log('getSelectedDishs')
    console.log('dishes:', dishes)
    dishes.forEach((dish, key) => {
      if (!dish) {
        delete dishes[key]
      }
    })
    console.log('dishes:', dishes)
    return dishes
  },
  getTotalPrice (state) {
    const dl = state.data.dishs
    const totalPrice = 2

    // if (dl !== null && dl.length > 0) {
    //   dl.forEach((element) => {
    //     let info = (element).selectSize
    //     console.log('info:', info)
    //     totalPrice += info.price * info.count
    //     //   if (element.selectOption.length > 0) {
    //     //     element.selectOption.forEach(option => {
    //     //       if (option.selected.length > 1) {
    //     //         option.selected.forEach(opti => {
    //     //           totalPrice += opti.price == null ? 0 : opti.price[0].price
    //     //         })
    //     //       } else {
    //     //         totalPrice += option.selected.price == null ? 0 : option.selected.price[0].price
    //     //       }
    //     //     })
    //     //     console.error(totalPrice);
    //     //   }
    //   })
    // }

    return totalPrice
  },
  getTotalPriceWithDelivery (state) {
    const dl = state.data.dishs
    const totalPrice = 2

    return totalPrice
  }
}

export const strict = false
