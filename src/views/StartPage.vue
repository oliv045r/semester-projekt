<template>
  <div>
    <img src="@/assets/icons/SmartChoice.svg" alt="">

    <!-- Hvis brugeren er logget ind -->
    <div v-if="user">
      <h2>Hej {{ username }}!</h2>
      <p>Er du klar?</p>
      <div class="btn-container">
        <router-link to="/vælg-sværhedsgrad" aria-label="Vælg niveau">
          <PrimaryButton :secondary="true">Vælg niveau</PrimaryButton>
        </router-link>
        <router-link to="/" aria-label="Log ud">
          <PrimaryButton @click="logout">Log ud</PrimaryButton>
        </router-link>
      </div>
    </div>

    <!-- Hvis brugeren ikke er logget ind -->
    <div v-else class="btn-container">
      <p>Kan du swipe dig til det grønne valg?</p>
      <router-link tabindex="1" to="/opret-bruger" aria-label="Opret Bruger">
        <PrimaryButton>Opret Bruger</PrimaryButton>
      </router-link>
      <router-link tabindex="2" to="/log-ind" aria-label="Log ind">
        <PrimaryButton :secondary="true">Log ind</PrimaryButton>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import PrimaryButton from '@/components/elements/PrimaryButton.vue';

export default {
  name: 'StartPage',
  components: {
    PrimaryButton
  },
  data() {
    return {
      user: null,
      username: ''
    };
  },
  created() {
    const auth = getAuth(); // Initialiserer Firebase Authentication
    
    // Overvåger autentificeringsstatus
    onAuthStateChanged(auth, async (user) => {
      if (user) { // Hvis brugeren er logget ind
        this.user = user; // Gemmer brugerens data

        // Henter brugernavn fra Firestore baseret på brugerens UID
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) { // Hvis dokumentet findes
          this.username = userDoc.data().username; // Sætter brugernavnet
        }
      } else { // Hvis brugeren ikke er logget ind
        this.user = null; // Nulstiller brugerdata
        this.username = ''; // Nulstiller brugernavn
      }
    });
  },
  methods: {
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        this.$router.push('/'); // Tilbage til forsiden efter log ud
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  }
}
</script>

<style scoped>
.btn-container {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 80vw;
  margin-left: auto;
  margin-right: auto;
}

h2 {
  margin-bottom: 5px;
}

p {
  margin-bottom: 10px;
}
</style>
