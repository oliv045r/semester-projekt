// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/firebase/firebaseConfig';
import StartPage from './views/StartPage.vue';
import RegisterUser from './views/RegisterUser.vue';
import LogIn from './views/LogIn.vue';
import DifficultySelect from './views/DifficultySelect.vue';
import Quiz from './views/QuizTemp.vue';
import ResultPage from './views/ResultPage.vue';
import AdminPage from './views/AdminPage.vue';

const routes = [
  { path: '/', component: StartPage },
  { path: '/opret-bruger', component: RegisterUser },
  { path: '/log-ind', component: LogIn },
  { path: '/vælg-sværhedsgrad', component: DifficultySelect, meta: { requiresAuth: true } },
  { path: '/quiz/:quizId/:level', name: 'Quiz', component: Quiz, meta: { requiresAuth: true } },
  { path: '/resultat', component: ResultPage, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !user) {
    next('/log-ind'); // Redirect to login page if not authenticated
  } else if ((to.path === '/log-ind' || to.path === '/opret-bruger') && user) {
    next('/vælg-sværhedsgrad'); // Redirect to DifficultySelect if already authenticated
  } else {
    next();
  }
});

export default router;