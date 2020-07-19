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
		name: 'home',
		redirect: '/minsk',
		component: Home,
		children:[{
			path:':region',
			name:':region',
			children:[{
				path:'restaurants',
				name:'restaurants',
				children:[{
					path:'category',
					name:'category',
					children:[{
						name:'alias',
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
