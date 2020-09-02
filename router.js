import Vue from 'vue'
import Router from 'vue-router'

import home from './pages/Home.vue'
import city from './pages/city.vue'
import city2 from './pages/city.vue'
import notFound from './pages/notFound.vue'
import restaurants from './pages/restaurants.vue'
import Checkout from './pages/Checkout.vue'
import CheckoutSuccess from './pages/checkoutSuccess.vue'
import paymantStatus from './pages/paymantStatus.vue'
import multipage from './pages/multipage.vue'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/contacts',
        name: 'contacts',
        component: multipage,
      },
      {
        path: '/delivery',
        name: 'delivery',
        component: multipage,
      },
      {
        path: '/terms-of-use',
        name: 'terms-of-use',
        component: multipage,
      },
      {
        path: '/faq',
        name: 'faq',
        component: multipage,
      },
      {
        path: '/questions',
        name: 'questions',
        component: multipage,
      },
      {
        path: '/partner',
        name: 'partner',
        component: multipage,
      },
      {
        path: '/rabota',
        name: 'rabota',
        component: multipage,
      },
      {
        path: '/business',
        name: 'business',
        component: multipage,
      },
      {
        path: '/404',
        component: notFound,
      },
      {
        path: '/cart',
        name: 'cart',
        component: Checkout,
      },
      {
        path: '/checkout',
        name: 'checkout',
        component: Checkout,
      },
      {
        path: '/',
        component: home,
      },
      {
        path: '/:region',
        component: city,

      },
      {
        path: '/:region/restaurants/category/:alias',
        component: city2,
      },

      {
        path: '/:region/restaurant/:resName',
        name: 'restik',
        component: restaurants,
      },

      {
        path: '/checkout/success',
        name: 'CheckoutSuccess',
        component: CheckoutSuccess,
      },
      {
        path: '/order/online_payment/:status',
        name: 'paymantStatus',
        component: paymantStatus,
      },

    ]
  })
}
