const pkg = require('./package')


module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: 'nlpaper.challenge - 自然言語処理の国際会議「ACL」の完全読破 !',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'keywords',
        content:
          'nlpaper.challenge, cvpaper.challenge, nlp, natural language processing, paper, challenge, computer vision'
      },
      {
        name: 'description',
        content: '自然言語処理の国際会議「ACL」の完全読破を目指すnlpaper.challenge公式ホームページです。 自然言語処理の発展のため、勉強会や交流会を企画していきます。'
      },
      {
        name: 'author',
        content: 'nlpaper.challenge'
      },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:site_name',
        content: 'nlpaper.challenge'
      },
      {
        property: 'og:title',
        content: 'nlpaper.challenge - 自然言語処理の国際会議「ACL」の完全読破 !'
      },
      {
        property: 'og:description',
        content: '自然言語処理の国際会議「ACL」の完全読破を目指すnlpaper.challenge公式ホームページです。 自然言語処理の発展のため、勉強会や交流会を企画していきます。'
      },
      {
        property: 'og:image',
        content: 'http://xpaperchallenge.org/nlp/images/logo.jpg'
      },
      {
        property: 'og:url',
        content: 'http://xpaperchallenge.org/nlp'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [

  ],

  script: [
    {
      src: "@/assets/js/slider_cvpaperchallenge.js",
      type: "text/javascript"
    }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [,
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt'
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  },

  router: {
    base: '/nlp/'
  }
}
