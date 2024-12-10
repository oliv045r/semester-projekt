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
  { path: '/quiz/:level', name: 'Quiz', component: Quiz, meta: { requiresAuth: true } },
  { path: '/resultat/:level', name: 'ResultPage', component: ResultPage, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminPage, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log('Navigation Guard:', auth.currentUser); // Debugging line
  if (to.meta.requiresAuth && !auth.currentUser) {
    next('/log-ind');
  } else {
    next();
  }
});

export default router;