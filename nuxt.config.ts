import { defineNuxtConfig } from 'nuxt'
import svgLoader from 'vite-svg-loader'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  buildModules: ['@pinia/nuxt'],
  components: {
    dirs: ['~/components'],
  },
  vite: {
    plugins: [svgLoader({})],
  },
  css: ['~/assets/css/icons.css'],
})
