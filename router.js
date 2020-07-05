import Vue from 'vue'
import Router from 'vue-router'

import Home from './pages/Home.vue'
import restaurants from './pages/restaurants.vue'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [{
        path: '/',
        component: Home,
      },
      {
        path: '/:region',
        component: Home,
      },
      {
        path: '/:region/restaurants/category/:alias',
        component: Home,
      },
      {
        path: '/restaurant/:resName',
        component: restaurants,
      },
    ]
  })
}
