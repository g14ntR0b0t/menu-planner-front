// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    'vuetify-nuxt-module'
  ],
  vuetify: {
    moduleOptions: {
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              background: '#FFFFFF',
              primary: '#1976D2',
              secondary: '#424242',
              surface: '#F5F5F5',
              error: '#FF5252'
            }
          },
          dark: {
            dark: true,
            colors: {
              background: '#121212',
              primary: '#BB86FC',
              secondary: '#03DAC6',
              surface: '#1E1E1E',
              error: '#CF6679'
            }
          }
        }
      }
    }
  },
  nitro: {
    devServer: {
      host: '0.0.0.0', // Makes dev server accessible externally
    },
    // For production/build, use environment variables (like NITRO_PORT)
    // or configure 'nitro.host' if needed, but Nitro usually handles '0.0.0.0'
    // via environment variables or default behavior when deployed.
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  }
})