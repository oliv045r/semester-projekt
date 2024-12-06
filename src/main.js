// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './css/style.css'; // Import the global CSS file


createApp(App).use(router).mount('#app');
