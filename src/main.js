// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './css/style.css'; // Import the global CSS file
import vGesture from './directives/v-gesture';
import { auth } from '@/firebase/firebaseConfig';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

let appMounted = false;

const createMyApp = () => {
  const app = createApp(App);
  app.directive('gesture', vGesture);
  app.use(router);
  return app;
};

auth.onAuthStateChanged((user) => {
  if (!appMounted) {
    createMyApp().mount('#app');
    appMounted = true;
  }
  if (user) {
    console.log('User is logged in:', user); // Debugging line
  } else {
    console.log('No user is logged in'); // Debugging line
  }
});
