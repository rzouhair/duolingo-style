import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { createPinia } from 'pinia'
import App from './App.vue'

import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})

app.use(pinia)
app.use(router)
app.mount('#app')
