
import { _replaceAppConfig } from '#app/config'
import { defuFn } from 'defu'

const inlineConfig = {
  "nuxt": {}
}

// Vite - webpack is handled directly in #app/config
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    _replaceAppConfig(newModule.default)
  })
}

import cfg0 from "C:/Users/School/Desktop/FrontendFramework/nuxtjs/projects/PetomanFront/apps/dampezeshki/app.config.ts"

export default /*@__PURE__*/ defuFn(cfg0, inlineConfig)
