import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';

const routes = [
  { path: '/login', component: () => import('../pages/Login.vue') },
//   { path: '/register', component: () => import('../pages/Register.vue') },
  // { path: '/', component: () => import('../pages/Dashboard.vue'), meta: { requiresAuth: true } },
//   { path: '/profile', component: () => import('../pages/Profile.vue'), meta: { requiresAuth: true } },
//   { path: '/issue', component: () => import('../pages/Issue.vue'), meta: { requiresAuth: true } },
//   { path: '/redeem', component: () => import('../pages/Redeem.vue'), meta: { requiresAuth: true } },
//   { path: '/split', component: () => import('../pages/Split.vue'), meta: { requiresAuth: true } },
//   { path: '/void', component: () => import('../pages/Void.vue'), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;