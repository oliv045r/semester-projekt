<template>
  <AuthForm
    title="Opret bruger"
    buttonText="Opret"
    :showUsername="true"
    @submit="register"
  />
  <p>
    Har du allerede en bruger?
    <router-link tabindex="10" class="login-link" to="/log-ind">
      <strong>Log ind her</strong>
    </router-link>
  </p>
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
              currentLevel: 1,
              totalQuestions: 0,  
              correctAnswers: 0 
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

<style scoped>
/* Tydelig knap uden hover */
button {
  display: inline-block;
  background-color: var(--secondary-color); /* Sekundær farve */
  color: var(--text-color);/* Hvid tekst */
  font-size: 1.2rem; /* Stor, tydelig skrift */
  font-weight: bold; 
  text-align: center;
  border: 2px solid #cc5200; /* Tydelig ramme for at forstærke affordance */
  border-radius: 6px; /* Let afrundede hjørner */
  padding: 14px 24px; /* Stor knap med god plads */
  box-shadow: 0 10px 63px rgba(0, 0, 0, 0.2); /* Dybde via skygge */
  cursor: pointer; /* Markør indikerer klikbarhed */
}

/* Fjern hover-effekter */
button:hover,
button:focus,
button:active {
  background-color: var(--secondary-color); /* Behold samme farve ved interaktion */
  border-color: #cc5200;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* Log ind-link styling */
.login-link {
  color: var(--main-color);
  text-decoration: underline;
  font-weight: bold;
}

p {
  color: var(--text-color);
}
</style>
