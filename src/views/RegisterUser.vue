<template>
  <AuthForm
    title="Opret bruger"
    buttonText="Opret"
    :showUsername="true"
    @submit="register"
  />
  <p>Har du allerede en bruger? <router-link style="color: var(--text-color);" to="/log-ind"><strong>Log ind her</strong></router-link></p>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import AuthForm from '@/components/authentication/AuthForm.vue';

export default {
  name: 'RegisterUser',
  components: {
    AuthForm
  },
  methods: {
    async register({ email, password, username }) {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User registered:', user);

        // Ensure the user is authenticated before writing to Firestore
        auth.onAuthStateChanged(async (authenticatedUser) => {
          if (authenticatedUser) {
            // Opret et dokument i users-samlingen
            await setDoc(doc(db, "users", authenticatedUser.uid), {
              userId: authenticatedUser.uid,
              email: authenticatedUser.email,
              username: username,
              currentLevel: 1
            });

            // Redirect to the difficulty selection page
            this.$router.push('/vælg-sværhedsgrad');
          }
        });

      } catch (error) {
        console.error('Error registering user:', error);
        if (error.code === 'auth/email-already-in-use') {
          alert('Email is already in use. Please use a different email.');
        } else if (error.code === 'auth/invalid-email') {
          alert('Invalid email. Please enter a valid email.');
        } else if (error.code === 'auth/weak-password') {
          alert('Weak password. Please enter a stronger password.');
        } else {
          alert('Error registering user. Please try again later.');
        }
      }
    }
  }
};
</script>