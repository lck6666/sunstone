// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store.js';

const routes = [
  {
    path: '/',
    redirect: '/core-capability'
  },
  {
    path: '/core-capability',
    name: 'CoreCapability',
    component: () => import('../views/CoreCapability.vue')
  },
  {
    path: '/intelligent-qa',
    name: 'IntelligentQA',
    component: () => import('../views/IntelligentQA.vue')
  },
  {
    path: '/capability-co-creation',
    name: 'CapabilityCoCreation',
    component: () => import('../views/CapabilityCoCreation.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/intelligent-qa-login',
    name: 'IntelligentQALogin',
    component: () => import('../views/IntelligentQALogin.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 同步登录状态
  store.syncLoginStatus();

  const isLoggedIn = sessionStorage.getItem('user_id');
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router 