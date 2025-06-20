import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Layout from '../layout/index.vue'
import HomeView from '../views/HomeView.vue'

import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'HomeView',
        component: HomeView,
        meta: { requiresAuth: true }
      },
      {
        path: 'login',
        name: 'login',
        component: Login
      },
    
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && store.state.isAuthenticated) {
    next({ name: 'HomeView' })
  } else {
    next()
  }
})

export default router