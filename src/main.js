// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './css/style.css'; // Import the global CSS file
import vGesture from './directives/v-gesture';

const app = createApp(App);

app.directive('gesture', vGesture);

app.use(router).mount('#app');
