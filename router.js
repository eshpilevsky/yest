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

Vue.use(Router)

import userStore from '@/store/user'
if (process.client) {
	
	console.log('store', userStore.getters['getUserPhoneNumber'])
}

const ifAuthenticated = (to, from, next) => {
	// if (store.getters['user/isAuthenticated']) {
	// 	next()
	// 	return
	// }
	// next('/');
}

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
		// beforeEnter: ifAuthenticated,
      },
		{
        path: '/checkout/success',
        name: 'CheckoutSuccess',
        component: CheckoutSuccess,
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
