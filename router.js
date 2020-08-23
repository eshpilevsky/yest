import Vue from 'vue'
import Router from 'vue-router'

import home from './pages/home.vue'
import city from './pages/city.vue'
import notFound from './pages/notFound.vue'
import restaurants from './pages/restaurants.vue'
import Checkout from './pages/Checkout.vue'
import paymantStatus from './pages/paymantStatus.vue'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
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
		children: [{
		  path: 'restaurants',
		  children: [{
			path: 'category',
			children: [{
			  path: ':alias'
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
