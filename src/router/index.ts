import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    component: () => import('../pages/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    component: () => import('../pages/Register.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    component: () => import('../pages/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/issue',
    component: () => import('../pages/Issue.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/redeem',
    component: () => import('../pages/Redeem.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/split',
    component: () => import('../pages/Split.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/void',
    component: () => import('../pages/Void.vue'),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);

  if (requiresAuth && !token) {
    next('/login');
  } else if (guestOnly && token) {
    next('/');
  } else {
    next();
  }
});

export default router;