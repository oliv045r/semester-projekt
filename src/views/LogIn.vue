<template>
  <AuthForm
    title="Log Ind"
    buttonText="Log In"
    :showStayLoggedIn="true"
    @submit="login"
  />
<p>Har du ikke en bruger? <router-link style="color: var(---text-color);"  to="/opret-bruger"><strong>Opret her</strong></router-link></p>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import AuthForm from '@/components/authentication/AuthForm.vue';

export default {
  name: 'LogIn',
  components: {
    AuthForm
  },
  methods: {
    async login({ email, password, stayLoggedIn }) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in:', userCredential.user);
        if (stayLoggedIn) {
          // Handle stay logged in logic, e.g., setting a persistent session
          auth.setPersistence('local'); // This will persist the session even after the browser is closed
        } else {
          auth.setPersistence('session'); // This will persist the session only until the browser is closed
        }
      } catch (error) {
        console.error('Error logging in user:', error);
      }
    }
  }
};
</script>