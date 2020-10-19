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
import faq from './pages/miltipage/faq.vue'
import partner from './pages/miltipage/partner.vue'
import contacts from './pages/miltipage/contacts.vue'
import delivery from './pages/miltipage/delivery.vue'
import termsOfUse from './pages/miltipage/terms-of-use.vue'
import questions from './pages/miltipage/questions.vue'
import rabota from './pages/miltipage/rabota.vue'
import business from './pages/miltipage/business.vue'
import profile from './pages/profile.vue'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/profile',
        name: 'profile',
        component: profile
      },
      {
        path: '/profile/:obj',
        name: 'profile_infoPages',
        component: profile
      },
      {
        path: '/contacts',
        name: 'contacts',
        component: contacts,
      },
      {
        path: '/delivery',
        name: 'delivery',
        component: delivery,
      },
      {
        path: '/terms-of-use',
        name: 'terms-of-use',
        component: termsOfUse,
      },
      {
        path: '/faq',
        name: 'faq',
        component: faq,
      },
      {
        path: '/questions',
        name: 'questions',
        component: questions,
      },
      {
        path: '/partner',
        name: 'partner',
        component: partner,
      },
      {
        path: '/rabota',
        name: 'rabota',
        component: rabota,
      },
      {
        path: '/business',
        name: 'business',
        component: business,
      },
      // {
      //   path: '/404',
      //   component: notFound,
      // },
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
        path: '/:region/restaurants/metro/:metro',
        component: city,
      },
      {
        path: '/:region/restaurants/street/:street',
        component: city,
      },
      {
        path: '/:region/restaurants/district/:district',
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

      { path: "*", component: notFound }
    ]
  })
}
