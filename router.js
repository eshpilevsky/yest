import Vue from 'vue'
import Router from 'vue-router'

import Home from './pages/Home.vue'
import notFound from './pages/notFound.vue'
import restaurants from './pages/restaurants.vue'
import cart from './pages/Cart.vue'
import paymantStatus from './pages/paymantStatus.vue'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [{
        path: '/cart',
        name: 'cart',
        component: cart,
      },
      {
        path: '/',
        component: Home,
        redirect: '/minsk',
        children: [{
          path: '/:region',
          component: Home,
          children: [{
            path: 'restaurants',
            children: [{
              path: 'category',
              children: [{
                path: ':alias'
              }]
            }]
          }]
        }]
      },
      {
        path: '/404',
        component: notFound,
      },
      {
        path: '/:region/restaurant/:resName',
        name: 'restik',
        component: restaurants,
      },
      {
        path: '/order/onliner_payment/:status',
        name: 'paymantStatus',
        component: paymantStatus,
      },
    ]
  })
}
