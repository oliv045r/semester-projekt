<template>
  <AuthForm
    title="Opret bruger"
    buttonText="Opret"
    @submit="register"
  />
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import AuthForm from '@/components/authentication/AuthForm.vue';

export default {
  name: 'RegisterUser',
  components: {
    AuthForm
  },
  methods: {
    async register({ email, password }) {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User registered:', userCredential.user);
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  }
};
</script>