const imageminMozjpeg = require('imagemin-mozjpeg')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const isDev = process.env.NODE_ENV !== 'production'

const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'universal',
  modern: 'client',

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s',
    htmlAttrs: {
      lang: 'ru'
    },
    title: process.env.npm_package_name || '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      },
      {
        'http-equiv': 'ScreenOrientation',
        content: 'autoRotate:disabled',
      },
      {
        name: 'robots',
        content: 'noindex',
      },
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.png'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined'
      },
      {
        rel: 'stylesheet',
        href: 'https://yastatic.net/s3/eda-front/prod-www/fonts/YSText-Regular.woff2'
      }
    ],
    noscript: [{
      innerHTML: '<!-- Google Tag Manager (noscript) --><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WDRSHHG"height="0" width="0" style="display:none;visibility:hidden"></iframe><!-- End Google Tag Manager (noscript) -->',
      body: true
	}],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/loading.vue',
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
      src: '~/plugins/vuex-persist',
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
    },
    {
      src: '@/plugins/vue-awesome-swiper',
      ssr: false
    },
    {
      src: '@/plugins/google-tag-manager',
      ssr: false
    },
    {
      src: '@/plugins/mask'
    },
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

  webfontloader: {
    events: false,
    google: {
      families: ['Montserrat:400,500,600:cyrillic&display=swap']
    },
    timeout: 5000
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-trailingslash-module',
    'nuxt-webfontloader',
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
      light: true,
      themes: {
        light: {
          primary: '#00a646',
          secondary: colors.black,
          white: colors.white,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          black: '#000',
          gray: colors.gray
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
  render: {
    // http2: {
    //     push: true,
    //     pushAssets: (req, res, publicPath, preloadFiles) => preloadFiles
    //     .map(f => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`)
    //   },
    // compressor: false,
    resourceHints: false,
    etag: false,
    static: {
      etag: false
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.resolve.symlinks = false
    },
    // vendor: [
    //   'vuelidate'
    // ]

  },
  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },
  telemetry: false,
}
