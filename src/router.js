// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import StartPage from './views/StartPage.vue';
import RegisterUser from './views/RegisterUser.vue';
import LogIn from './views/LogIn.vue';

const routes = [
  { path: '/', component: StartPage },
  { path: '/opret-bruger', component: RegisterUser },
  { path: '/log-ind', component: LogIn }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;