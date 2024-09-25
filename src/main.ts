import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

async function prepare() {
  const { worker } = await import('./services/api/browser')
  await worker.start()
}

prepare().then(() => {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  app.mount('#app')
})
