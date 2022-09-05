import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    "nuxt-windicss",
    "nuxt-socket-io",
    [
      "unplugin-icons/nuxt",
      {
        autoInstall: true,
      },
    ],
  ],
  publicRuntimeConfig: {
    BACKEND_HOST: "",
    nuxtSocketIO: {},
  },
  privateRuntimeConfig: {
    BACKEND_HOST: "",
    nuxtSocketIO: {},
  },
});
