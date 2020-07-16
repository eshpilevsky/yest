const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [{
      charset: 'utf-8'
    },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
	  },
	  {
		'http-equiv': 'ScreenOrientation',
		content: 'autoRotate:disabled',
	  }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.png'
    },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined'
      }
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
	color: '#00a646',
	height: '10px',
  },
  /*
   ** Global CSS
   */
  css: [
    'material-design-icons-iconfont/dist/material-design-icons.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
    src: '~plugins/vuex-persist',
    ssr: false
  },
    // {
    //   src: '~/plugins/ymapPlugin.js',
    //   mode: 'client'
    // },
    {
      src: '~/plugins/vClickOutside',
      ssr: false
    },
    {
      src: '~/plugins/is-mobile',
      // mode: 'client',
      // ssr: false
	},
	{ src: '@/plugins/vue-awesome-swiper', ssr: false },

  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/router'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#00a646',
          secondary: colors.black,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          black: '#000',
          success: colors.green.accent3
        }
      }
    },
    defaultAssets: {
      font: true,
      icons: 'md'
    },
    icons: {
      iconfont: 'md'
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  vue: {
	config: {
	  productionTip: false,
	  devtools: true
	}
  },
  telemetry: false,
}
