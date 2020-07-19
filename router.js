import Vue from 'vue'
import Router from 'vue-router'

import Home from './pages/Home.vue'
import notFound from './pages/notFound.vue'
import restaurants from './pages/restaurants.vue'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [{
		path: '/',
		redirect: '/minsk',
		component: Home,
		children:[{
			path:':region',
			children:[{
				path:'restaurants',
				children:[{
					path:'category',
					children:[{
						path:':alias'
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
        path: '/restaurant/:resName',
        component: restaurants,
      },
    ]
  })
}
