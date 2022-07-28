import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import(/* webpackChunkName: "setting" */ '../views/Setting.vue')
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
