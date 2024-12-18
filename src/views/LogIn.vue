<template>
  <div>
    <AuthForm
      title="Log Ind"
      buttonText="Log In"
      :showStayLoggedIn="true"
      @submit="login"
      aria-label="Login form"
    />
    <p>
      Har du ikke en bruger?
      <router-link
        tabindex="10"
        class="login-link"
        to="/opret-bruger"
        aria-label="Create an account"
      >
        <strong>Opret her</strong>
      </router-link>
    </p>
  </div>
</template>

<script>
import { signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import AuthForm from "@/components/authentication/AuthForm.vue";

export default {
  name: "LogIn",
  components: {
    AuthForm,
  },
  methods: {
    async login({ email, password, stayLoggedIn }) {
      if (!email || !password) {
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        if (stayLoggedIn) {
          // Handle stay logged in logic, e.g., setting a persistent session
          await auth.setPersistence(browserLocalPersistence); // This will persist the session even after the browser is closed
        } else {
          await auth.setPersistence(browserSessionPersistence); // This will persist the session only until the browser is closed
        }
        alert("Login successful!");
        this.$router.push("/vælg-sværhedsgrad"); // Redirect to DifficultySelect screen
      } catch (error) {
        console.error("Error logging in user:", error);
        if (error.code === "auth/wrong-password") {
          alert("Invalid password. Please try again.");
        } else if (error.code === "auth/user-not-found") {
          alert("No user found with this email. Please check your email or sign up.");
        } else if (error.code === "auth/invalid-credential") {
          alert("Invalid credentials. Please check your email and password.");
        } else if (error.code === "auth/missing-email") {
          alert("Email is missing. Please enter your email.");
        } else {
          alert("Error logging in. Please try again later.");
        }
      }
    },
  },
};
</script>

<style scoped>
.login-link {
  color: #0066cc;
  text-decoration: underline;
  font-weight: bold;
}
</style>
