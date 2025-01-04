// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import StartPage from './views/StartPage.vue';
import RegisterUser from './views/RegisterUser.vue';
import LogIn from './views/LogIn.vue';
import DifficultySelect from './views/DifficultySelect.vue';
import SwipeGame from './views/SwipeGame.vue';
import QuizGame from './views/QuizGame.vue';
import SwipeResult from './views/SwipeResult.vue';
import QuizResult from './views/QuizResult.vue';
import ManageSwipe from './views/ManageSwipe.vue';
import ManageQuiz from './views/ManageQuiz.vue';
import UserManagement from './views/UserManagement.vue';
import AdminPanel from './views/AdminPanel.vue';
import IntroSwipe from './views/IntroSwipe.vue';
import UserSettings from '@/views/UserSettings.vue';

const routes = [
  { path: '/', component: StartPage },
  { path: '/opret-bruger', component: RegisterUser },
  { path: '/log-ind', component: LogIn },
  { path: '/vælg-sværhedsgrad', component: DifficultySelect, meta: { requiresAuth: true } },
  { path: '/swipe/:level', name: 'Swipe', component: SwipeGame, meta: { requiresAuth: true } },
  { path: '/quiz/:level', name: 'Quiz', component: QuizGame, meta: { requiresAuth: true } },
  { path: '/swipe-resultat/:level', name: 'SwipeResult', component: SwipeResult, meta: { requiresAuth: true } },
  { path: '/quiz-resultat/:level', name: 'QuizResult', component: QuizResult, meta: { requiresAuth: true } },
  { path: '/administrer-swipe', component: ManageSwipe, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/administrer-quiz', component: ManageQuiz, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/administrer-brugere', component: UserManagement, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin', component: AdminPanel, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/intro-swipe', component: IntroSwipe, meta: { requiresAuth: true } },
  { path: '/user-settings', component: UserSettings, meta: { requiresAuth: true } },
  {
    path: '/admin-panel',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user) {
      next({ path: '/log-ind' });
    } else {
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          next();
        } else {
          next({ path: '/' });
        }
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;