/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  ssr: false,
  target: 'static',
  generate: {
    subFolders: false,
  },
  head: {
    title: 'Kōan',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'X-UA-Compatible', 'content': 'ie=edge' },
      {
        hid: 'description',
        name: 'description',
        content: 'Boards, lists and cards based organization software',
      },
    ],
  },
  loading: false,
  plugins: ['~/plugins/vue-i18n'],
  buildModules: ['@nuxtjs/tailwindcss'],
  modules: [],
}
