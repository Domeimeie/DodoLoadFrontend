import { createApp } from 'vue'
import App from './App.vue'

import { createWebHistory, createRouter } from 'vue-router'

import LoginView from './Login.vue'
import FileView from './Files.vue'


const routes = [
  { path: '/', redirect: '/MyFiles' },
  { path: '/Login', component: LoginView },
  { path: '/MyFiles', component: FileView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
createApp(App).use(router).mount('#app')