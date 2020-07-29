import Vue from 'vue'
import Router from 'vue-router'

import Home from './pages/Home.vue'
import notFound from './pages/notFound.vue'
import restaurants from './pages/restaurants.vue'
import cart from './pages/Cart.vue'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [{
        path: '/',
        component: Home,
        redirect: '/minsk',
        children: [{
          path: ':region',
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
		name:'restik',
        component: restaurants,
      },
      {
		path: '/cart',
		name:'cart',
        component: cart,
      },
    ]
  })
}
