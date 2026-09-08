import { createApp } from 'vue'
import App from './App.vue'

import axios from "axios";
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

export const api = axios.create({ baseURL: "http://127.0.0.1:8000" })

// Add a request interceptor
api.interceptors.request.use(config => {

    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}` 
    else router.push('/Login')
    return config
},
  function (error) {
    // Do something with the request error
    return Promise.reject(error);
  }
);

createApp(App).use(router).mount('#app')