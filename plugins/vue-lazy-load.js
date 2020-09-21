import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

export default async (context, inject) => {
  Vue.use(VueLazyload, {
    preLoad: 0,
    error: 'https://yastatic.net/s3/eda-front/www/assets/dish-0fda7249b2041a3a76910e9166ad7cde.jpg',
    // eslint-disable-next-line
    loading: require(`${'~/assets/svg/download.svg'}`),
    attempt: 3,
    lazyComponent: true,
    observer: true,
    throttleWait: 500
  })
}
